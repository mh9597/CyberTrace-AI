"""
Pillar 3: Tactical Patrol & Intercept Service.
Computes nearest Police Stations, PCR Mobile Vans, and field intercept routes
to candidate ATM cash-out clusters for rapid on-the-ground law enforcement intervention.
"""

from typing import List, Dict, Any, Optional
import numpy as np
from datetime import datetime, timezone
from backend.app.domain.entities import UserPrincipal

# Tactical Police Stations & Active PCR Units Directory
TACTICAL_POLICE_UNITS = [
    {
        "unit_id": "PCR-DEL-CP-101",
        "unit_type": "PCR_MOBILE_PATROL",
        "call_sign": "EAGLE-ONE",
        "station_name": "Connaught Place Police Station, New Delhi",
        "latitude": 28.6328,
        "longitude": 77.2197,
        "personnel_count": 3,
        "lead_officer": "SI Rajesh Kumar",
        "radio_frequency": "142.850 MHz",
        "contact_phone": "+91-11-23340000",
        "status": "PATROLLING_ACTIVE",
    },
    {
        "unit_id": "STN-DEL-PARL-102",
        "unit_type": "POLICE_STATION_HQ",
        "call_sign": "PARLIAMENT-STN",
        "station_name": "Parliament Street Police Station, New Delhi",
        "latitude": 28.6251,
        "longitude": 77.2144,
        "personnel_count": 8,
        "lead_officer": "Inspector V. Sharma",
        "radio_frequency": "142.900 MHz",
        "contact_phone": "+91-11-23361100",
        "status": "STANDBY_READY",
    },
    {
        "unit_id": "PCR-DEL-KB-201",
        "unit_type": "PCR_MOBILE_PATROL",
        "call_sign": "TIGER-TWO",
        "station_name": "Karol Bagh Police Station, New Delhi",
        "latitude": 28.6530,
        "longitude": 77.1925,
        "personnel_count": 2,
        "lead_officer": "ASI Devendra Singh",
        "radio_frequency": "143.100 MHz",
        "contact_phone": "+91-11-25752200",
        "status": "PATROLLING_ACTIVE",
    },
    {
        "unit_id": "PCR-MUM-BKC-301",
        "unit_type": "CYBER_CELL_VAN",
        "call_sign": "HAWK-MUM-01",
        "station_name": "BKC Cyber Police Station, Mumbai",
        "latitude": 19.0665,
        "longitude": 72.8695,
        "personnel_count": 4,
        "lead_officer": "PI Aniket Sawant",
        "radio_frequency": "144.200 MHz",
        "contact_phone": "+91-22-26504000",
        "status": "PATROLLING_ACTIVE",
    },
    {
        "unit_id": "PCR-BLR-IND-401",
        "unit_type": "PCR_MOBILE_PATROL",
        "call_sign": "COBRA-BLR-04",
        "station_name": "Indiranagar Police Station, Bengaluru",
        "latitude": 12.9790,
        "longitude": 77.6415,
        "personnel_count": 3,
        "lead_officer": "PSI Ramesh Reddy",
        "radio_frequency": "141.500 MHz",
        "contact_phone": "+91-80-22942500",
        "status": "PATROLLING_ACTIVE",
    },
]


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes great-circle distance between two GPS coordinates in kilometers."""
    R = 6371.0  # Earth radius in km
    phi1 = np.radians(lat1)
    phi2 = np.radians(lat2)
    delta_phi = np.radians(lat2 - lat1)
    delta_lambda = np.radians(lon2 - lon1)

    a = (
        np.sin(delta_phi / 2.0) ** 2
        + np.cos(phi1) * np.cos(phi2) * np.sin(delta_lambda / 2.0) ** 2
    )
    c = 2.0 * np.arctan2(np.sqrt(a), np.sqrt(1.0 - a))
    return float(R * c)


def get_nearby_patrol_units(
    target_lat: float, target_lng: float, radius_km: float = 6.0
) -> List[Dict[str, Any]]:
    """
    Finds police patrol units and stations near the specified target coordinates.
    Computes distance and estimated arrival time (ETA) based on tactical city speeds.
    """
    units_with_distance = []

    for unit in TACTICAL_POLICE_UNITS:
        dist = haversine_distance_km(
            target_lat, target_lng, unit["latitude"], unit["longitude"]
        )
        if dist <= radius_km:
            # Tactical city driving speed assumed ~ 25 km/h with sirens
            eta_minutes = max(2, int(round((dist / 25.0) * 60)))
            entry = dict(unit)
            entry["distance_km"] = round(dist, 2)
            entry["eta_minutes"] = eta_minutes
            entry["intercept_route"] = {
                "origin": {"lat": unit["latitude"], "lng": unit["longitude"]},
                "destination": {"lat": target_lat, "lng": target_lng},
                "estimated_travel_time": f"{eta_minutes} min",
            }
            units_with_distance.append(entry)

    units_with_distance.sort(key=lambda u: u["distance_km"])
    return units_with_distance


def dispatch_patrol_unit(
    unit_id: str,
    target_zone: str,
    target_lat: float,
    target_lng: float,
    complaint_id: str,
    principal: UserPrincipal,
) -> Dict[str, Any]:
    """Logs and generates an actionable Field Intercept Order for ground patrol."""
    matched_unit = next((u for u in TACTICAL_POLICE_UNITS if u["unit_id"] == unit_id), None)
    if not matched_unit:
        raise ValueError(f"Patrol unit '{unit_id}' not found in active dispatch directory.")

    now = datetime.now(timezone.utc)
    dist = haversine_distance_km(target_lat, target_lng, matched_unit["latitude"], matched_unit["longitude"])
    eta = max(2, int(round((dist / 25.0) * 60)))

    order_id = f"DISPATCH-ORD-{now.strftime('%Y%m%d')}-{matched_unit['call_sign']}"

    return {
        "dispatch_order_id": order_id,
        "complaint_id": complaint_id,
        "unit_id": matched_unit["unit_id"],
        "call_sign": matched_unit["call_sign"],
        "lead_officer": matched_unit["lead_officer"],
        "radio_frequency": matched_unit["radio_frequency"],
        "dispatched_by": principal.username,
        "timestamp": now.isoformat(),
        "target_perimeter": target_zone,
        "target_coordinates": {"lat": target_lat, "lng": target_lng},
        "distance_km": round(dist, 2),
        "eta_minutes": eta,
        "tactical_instructions": [
            "Establish perimeter observation at commercial ATM vestibules.",
            "Monitor persons carrying multiple debit cards or mobile devices with active screen brightness.",
            "Do not draw weapons; follow standard peaceful identification protocol under CrPC/BNSS.",
            "Coordinate in real-time with Central Cyber Dispatch on frequency " + matched_unit["radio_frequency"],
        ],
    }
