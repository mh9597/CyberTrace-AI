from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.db.database import get_db
from backend.app.api.deps import get_current_principal
from backend.app.domain.entities import UserPrincipal
from backend.app.core.config import settings
from backend.app.services.llm_service import (
    generate_copilot_response,
    draft_statutory_notice,
)
from backend.app.services.audit_service import log_audit_event

router = APIRouter(prefix="/copilot", tags=["AI Investigation Copilot (OpenAI / OpenRouter)"])


class ChatMessagePayload(BaseModel):
    message: str = Field(..., description="Investigator query or case instruction")
    case_id: Optional[str] = Field(None, description="Optional active complaint ID like CT-2026-001")
    history: Optional[List[Dict[str, Any]]] = Field(default=[], description="Previous message history")


class DraftNoticePayload(BaseModel):
    case_id: str = Field(..., description="Target Case ID to generate Section 91 CrPC notice for")
    target_bank: Optional[str] = Field("State Bank of India / Nodal Officer", description="Recipient Bank or Payment Aggregator")


class CopilotStatusResponse(BaseModel):
    status: str
    active_model: str
    fallback_model: str
    provider: str
    environment: str


@router.get("/status", response_model=CopilotStatusResponse)
def get_copilot_status(
    current_user: UserPrincipal = Depends(get_current_principal),
):
    """Returns AI model runtime and configuration status."""
    return CopilotStatusResponse(
        status="ONLINE",
        active_model=settings.OPENROUTER_MODEL,
        fallback_model=settings.OPENROUTER_FALLBACK_MODEL,
        provider="OpenRouter (OpenAI Engine)",
        environment=settings.ENVIRONMENT,
    )


@router.post("/chat")
def chat_with_copilot(
    data: ChatMessagePayload,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
):
    """
    Interact with the CyberTrace AI Investigation Copilot with grounded case context.
    """
    if not data.message.trim() if hasattr(data.message, "trim") else not data.message.strip():
        raise HTTPException(status_code=400, detail="Query message cannot be empty.")

    try:
        res = generate_copilot_response(
            db=db,
            message=data.message,
            case_id=data.case_id,
            history=data.history,
        )

        log_audit_event(
            db=db,
            action="AI_COPILOT_QUERY",
            target_record=data.case_id or "GENERAL_QUERY",
            user_id=current_user.id,
            user_email=current_user.username,
            details=f"Query to {res['model_used']}: {data.message[:80]}...",
        )

        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Copilot execution failed: {str(e)}")


@router.post("/draft-notice")
def generate_statutory_notice_endpoint(
    data: DraftNoticePayload,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
):
    """
    Generate statutory Section 91 / 102 CrPC bank debit freeze order.
    """
    try:
        res = draft_statutory_notice(
            db=db,
            case_id=data.case_id,
            target_bank=data.target_bank,
            officer_name=current_user.full_name or current_user.username,
            badge_number=current_user.police_station_id or "IND-DEL-409",
        )

        log_audit_event(
            db=db,
            action="STATUTORY_NOTICE_GENERATED",
            target_record=data.case_id,
            user_id=current_user.id,
            user_email=current_user.username,
            details=f"Generated Section 91 CrPC notice for {data.target_bank}",
        )

        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate notice: {str(e)}")
