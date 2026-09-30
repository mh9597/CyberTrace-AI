from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from backend.app.models.complaint import Complaint, ComplaintStatus
from backend.app.models.transaction import Transaction
from backend.app.schemas.complaint import ComplaintCreate, ComplaintUpdate


def get_complaints(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None,
    fraud_type: Optional[str] = None,
    search: Optional[str] = None,
) -> Tuple[List[Complaint], int]:
    query = db.query(Complaint)
    if status:
        query = query.filter(Complaint.status == status)
    if fraud_type:
        query = query.filter(Complaint.fraud_type == fraud_type)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Complaint.complaint_id.ilike(search_pattern),
                Complaint.victim_name.ilike(search_pattern),
                Complaint.transaction_reference.ilike(search_pattern),
                Complaint.notes.ilike(search_pattern),
            )
        )
    total = query.count()
    complaints = query.order_by(desc(Complaint.created_at)).offset(skip).limit(limit).all()
    return complaints, total


def get_complaint_by_id(db: Session, complaint_id_or_pk: str) -> Optional[Complaint]:
    if complaint_id_or_pk.isdigit():
        complaint = db.query(Complaint).filter(Complaint.id == int(complaint_id_or_pk)).first()
        if complaint:
            return complaint
    return db.query(Complaint).filter(Complaint.complaint_id == complaint_id_or_pk).first()


def create_complaint(db: Session, data: ComplaintCreate, user_id: Optional[int] = None) -> Complaint:
    new_complaint = Complaint(
        complaint_id=data.complaint_id,
        victim_name=data.victim_name or "Anonymous / Unspecified",
        victim_phone=data.victim_phone,
        fraud_type=data.fraud_type,
        amount=data.amount,
        currency=data.currency,
        transaction_reference=data.transaction_reference,
        status=ComplaintStatus.NEW.value,
        assigned_officer_id=user_id,
        notes=data.notes,
        is_synthetic_demo=True,
    )
    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)
    return new_complaint


def update_complaint(db: Session, complaint: Complaint, data: ComplaintUpdate) -> Complaint:
    if data.status:
        complaint.status = data.status
    if data.assigned_officer_id is not None:
        complaint.assigned_officer_id = data.assigned_officer_id
    if data.notes:
        complaint.notes = data.notes
    db.commit()
    db.refresh(complaint)
    return complaint
