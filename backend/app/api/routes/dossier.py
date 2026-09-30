from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any

from backend.app.db.database import get_db
from backend.app.api.deps import get_current_principal
from backend.app.domain.entities import UserPrincipal
from backend.app.services.dossier_service import generate_forensic_dossier
from backend.app.services.audit_service import log_audit_event

router = APIRouter(prefix="/complaints", tags=["Pillar 4: Court-Admissible Forensic Dossier"])


@router.get("/{complaint_id}/dossier")
def get_complaint_forensic_dossier(
    complaint_id: str,
    db: Session = Depends(get_db),
    current_user: UserPrincipal = Depends(get_current_principal),
) -> Dict[str, Any]:
    try:
        dossier = generate_forensic_dossier(db, complaint_id, current_user)
        log_audit_event(
            db=db,
            action="FORENSIC_DOSSIER_ACCESSED",
            target_record=complaint_id,
            user_id=current_user.id,
            user_email=current_user.username,
            details=f"Generated Section 63 BSA Forensic Dossier {dossier['dossier_id']} (SHA-256: {dossier['master_sha256_fingerprint'][:16]}...)",
        )
        return dossier
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
