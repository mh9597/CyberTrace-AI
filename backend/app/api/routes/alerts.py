from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.api.deps import get_current_principal
from backend.app.domain.entities import UserPrincipal
from backend.app.schemas.alert import AlertResponse, AlertUpdate, AlertNoteCreate
from backend.app.services.alert_service import (
    get_alerts,
    get_alert_by_id,
    update_alert,
    append_alert_note,
)
from backend.app.services.audit_service import log_audit_event

router = APIRouter(prefix="/alerts", tags=["Alerts & Investigation Workflow"])


@router.get("", response_model=List[AlertResponse])
def list_alerts(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    review_status: Optional[str] = None,
    risk_level: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
):
    alerts = get_alerts(db, skip=skip, limit=limit, review_status=review_status, risk_level=risk_level)
    return [AlertResponse.model_validate(a) for a in alerts]


@router.patch("/{alert_id}", response_model=AlertResponse)
def update_alert_review(
    alert_id: int,
    data: AlertUpdate,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
):
    alert = get_alert_by_id(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert record not found")

    updated = update_alert(db, alert, data)
    log_audit_event(
        db=db,
        action="ALERT_REVIEW_UPDATE",
        target_record=alert.alert_code,
        user_id=current_user.id,
        user_email=current_user.username,
        details=f"Review status changed to '{data.review_status}'. Notes: {data.decision_notes}",
    )
    return AlertResponse.model_validate(updated)


@router.post("/{alert_id}/notes", response_model=AlertResponse)
def add_note_to_alert(
    alert_id: int,
    data: AlertNoteCreate,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
):
    alert = get_alert_by_id(db, alert_id)
    if not alert:
        raise HTTPException(status_code=404, detail="Alert record not found")

    updated = append_alert_note(db, alert, data.note, officer_name=current_user.full_name)
    log_audit_event(
        db=db,
        action="ALERT_NOTE_APPENDED",
        target_record=alert.alert_code,
        user_id=current_user.id,
        user_email=current_user.email,
        details=f"Added note: {data.note}",
    )
    return AlertResponse.model_validate(updated)
