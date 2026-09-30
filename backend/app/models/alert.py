from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.db.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. ALT-2026-008
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    prediction_id = Column(Integer, ForeignKey("predictions.id"), nullable=True)
    
    candidate_zone = Column(String(200), nullable=False)
    time_window = Column(String(100), nullable=False)
    risk_level = Column(String(50), default="High", nullable=False) # High, Medium, Low
    
    review_status = Column(String(50), default="Pending Review", nullable=False) # Pending Review, Verified Lead, Dismissed, Action Taken
    assigned_officer_name = Column(String(255), nullable=True)
    decision_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    complaint = relationship("Complaint", back_populates="alerts")
    prediction = relationship("Prediction", back_populates="alerts")
