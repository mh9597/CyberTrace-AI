from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.app.db.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    
    model_version = Column(String(50), default="RandomForest-DBSCAN-v1.0")
    candidate_zone = Column(String(200), nullable=False) # e.g. "Connaught Place / Janpath Hub, New Delhi"
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    radius_km = Column(Float, default=1.5)
    
    # Time window estimation
    time_window_start = Column(DateTime, nullable=False)
    time_window_end = Column(DateTime, nullable=False)
    
    # Calibrated Risk & Uncertainty
    risk_estimate = Column(Float, nullable=False) # 0.0 - 1.0
    risk_band = Column(String(50), default="High") # High, Medium, Low
    uncertainty_score = Column(Float, default=0.18) # 0.0 - 1.0
    
    # Provenance and Honest Disclaimers
    is_heuristic_analysis = Column(Boolean, default=False)
    supporting_factors = Column(JSON, nullable=True) # {"rapid_hops": 3, "hotspot_density": 0.88, "historical_match": "ATM-Zone-CP-4"}
    disclaimer = Column(String(255), default="Synthetic Investigative Lead. Human verification required before action.")
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    complaint = relationship("Complaint", back_populates="predictions")
    alerts = relationship("Alert", back_populates="prediction")
