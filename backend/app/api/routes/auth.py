from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.core.security import verify_password, create_access_token
from backend.app.models.user import User
from backend.app.schemas.auth import LoginRequest, TokenResponse, UserResponse
from backend.app.services.audit_service import log_audit_event
from backend.app.api.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication & Access Control"])


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
