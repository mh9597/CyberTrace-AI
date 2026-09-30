from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    complaint_id: int
    force_recalculate: bool = False


class PredictionResponse(BaseModel):
    id: int
    complaint_id: int
    model_version: str
    candidate_zone: str
    latitude: float
    longitude: float
    radius_km: float
    time_window_start: datetime
    time_window_end: datetime
    risk_estimate: float
    risk_band: str
    uncertainty_score: float
    is_heuristic_analysis: bool
    supporting_factors: Optional[Dict[str, Any]] = None
    disclaimer: str
    created_at: datetime

    class Config:
        from_attributes = True


class HotspotCluster(BaseModel):
    cluster_id: int
    zone_name: str
    latitude: float
    longitude: float
    density_score: float
    historical_withdrawals_count: int
    average_withdrawal_amount: float
    peak_hours: str
    source_layer: str = "Historical Withdrawal Hotspot (DBSCAN)"


class CandidateLeadZone(BaseModel):
    lead_id: str
    complaint_id: str
    zone_name: str
    latitude: float
    longitude: float
    radius_km: float
    estimated_window: str
    risk_estimate: float
    risk_band: str
    uncertainty: float
    supporting_factors: List[str]
    source_layer: str = "ML Forecast Candidate Zone (Random Forest)"
