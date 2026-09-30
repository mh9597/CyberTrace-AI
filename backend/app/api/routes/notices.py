from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from backend.app.db.database import get_db
from backend.app.api.deps import get_current_principal
from backend.app.domain.entities import UserPrincipal
from backend.app.services.notice_service import (
    calculate_golden_hour_status,
    generate_bank_freeze_notice,
)
from backend.app.services.audit_service import log_audit_event

router = APIRouter(prefix="/complaints", tags=["Pillar 1: Legal Notices & Golden Hour Engine"])


@router.get("/{complaint_id}/golden-hour")
def get_case_golden_hour(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
) -> Dict[str, Any]:
    try:
        return calculate_golden_hour_status(db, complaint_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{complaint_id}/freeze-notice")
def create_statutory_freeze_notice(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
) -> Dict[str, Any]:
    try:
        notice = generate_bank_freeze_notice(db, complaint_id, current_user)
        log_audit_event(
            db=db,
            action="BANK_FREEZE_NOTICE_ISSUED",
            target_record=complaint_id,
            user_id=current_user.id,
            user_email=current_user.username,
            details=f"Statutory Notice {notice['notice_id']} generated for {notice['target_bank']['bank_name']}. Target Account: {notice['mule_target']['account_number']}",
        )
        return notice
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
