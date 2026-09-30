from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class AlertUpdate(BaseModel):
    review_status: str = Field(..., description="Pending Review, Verified Lead, Dismissed, Action Taken")
    assigned_officer_name: Optional[str] = None
    decision_notes: Optional[str] = None


class AlertNoteCreate(BaseModel):
    note: str


class AlertResponse(BaseModel):
    id: int
    alert_code: str
    complaint_id: int
    prediction_id: Optional[int] = None
    candidate_zone: str
    time_window: str
    risk_level: str
    review_status: str
    assigned_officer_name: Optional[str] = None
    decision_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
