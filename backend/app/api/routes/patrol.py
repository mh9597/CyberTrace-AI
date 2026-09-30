from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel

from backend.app.db.database import get_db
from backend.app.api.deps import get_current_principal
from backend.app.domain.entities import UserPrincipal
from backend.app.services.patrol_service import (
    get_nearby_patrol_units,
    dispatch_patrol_unit,
)
from backend.app.services.audit_service import log_audit_event

router = APIRouter(prefix="/map/patrol", tags=["Pillar 3: Tactical Patrol & Field Interception"])


class DispatchRequest(BaseModel):
    unit_id: str
    target_zone: str
    target_lat: float
    target_lng: float
    complaint_id: str


@router.get("/units")
def list_nearby_patrol_units(
    lat: float = Query(28.6295, description="Target Latitude"),
    lng: float = Query(77.2185, description="Target Longitude"),
    radius_km: float = Query(10.0, ge=1.0, le=50.0),
    current_user: UserPrincipal = Depends(get_current_principal),
) -> List[Dict[str, Any]]:
    return get_nearby_patrol_units(lat, lng, radius_km)


@router.post("/dispatch")
def create_patrol_dispatch_order(
    req: DispatchRequest,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
) -> Dict[str, Any]:
    try:
        order = dispatch_patrol_unit(
            unit_id=req.unit_id,
            target_zone=req.target_zone,
            target_lat=req.target_lat,
            target_lng=req.target_lng,
            complaint_id=req.complaint_id,
            principal=current_user,
        )
        log_audit_event(
            db=db,
            action="PATROL_DISPATCHED",
            target_record=order["dispatch_order_id"],
            user_id=current_user.id,
            user_email=current_user.username,
            details=f"Dispatched unit {order['call_sign']} to {req.target_zone} (ETA: {order['eta_minutes']}m)",
        )
        return order
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
