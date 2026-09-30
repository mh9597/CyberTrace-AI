from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class TransactionBase(BaseModel):
    txn_reference: str
    source_account: str
    dest_account: str
    amount: float
    currency: str = "INR"
    timestamp: datetime
    txn_type: str = "UPI"
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    city: Optional[str] = None
    zone_name: Optional[str] = None
    atm_id: Optional[str] = None
    is_cash_out: bool = False
    hop_level: int = 1
    suspicious_flags: Optional[str] = None
    data_provenance: str = "Synthetic Demonstration Dataset"


class TransactionCreate(TransactionBase):
    complaint_id: int


class TransactionResponse(TransactionBase):
    id: int
    complaint_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class NetworkNode(BaseModel):
    id: str
    label: str
    type: str  # "victim", "mule", "cash_out_atm", "complaint"
    amount: Optional[float] = None
    details: Optional[Dict[str, Any]] = None


class NetworkEdge(BaseModel):
    id: str
    source: str
    target: str
    amount: float
    timestamp: str
    txn_type: str
    hop: int


class TransactionNetworkGraph(BaseModel):
    nodes: List[NetworkNode]
    edges: List[NetworkEdge]
    total_amount_tracked: float
    rapid_hops_detected: int
    summary: str
