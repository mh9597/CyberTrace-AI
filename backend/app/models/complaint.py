import enum
from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from backend.app.db.database import Base


class ComplaintStatus(str, enum.Enum):
    NEW = "New"
    UNDER_ANALYSIS = "Under Analysis"
    ALERT_GENERATED = "Alert Generated"
    UNDER_INVESTIGATION = "Under Investigation"
    RESOLVED = "Resolved"
    DISMISSED = "Dismissed"


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(String(100), unique=True, index=True, nullable=False) # e.g. CT-2026-001
    victim_name = Column(String(255), nullable=True) # Pseudonymized demo
    victim_phone = Column(String(50), nullable=True)  # Masked
    fraud_type = Column(String(100), nullable=False) # UPI/payment fraud, Phishing, Investment Scam
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    transaction_reference = Column(String(255), nullable=True)
    reported_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    status = Column(String(50), default=ComplaintStatus.NEW.value, nullable=False)
    assigned_officer_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    notes = Column(Text, nullable=True)
    is_synthetic_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    assigned_officer_rel = relationship("User", back_populates="complaints", foreign_keys=[assigned_officer_id])
    transactions = relationship("Transaction", back_populates="complaint", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="complaint", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="complaint", cascade="all, delete-orphan")
    evidence_files = relationship("EvidenceFile", back_populates="complaint", cascade="all, delete-orphan")
