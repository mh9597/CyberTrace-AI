import pytest
from fastapi import status


# ==============================================================================
# 1. USER GOVERNANCE & ROLE MANAGEMENT (ADMIN ONLY)
# ==============================================================================

def test_admin_list_users_allowed(admin_client):
    """Admin can list all platform users and credentials."""
    response = admin_client.get("/users")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 3


def test_senior_officer_list_users_forbidden(senior_client):
    """Senior Officer cannot access user management (403)."""
    response = senior_client.get("/users")
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_investigator_list_users_forbidden(investigator_client):
    """Investigator cannot access user management (403)."""
    response = investigator_client.get("/users")
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_admin_create_officer_success(admin_client):
    """Admin can create new user credentials with explicit role."""
    payload = {
        "email": "officer.delhi@cybertrace.gov.in",
        "full_name": "Inspector S. Malik",
        "role": "investigator",
        "badge_number": "IND-DEL-901",
        "password": "TempPassword@123",
    }
    response = admin_client.post("/users", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["email"] == "officer.delhi@cybertrace.gov.in"
    assert response.json()["role"] == "investigator"


def test_admin_update_user_role_success(admin_client):
    """Admin can promote an officer to senior_officer."""
    response = admin_client.patch("/users/1/role", json={"role": "senior_officer"})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["role"] == "senior_officer"


def test_non_admin_update_role_forbidden(senior_client):
    """Senior officer cannot change user roles (403)."""
    response = senior_client.patch("/users/1/role", json={"role": "admin"})
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_admin_toggle_user_status_success(admin_client):
    """Admin can deactivate an officer account."""
    response = admin_client.patch("/users/1/status", json={"is_active": False})
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["is_active"] is False


def test_admin_cannot_deactivate_self(admin_client):
    """Admin cannot deactivate their own active session account (400)."""
    # Admin is user id 3 in test seed
    response = admin_client.patch("/users/3/status", json={"is_active": False})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "deactivate their own" in response.json()["detail"].lower()


# ==============================================================================
# 2. SECURITY CENTER & AUDIT VAULT
# ==============================================================================

def test_admin_access_audit_logs(admin_client):
    """Admin can access platform audit logs."""
    response = admin_client.get("/security/audit-logs")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "logs" in data
    assert "total" in data


def test_senior_officer_access_audit_logs(senior_client):
    """Senior Officer can view audit logs (limited supervisory oversight)."""
    response = senior_client.get("/security/audit-logs")
    assert response.status_code == status.HTTP_200_OK


def test_investigator_access_audit_logs_forbidden(investigator_client):
    """Investigator has NO access to platform audit logs (403 Forbidden)."""
    response = investigator_client.get("/security/audit-logs")
    assert response.status_code == status.HTTP_403_FORBIDDEN


# ==============================================================================
# 3. ALERTS & SUPERVISORY WORKFLOW
# ==============================================================================

def test_all_roles_can_list_alerts(admin_client, senior_client, investigator_client):
    """All roles can view alerts list."""
    assert admin_client.get("/alerts").status_code == status.HTTP_200_OK
    assert senior_client.get("/alerts").status_code == status.HTTP_200_OK
    assert investigator_client.get("/alerts").status_code == status.HTTP_200_OK


def test_senior_officer_approve_freeze_order(senior_client, db):
    """Senior Officer can approve High-Risk action / Freeze Order on an alert."""
    from backend.app.models.alert import Alert
    alert = Alert(
        alert_code="ALT-TEST-001",
        complaint_id=1,
        candidate_zone="Janpath Cluster",
        time_window="Within 30m",
        risk_level="High",
        review_status="Pending Review",
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    response = senior_client.patch(
        f"/alerts/{alert.id}",
        json={"review_status": "Freeze Order", "decision_notes": "Approved statutory debit freeze."},
    )
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["review_status"] == "Freeze Order"


def test_investigator_cannot_approve_freeze_order(investigator_client, db):
    """Investigator cannot approve High-Risk Freeze Order without supervisory sign-off (403)."""
    from backend.app.models.alert import Alert
    alert = Alert(
        alert_code="ALT-TEST-002",
        complaint_id=1,
        candidate_zone="Janpath Cluster",
        time_window="Within 30m",
        risk_level="High",
        review_status="Pending Review",
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    response = investigator_client.patch(
        f"/alerts/{alert.id}",
        json={"review_status": "Freeze Order", "decision_notes": "Attempted self-approval."},
    )
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "Supervisory Command" in response.json()["detail"]


# ==============================================================================
# 4. PILLAR INTEGRATION ENDPOINTS
# ==============================================================================

def test_golden_hour_status_endpoint(investigator_client):
    """GET /complaints/{id}/golden-hour calculates statutory golden hour SLA."""
    response = investigator_client.get("/complaints/CT-2026-001/golden-hour")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "elapsed_minutes" in data
    assert "remaining_minutes" in data
    assert "sla_tier" in data
    assert "is_breached" in data


def test_create_statutory_freeze_notice(investigator_client):
    """POST /complaints/{id}/freeze-notice generates Section 91/102 CrPC notice."""
    response = investigator_client.post("/complaints/CT-2026-001/freeze-notice")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "notice_id" in data
    assert "mule_target" in data


def test_tactical_patrol_units_and_dispatch(investigator_client):
    """Tactical patrol interception querying and dispatch order generation."""
    units_res = investigator_client.get("/map/patrol/units?lat=28.6295&lng=77.2185&radius_km=15")
    assert units_res.status_code == status.HTTP_200_OK
    units = units_res.json()
    assert isinstance(units, list)
    assert len(units) >= 1

    target_unit = units[0]["unit_id"]
    dispatch_payload = {
        "unit_id": target_unit,
        "target_zone": "Janpath Inner Circle ATM Cluster",
        "target_lat": 28.6289,
        "target_lng": 77.2173,
        "complaint_id": "CT-2026-001",
    }
    dispatch_res = investigator_client.post("/map/patrol/dispatch", json=dispatch_payload)
    assert dispatch_res.status_code == status.HTTP_200_OK
    assert "dispatch_order_id" in dispatch_res.json()


def test_forensic_dossier_generation(investigator_client):
    """Section 63 Bharatiya Sakshya Adhiniyam court-admissible dossier with SHA-256 seal."""
    response = investigator_client.get("/complaints/CT-2026-001/dossier")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "dossier_id" in data
    assert "master_sha256_fingerprint" in data
    assert len(data["master_sha256_fingerprint"]) == 64
    assert "bsa_section63_certificate" in data
    assert "bharatiya sakshya adhiniyam" in data["bsa_section63_certificate"].lower()


def test_copilot_status_and_chat(investigator_client):
    """AI Investigation Copilot status and chat interface."""
    status_res = investigator_client.get("/copilot/status")
    assert status_res.status_code == status.HTTP_200_OK
    assert status_res.json()["status"] == "ONLINE"

    chat_payload = {
        "message": "Summarize the suspected mule account in case CT-2026-001",
        "case_id": "CT-2026-001",
    }
    chat_res = investigator_client.post("/copilot/chat", json=chat_payload)
    assert chat_res.status_code == status.HTTP_200_OK
    assert "reply" in chat_res.json()
