from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.api.deps import get_current_principal, require_role
from backend.app.domain.entities import UserPrincipal
from backend.app.services.audit_service import get_audit_logs, verify_evidence_hash

router = APIRouter(prefix="/security", tags=["Security Center & Audit Verification"])


@router.get("/audit-logs")
def list_audit_trail(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    action: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
):
    logs, total = get_audit_logs(db, skip=skip, limit=limit, action=action)
    return {
        "total": total,
        "logs": [
            {
                "id": l.id,
                "timestamp": l.timestamp.strftime("%Y-%m-%d %H:%M:%S UTC"),
                "action": l.action,
                "target_record": l.target_record,
                "user_email": l.user_email or "System Worker",
                "ip_address": l.ip_address,
                "outcome": l.outcome,
                "details": l.details,
            }
            for l in logs
        ],
    }


@router.get("/evidence/{evidence_id}/integrity")
def check_evidence_integrity(
    evidence_id: int,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
):
    res = verify_evidence_hash(db, evidence_id)
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res
