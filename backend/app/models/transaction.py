from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.app.db.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    txn_reference = Column(String(100), index=True, nullable=False) # e.g. TXN-DEMO-001
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    
    # Pseudonymized account identifiers to preserve privacy
    source_account = Column(String(100), index=True, nullable=False) # e.g. ACC-MULE-8812
    dest_account = Column(String(100), index=True, nullable=False)   # e.g. ACC-MULE-9934
    
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    timestamp = Column(DateTime, nullable=False)
    txn_type = Column(String(50), default="UPI", nullable=False) # UPI, IMPS, NEFT, ATM_WITHDRAWAL
    
    # Optional geospatial coordinates for authorized records or withdrawal points
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    city = Column(String(100), nullable=True)
    zone_name = Column(String(150), nullable=True)
    atm_id = Column(String(100), nullable=True)
    
    is_cash_out = Column(Boolean, default=False)
    hop_level = Column(Integer, default=1) # 1 = Layer 1 mule, 2 = Layer 2 mule, 3 = Cash-out
    suspicious_flags = Column(String(255), nullable=True) # "RAPID_HOP,REPEATED_MULE,IRREGULAR_INTERVAL"
    data_provenance = Column(String(255), default="Synthetic Demonstration Dataset")
    
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    complaint = relationship("Complaint", back_populates="transactions")
