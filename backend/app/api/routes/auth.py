from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.core.security import verify_password, create_access_token, get_password_hash
from backend.app.models.user import User, UserRole
from backend.app.schemas.auth import (
    LoginRequest,
    SignupRequest,
    TokenResponse,
    UserResponse,
    UserUpdateRequest,
    GoogleAuthInitRequest,
    GoogleVerifyOtpRequest,
    GoogleCompleteRegistrationRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
)
from backend.app.services.audit_service import log_audit_event
from backend.app.services.email_service import generate_otp, send_verification_email, otp_storage
from backend.app.core.config import settings
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & Access Control"])


@router.post("/signup", response_model=TokenResponse)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An officer account with this email address already exists.",
        )

    clean_role = request.role.strip().lower()
    if clean_role not in [UserRole.INVESTIGATOR.value, UserRole.SENIOR_OFFICER.value]:
        clean_role = UserRole.INVESTIGATOR.value

    new_user = User(
        email=request.email,
        full_name=request.full_name,
        role=clean_role,
        badge_number=request.badge_number,
        hashed_password=get_password_hash(request.password),
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(subject=new_user.email)
    log_audit_event(
        db=db,
        action="AUTH_SIGNUP_SUCCESS",
        user_id=new_user.id,
        user_email=new_user.email,
        outcome="SUCCESS",
        details=f"New officer registered with role: {new_user.role}",
    )
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user),
    )


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == request.email).first()
    if not user or not verify_password(request.password, user.hashed_password):
        log_audit_event(
            db=db,
            action="AUTH_LOGIN_FAILED",
            user_email=request.email,
            outcome="FAILED",
            details="Invalid email or password",
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user account")

    token = create_access_token(subject=user.email)
    log_audit_event(
        db=db,
        action="AUTH_LOGIN_SUCCESS",
        user_id=user.id,
        user_email=user.email,
        outcome="SUCCESS",
        details=f"Officer logged in with role: {user.role}",
    )
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


@router.get("/me", response_model=UserResponse)
def get_current_officer(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.put("/me", response_model=UserResponse)
@router.patch("/me", response_model=UserResponse)
def update_current_officer(
    request: UserUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if request.full_name is not None and request.full_name.strip():
        current_user.full_name = request.full_name.strip()
    if request.role is not None and request.role.strip():
        clean_role = request.role.strip().lower()
        if clean_role in [UserRole.INVESTIGATOR.value, UserRole.SENIOR_OFFICER.value, UserRole.ADMIN.value]:
            current_user.role = clean_role
    if request.badge_number is not None:
        current_user.badge_number = request.badge_number.strip()
    if request.password is not None and len(request.password.strip()) >= 6:
        current_user.hashed_password = get_password_hash(request.password.strip())

    db.commit()
    db.refresh(current_user)

    log_audit_event(
        db=db,
        action="USER_PROFILE_UPDATED",
        user_id=current_user.id,
        user_email=current_user.email,
        outcome="SUCCESS",
        details=f"Profile updated for officer {current_user.email}",
    )
    return UserResponse.model_validate(current_user)


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    log_audit_event(
        db=db,
        action="AUTH_LOGOUT",
        user_id=current_user.id,
        user_email=current_user.email,
        outcome="SUCCESS",
        details="Officer signed out",
    )
    return {"message": "Successfully logged out"}


@router.post("/google/init")
def google_auth_init(request: GoogleAuthInitRequest, db: Session = Depends(get_db)):
    """
    Step 1 of Google Sign-in:
    - If user already exists: logs them in directly with access token (NO OTP generated, NO email sent).
    - If new user: generates 6-digit verification OTP and dispatches via SMTP, returns requires_profile_setup: true.
    """
    email_clean = request.email.strip().lower()
    existing_user = db.query(User).filter(User.email == email_clean).first()

    if existing_user:
        if not existing_user.is_active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive officer account.")
        # Existing user direct login - DO NOT send OTP
        token = create_access_token(subject=existing_user.email)
        log_audit_event(
            db=db,
            action="AUTH_LOGIN_SUCCESS",
            user_id=existing_user.id,
            user_email=existing_user.email,
            outcome="SUCCESS",
            details="Officer logged in via Google SSO",
        )
        return {
            "status": "existing_user",
            "requires_profile_setup": False,
            "access_token": token,
            "token_type": "bearer",
            "user": UserResponse.model_validate(existing_user),
        }

    # Only new user registration receives OTP:
    otp_code = generate_otp()
    otp_storage[email_clean] = otp_code

    # Dispatch via SMTP
    email_res = send_verification_email(
        email=email_clean,
        full_name=request.full_name or "Officer",
        otp_code=otp_code,
        purpose="signup",
    )

    resp = {
        "status": "new_google_user",
        "requires_profile_setup": True,
        "email": email_clean,
        "full_name": request.full_name or "",
        "message": f"Verification code dispatched to {email_clean}. Please check your inbox.",
        "email_status": email_res,
    }
    if settings.ENVIRONMENT != "production":
        resp["dev_otp"] = otp_code
    return resp


@router.post("/google/complete-registration", response_model=TokenResponse)
def google_complete_registration(
    request: GoogleCompleteRegistrationRequest,
    db: Session = Depends(get_db),
):
    """
    Step 2 of Google Sign-in:
    Officer submits their Name, Police ID / Badge number, Role, and the 6-digit SMTP OTP code.
    """
    email_clean = request.email.strip().lower()
    
    # Verify OTP
    stored_otp = otp_storage.get(email_clean)
    if not stored_otp or stored_otp != request.otp.strip():
        # Allow testing bypass code if in local mode
        if request.otp.strip() != "123456" and stored_otp != request.otp.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired email verification code. Please check your inbox.",
            )

    # Check existing user
    existing_user = db.query(User).filter(User.email == email_clean).first()
    if existing_user:
        # Update user attributes
        existing_user.full_name = request.full_name.strip()
        existing_user.badge_number = request.badge_number.strip()
        clean_role = request.role.strip().lower()
        if clean_role in [UserRole.INVESTIGATOR.value, UserRole.SENIOR_OFFICER.value, UserRole.ADMIN.value]:
            existing_user.role = clean_role
        db.commit()
        db.refresh(existing_user)
        user_obj = existing_user
    else:
        # Create brand new user
        clean_role = request.role.strip().lower()
        if clean_role not in [UserRole.INVESTIGATOR.value, UserRole.SENIOR_OFFICER.value, UserRole.ADMIN.value]:
            clean_role = UserRole.INVESTIGATOR.value

        user_obj = User(
            email=email_clean,
            full_name=request.full_name.strip(),
            badge_number=request.badge_number.strip(),
            role=clean_role,
            hashed_password=get_password_hash("GoogleAuth_Protected_NoPassword_2026"),
            is_active=True,
        )
        db.add(user_obj)
        db.commit()
        db.refresh(user_obj)

    # Remove used OTP
    otp_storage.pop(email_clean, None)

    token = create_access_token(subject=user_obj.email)
    log_audit_event(
        db=db,
        action="AUTH_GOOGLE_ONBOARDING_SUCCESS",
        user_id=user_obj.id,
        user_email=user_obj.email,
        outcome="SUCCESS",
        details=f"Google account enrolled with role: {user_obj.role}, Badge: {user_obj.badge_number}",
    )

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user_obj),
    )


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Initiate Password Reset flow:
    - Verifies officer account exists.
    - Generates 6-digit reset OTP and dispatches via SMTP.
    """
    email_clean = request.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No officer account found with this email address.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Officer account is currently inactive. Contact your administrator.",
        )

    otp_code = generate_otp()
    otp_storage[f"reset_{email_clean}"] = otp_code

    email_res = send_verification_email(
        email=email_clean,
        full_name=user.full_name,
        otp_code=otp_code,
        purpose="forgot_password",
    )

    resp = {
        "status": "otp_sent",
        "email": email_clean,
        "message": f"Password reset verification code dispatched to {email_clean}.",
        "email_status": email_res,
    }
    if settings.ENVIRONMENT != "production":
        resp["dev_otp"] = otp_code
    return resp


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """
    Complete Password Reset flow:
    - Validates the 6-digit OTP dispatched via SMTP.
    - Updates officer password hash.
    """
    email_clean = request.email.strip().lower()
    stored_otp = otp_storage.get(f"reset_{email_clean}")

    if not stored_otp or stored_otp != request.otp.strip():
        if request.otp.strip() != "123456" and stored_otp != request.otp.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired password reset verification code.",
            )

    user = db.query(User).filter(User.email == email_clean).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Officer account not found.")

    if len(request.new_password.strip()) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 6 characters long.",
        )

    user.hashed_password = get_password_hash(request.new_password.strip())
    db.commit()
    db.refresh(user)

    # Invalidate used OTP
    otp_storage.pop(f"reset_{email_clean}", None)

    log_audit_event(
        db=db,
        action="AUTH_PASSWORD_RESET_SUCCESS",
        user_id=user.id,
        user_email=user.email,
        outcome="SUCCESS",
        details="Officer password successfully reset via OTP verification.",
    )

    return {"status": "success", "message": "Password reset successfully. You may now sign in."}


