from fastapi import APIRouter
from backend.app.api.routes.auth import router as auth_router
from backend.app.api.routes.complaints import router as complaints_router
from backend.app.api.routes.transactions import router as transactions_router
from backend.app.api.routes.predictions import router as predictions_router
from backend.app.api.routes.alerts import router as alerts_router
from backend.app.api.routes.audit import router as audit_router
from backend.app.api.routes.notices import router as notices_router
from backend.app.api.routes.patrol import router as patrol_router
from backend.app.api.routes.dossier import router as dossier_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(complaints_router)
api_router.include_router(transactions_router)
api_router.include_router(predictions_router)
api_router.include_router(alerts_router)
api_router.include_router(audit_router)
api_router.include_router(notices_router)
api_router.include_router(patrol_router)
api_router.include_router(dossier_router)
