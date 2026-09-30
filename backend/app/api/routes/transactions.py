from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.db.database import get_db
from backend.app.api.deps import get_current_user
from backend.app.models.user import User
from backend.app.schemas.transaction import TransactionResponse, TransactionNetworkGraph
from backend.app.services.complaint_service import get_complaint_by_id
from backend.app.services.transaction_service import (
    get_transactions_by_complaint,
    build_network_graph,
)

router = APIRouter(prefix="/complaints", tags=["Transaction Intelligence & Network Analysis"])


@router.get("/{complaint_id}/transactions", response_model=List[TransactionResponse])
def get_case_transactions(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = get_complaint_by_id(db, complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint record not found")

    txns = get_transactions_by_complaint(db, complaint.id)
    return [TransactionResponse.model_validate(t) for t in txns]


@router.get("/{complaint_id}/network", response_model=TransactionNetworkGraph)
def get_transaction_network(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    complaint = get_complaint_by_id(db, complaint_id)
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint record not found")

    graph = build_network_graph(db, complaint.id)
    return graph
