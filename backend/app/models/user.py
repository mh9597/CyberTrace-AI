import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from backend.app.db.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    INVESTIGATOR = "investigator"
    SENIOR_OFFICER = "senior_officer"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default=UserRole.INVESTIGATOR.value, nullable=False)
    badge_number = Column(String(50), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    complaints = relationship("Complaint", back_populates="assigned_officer_rel", foreign_keys="Complaint.assigned_officer_id")
    audit_logs = relationship("AuditLog", back_populates="user")
