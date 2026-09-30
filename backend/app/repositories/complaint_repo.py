from typing import Optional, List
from sqlalchemy.orm import Session
from backend.app.models.complaint import Complaint
from backend.app.models.evidence import EvidenceFile
from backend.app.repositories.base import BaseRepository


class ComplaintRepository(BaseRepository[Complaint]):
    def __init__(self, db: Session):
        super().__init__(db, Complaint)

    def get_by_complaint_id(self, complaint_id: str) -> Optional[Complaint]:
        return (
            self.db.query(Complaint)
            .filter(Complaint.complaint_id == complaint_id)
            .first()
        )

    def list_filtered(
        self,
        skip: int = 0,
        limit: int = 50,
        status: Optional[str] = None,
        category: Optional[str] = None,
    ) -> List[Complaint]:
        query = self.db.query(Complaint)
        if status:
            query = query.filter(Complaint.status == status)
        if category:
            query = query.filter(Complaint.category == category)
        return query.order_by(Complaint.created_at.desc()).offset(skip).limit(limit).all()

    def get_evidence(self, complaint_id: int) -> List[EvidenceFile]:
        return (
            self.db.query(EvidenceFile)
            .filter(EvidenceFile.complaint_id == complaint_id)
            .all()
        )

    def add_evidence(self, evidence: EvidenceFile) -> EvidenceFile:
        self.db.add(evidence)
        self.db.commit()
        self.db.refresh(evidence)
        return evidence
