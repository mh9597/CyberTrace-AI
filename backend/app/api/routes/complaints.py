import csv
import io
import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.api.deps import get_current_principal
from backend.app.domain.entities import UserPrincipal
from backend.app.schemas.complaint import ComplaintCreate, ComplaintUpdate, ComplaintResponse
from backend.app.schemas.transaction import TransactionResponse
from backend.app.services.complaint_service import (
    get_complaints,
    get_complaint_by_id,
    create_complaint,
    update_complaint,
)
from backend.app.services.transaction_service import import_transaction_records
from backend.app.services.audit_service import log_audit_event

router = APIRouter(prefix="/complaints", tags=["Cybercrime Complaint Management"])


@router.get("", response_model=List[ComplaintResponse])
def list_complaints(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: Optional[str] = None,
    fraud_type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
):
    complaints, _ = get_complaints(
        db, skip=skip, limit=limit, status=status, fraud_type=fraud_type, search=search
    )
    return [ComplaintResponse.model_validate(c) for c in complaints]


@router.post("", response_model=ComplaintResponse)
def register_complaint(
    data: ComplaintCreate,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
):
    if current_user.role != "investigator":
        raise HTTPException(
            status_code=403,
            detail=f"Field Investigating Officer (Investigator) role required to register initial complaints. Role '{current_user.role}' has review/archival access only.",
        )

    existing = get_complaint_by_id(db, data.complaint_id)
    if existing:
        raise HTTPException(status_code=400, detail=f"Case with ID {data.complaint_id} already exists")

    complaint = create_complaint(db, data, user_id=current_user.id)
    log_audit_event(
        db=db,
        action="COMPLAINT_REGISTERED",
        target_record=complaint.complaint_id,
        user_id=current_user.id,
        user_email=current_user.username,
        details=f"Registered {complaint.fraud_type} case amounting to ₹{complaint.amount}",
    )
    return ComplaintResponse.model_validate(complaint)


@router.get("/{complaint_id}", response_model=ComplaintResponse)
def get_complaint(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
):
    complaint = get_complaint_by_id(db, complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint record not found")
    return ComplaintResponse.model_validate(complaint)


@router.patch("/{complaint_id}", response_model=ComplaintResponse)
def modify_complaint(
    complaint_id: str,
    data: ComplaintUpdate,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
):
    complaint = get_complaint_by_id(db, complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint record not found")

    # Only Senior Officers can assign/reassign cases or approve final closure
    if data.assigned_officer_id is not None and data.assigned_officer_id != complaint.assigned_officer_id:
        if current_user.role != "senior_officer":
            raise HTTPException(
                status_code=403,
                detail=f"Only Supervisory Command (Senior Officer) can assign or reassign investigating officers.",
            )

    if data.status and data.status.lower() in ["closed", "resolved"]:
        if current_user.role != "senior_officer":
            raise HTTPException(
                status_code=403,
                detail=f"Only Supervisory Command (Senior Officer) can approve case closure.",
            )

    old_status = complaint.status
    complaint = update_complaint(db, complaint, data)
    log_audit_event(
        db=db,
        action="COMPLAINT_STATUS_UPDATE",
        target_record=complaint.complaint_id,
        user_id=current_user.id,
        user_email=current_user.username,
        details=f"Updated status from '{old_status}' to '{complaint.status}'",
    )
    return ComplaintResponse.model_validate(complaint)


@router.post("/{complaint_id}/transactions/import", response_model=List[TransactionResponse])
async def import_transactions_file(
    complaint_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
):
    if current_user.role != "investigator":
        raise HTTPException(
            status_code=403,
            detail=f"Operational transaction ledger importing is restricted to Investigating Officers (Investigator).",
        )

    complaint = get_complaint_by_id(db, complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint record not found")

    content = await file.read()
    records = []

    try:
        if file.filename.endswith(".json"):
            records = json.loads(content.decode("utf-8"))
            if not isinstance(records, list):
                records = [records]
        else:
            # Assume CSV
            decoded = content.decode("utf-8", errors="replace")
            reader = csv.DictReader(io.StringIO(decoded))
            records = list(reader)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse uploaded file: {str(e)}")

    if not records:
        raise HTTPException(status_code=400, detail="Uploaded file contains no records")

    txns = import_transaction_records(db, complaint.id, records)
    log_audit_event(
        db=db,
        action="TRANSACTIONS_IMPORTED",
        target_record=complaint.complaint_id,
        user_id=current_user.id,
        user_email=current_user.username,
        details=f"Imported {len(txns)} transactions from file {file.filename}",
    )
    return [TransactionResponse.model_validate(t) for t in txns]
