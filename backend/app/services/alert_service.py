from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.app.models.alert import Alert
from backend.app.schemas.alert import AlertUpdate


def get_alerts(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    review_status: Optional[str] = None,
    risk_level: Optional[str] = None,
) -> List[Alert]:
    query = db.query(Alert)
    if review_status:
        query = query.filter(Alert.review_status == review_status)
    if risk_level:
        query = query.filter(Alert.risk_level == risk_level)
    return query.order_by(desc(Alert.created_at)).offset(skip).limit(limit).all()


def get_alert_by_id(db: Session, alert_id: int) -> Optional[Alert]:
    return db.query(Alert).filter(Alert.id == alert_id).first()


def update_alert(db: Session, alert: Alert, data: AlertUpdate) -> Alert:
    alert.review_status = data.review_status
    if data.assigned_officer_name:
        alert.assigned_officer_name = data.assigned_officer_name
    if data.decision_notes:
        if alert.decision_notes:
            alert.decision_notes += f"\n[{data.review_status}] {data.decision_notes}"
        else:
            alert.decision_notes = data.decision_notes
    db.commit()
    db.refresh(alert)
    return alert


def append_alert_note(db: Session, alert: Alert, note: str, officer_name: str = "Officer") -> Alert:
    timestamp_str = alert.updated_at.strftime("%Y-%m-%d %H:%M")
    entry = f"\n[{timestamp_str} by {officer_name}]: {note}"
    alert.decision_notes = (alert.decision_notes or "") + entry
    db.commit()
    db.refresh(alert)
    return alert
