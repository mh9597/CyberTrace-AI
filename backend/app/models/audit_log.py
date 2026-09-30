from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.db.database import Base


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_email = Column(String(255), nullable=True)
    action = Column(String(100), nullable=False) # e.g. "AUTH_LOGIN", "CASE_REGISTRATION", "PREDICTION_RUN", "ALERT_VERIFIED"
    target_record = Column(String(255), nullable=True) # e.g. "CT-2026-001"
    ip_address = Column(String(50), default="127.0.0.1")
    outcome = Column(String(50), default="SUCCESS") # SUCCESS, FAILED, DENIED
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)

    # Relationships
    user = relationship("User", back_populates="audit_logs")
