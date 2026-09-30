from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class ComplaintBase(BaseModel):
    complaint_id: str = Field(..., description="Unique case reference, e.g., CT-2026-001")
    victim_name: Optional[str] = Field(None, description="Pseudonymized victim label")
    victim_phone: Optional[str] = Field(None, description="Masked phone number")
    fraud_type: str = Field(..., description="Type of fraud, e.g. UPI/payment fraud")
    amount: float = Field(..., gt=0, description="Defrauded amount in INR")
    currency: str = "INR"
    transaction_reference: Optional[str] = None
    notes: Optional[str] = None


class ComplaintCreate(ComplaintBase):
    pass


class ComplaintUpdate(BaseModel):
    status: Optional[str] = None
    assigned_officer_id: Optional[int] = None
    notes: Optional[str] = None


class ComplaintResponse(ComplaintBase):
    id: int
    reported_at: datetime
    status: str
    assigned_officer_id: Optional[int] = None
    is_synthetic_demo: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
