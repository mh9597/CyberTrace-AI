from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.core.security import verify_password, create_access_token, get_password_hash
from backend.app.models.user import User, UserRole
from backend.app.schemas.auth import LoginRequest, SignupRequest, TokenResponse, UserResponse
from backend.app.services.audit_service import log_audit_event
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
