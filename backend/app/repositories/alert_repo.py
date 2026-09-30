from typing import List, Optional
from sqlalchemy.orm import Session
from backend.app.models.alert import Alert
from backend.app.repositories.base import BaseRepository


class AlertRepository(BaseRepository[Alert]):
    def __init__(self, db: Session):
        super().__init__(db, Alert)

    def list_filtered(
        self,
        skip: int = 0,
        limit: int = 50,
        status: Optional[str] = None,
        priority: Optional[str] = None,
    ) -> List[Alert]:
        query = self.db.query(Alert)
        if status:
            query = query.filter(Alert.status == status)
        if priority:
            query = query.filter(Alert.priority == priority)
        return query.order_by(Alert.created_at.desc()).offset(skip).limit(limit).all()

    def get_by_complaint(self, complaint_id: str) -> List[Alert]:
        return (
            self.db.query(Alert)
            .filter(Alert.complaint_id == complaint_id)
            .order_by(Alert.created_at.desc())
            .all()
        )
