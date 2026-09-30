from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime
from backend.app.models.audit_log import AuditLog
from backend.app.repositories.base import BaseRepository


class AuditRepository(BaseRepository[AuditLog]):
    def __init__(self, db: Session):
        super().__init__(db, AuditLog)

    def append_log(
        self,
        event_type: str,
        description: str,
        user_id: Optional[int] = None,
        complaint_id: Optional[str] = None,
        ip_address: Optional[str] = None,
        metadata_payload: Optional[Dict[str, Any]] = None,
    ) -> AuditLog:
        log_entry = AuditLog(
            event_type=event_type,
            description=description,
            user_id=user_id,
            complaint_id=complaint_id,
            ip_address=ip_address,
            metadata_payload=metadata_payload or {},
            created_at=datetime.utcnow(),
        )
        self.db.add(log_entry)
        self.db.commit()
        self.db.refresh(log_entry)
        return log_entry

    def list_recent(
        self,
        skip: int = 0,
        limit: int = 100,
        complaint_id: Optional[str] = None,
        event_type: Optional[str] = None,
    ) -> List[AuditLog]:
        query = self.db.query(AuditLog)
        if complaint_id:
            query = query.filter(AuditLog.complaint_id == complaint_id)
        if event_type:
            query = query.filter(AuditLog.event_type == event_type)
        return query.order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
