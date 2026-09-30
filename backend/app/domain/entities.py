"""
Domain Entities and Value Objects for CyberTrace AI.
These are pure data contracts that do not depend on SQLAlchemy, FastAPI, or any DB session.
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime


class UserPrincipal(BaseModel):
    """
    Lightweight, immutable principal representing an authenticated officer.
    Replaces passing raw SQLAlchemy User ORM models across service boundaries.
    """
    id: int
    username: str
    role: str  # 'analyst', 'investigator', 'admin'
    police_station_id: Optional[str] = None

    class Config:
        frozen = True


class CaseSummary(BaseModel):
    """Domain projection of an active cybercrime case."""
    complaint_id: str
    victim_name: str
    amount_lost: float
    category: str
    status: str
    risk_score: float
    created_at: datetime


class MuleNode(BaseModel):
    """A single node in a multi-hop mule account network."""
    account_number: str
    bank_name: str
    layer_depth: int
    risk_level: str  # 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    total_received: float
    is_frozen: bool = False


class MuleTraceResult(BaseModel):
    """Results from NetworkX mule graph traversal."""
    complaint_id: str
    total_hops: int
    mule_accounts: List[MuleNode]
    rapid_velocity_detected: bool
    cycles_detected: List[List[str]]
    potential_cashout_perimeter: Dict[str, Any]


class EvidenceSeal(BaseModel):
    """Tamper-evident verification payload for LEA evidence."""
    evidence_id: str
    complaint_id: str
    sha256_hash: str
    file_name: str
    sealed_at: datetime
    is_valid: bool
