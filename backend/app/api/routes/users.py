from typing import List, Optional
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.db.database import get_db
from backend.app.api.deps import require_principal_role
from backend.app.domain.entities import UserPrincipal
from backend.app.models.user import User, UserRole
from backend.app.core.security import get_password_hash
from backend.app.schemas.auth import UserResponse
from backend.app.services.audit_service import log_audit_event

router = APIRouter(prefix="/users", tags=["Admin User Governance & Role Management"])


class AdminCreateUserRequest(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    role: str = "investigator"
    badge_number: Optional[str] = None


class AdminUpdateUserRoleRequest(BaseModel):
    role: str


class AdminUpdateUserStatusRequest(BaseModel):
    is_active: bool


@router.get("", response_model=List[UserResponse])
def list_system_users(
    db: Session = Depends(get_db),
    current_admin: UserPrincipal = Depends(require_principal_role(["admin"])),
):
    """Admin-only endpoint to list all platform users and roles."""
    users = db.query(User).order_by(desc(User.created_at)).all()
    return [UserResponse.model_validate(u) for u in users]


@router.post("", response_model=UserResponse)
def create_system_user(
    data: AdminCreateUserRequest,
    db: Session = Depends(get_db),
    current_admin: UserPrincipal = Depends(require_principal_role(["admin"])),
):
    """Admin-only endpoint to create new officer credentials."""
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists.",
        )

    clean_role = data.role.strip().lower()
    if clean_role not in [UserRole.INVESTIGATOR.value, UserRole.SENIOR_OFFICER.value, UserRole.ADMIN.value]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role '{data.role}'. Allowed roles: {[r.value for r in UserRole]}",
        )

    new_user = User(
        email=data.email,
        full_name=data.full_name,
        role=clean_role,
        badge_number=data.badge_number,
        hashed_password=get_password_hash(data.password),
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    log_audit_event(
        db=db,
        action="USER_CREATED_BY_ADMIN",
        target_record=new_user.email,
        user_id=current_admin.id,
        user_email=current_admin.username,
        outcome="SUCCESS",
        details=f"Admin created officer {new_user.email} with role {new_user.role}",
    )
    return UserResponse.model_validate(new_user)


@router.patch("/{user_id}/role", response_model=UserResponse)
def update_user_role(
    user_id: int,
    data: AdminUpdateUserRoleRequest,
    db: Session = Depends(get_db),
    current_admin: UserPrincipal = Depends(require_principal_role(["admin"])),
):
    """Admin-only endpoint to assign or revoke roles."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User record not found")

    clean_role = data.role.strip().lower()
    if clean_role not in [UserRole.INVESTIGATOR.value, UserRole.SENIOR_OFFICER.value, UserRole.ADMIN.value]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role '{data.role}'. Allowed roles: {[r.value for r in UserRole]}",
        )

    old_role = user.role
    user.role = clean_role
    db.commit()
    db.refresh(user)

    log_audit_event(
        db=db,
        action="USER_ROLE_CHANGED",
        target_record=user.email,
        user_id=current_admin.id,
        user_email=current_admin.username,
        outcome="SUCCESS",
        details=f"Role changed from {old_role} to {user.role}",
    )
    return UserResponse.model_validate(user)


@router.patch("/{user_id}/status", response_model=UserResponse)
def toggle_user_active_status(
    user_id: int,
    data: AdminUpdateUserStatusRequest,
    db: Session = Depends(get_db),
    current_admin: UserPrincipal = Depends(require_principal_role(["admin"])),
):
    """Admin-only endpoint to activate or deactivate accounts."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User record not found")

    if user.id == current_admin.id and not data.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Administrators cannot deactivate their own session account.",
        )

    user.is_active = data.is_active
    db.commit()
    db.refresh(user)

    log_audit_event(
        db=db,
        action="USER_STATUS_TOGGLED",
        target_record=user.email,
        user_id=current_admin.id,
        user_email=current_admin.username,
        outcome="SUCCESS",
        details=f"User account active status set to {user.is_active}",
    )
    return UserResponse.model_validate(user)
