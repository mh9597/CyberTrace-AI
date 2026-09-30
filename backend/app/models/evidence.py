from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, BigInteger
from sqlalchemy.orm import relationship
from backend.app.db.database import Base


class EvidenceFile(Base):
    __tablename__ = "evidence_files"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_size_bytes = Column(BigInteger, nullable=False)
    mime_type = Column(String(100), default="text/csv")
    sha256_hash = Column(String(64), nullable=False, index=True) # Cryptographic checksum
    storage_path = Column(String(500), nullable=True)
    uploaded_by = Column(String(255), default="System Demo")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    complaint = relationship("Complaint", back_populates="evidence_files")
