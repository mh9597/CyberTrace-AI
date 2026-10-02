import pytest
from fastapi import status


def test_list_complaints_authenticated(investigator_client):
    """GET /complaints returns seeded cases with pagination metadata."""
    response = investigator_client.get("/complaints?skip=0&limit=10")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["complaint_id"] == "CT-2026-001"


def test_list_complaints_filter_by_fraud_type(investigator_client):
    """GET /complaints with fraud_type filter returns only matching records."""
    response = investigator_client.get("/complaints?fraud_type=UPI%20Fraud")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    for item in data:
        assert item["fraud_type"] == "UPI Fraud"


def test_get_complaint_by_id_success(investigator_client):
    """GET /complaints/{id} returns full case dossier for valid ID."""
    response = investigator_client.get("/complaints/CT-2026-001")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["complaint_id"] == "CT-2026-001"
    assert data["amount"] == 250000.0


def test_get_complaint_by_id_not_found(investigator_client):
    """GET /complaints/{id} returns 404 for non-existent case."""
    response = investigator_client.get("/complaints/CT-9999-NOTFOUND")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    assert "not found" in response.json()["detail"].lower()


def test_register_complaint_as_investigator_success(investigator_client):
    """Field Investigator can successfully register initial cybercrime complaints."""
    payload = {
        "complaint_id": "CT-2026-099",
        "victim_name": "Sunita Verma",
        "victim_phone": "+91-98111-XXXXX",
        "fraud_type": "Phishing Ring",
        "amount": 75000.0,
        "currency": "INR",
        "transaction_reference": "TXN-PHISH-099",
        "notes": "Fake electricity disconnection APK scam.",
    }
    response = investigator_client.post("/complaints", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["complaint_id"] == "CT-2026-099"
    assert data["victim_name"] == "Sunita Verma"
    assert data["status"] == "New"


def test_register_complaint_as_senior_officer_forbidden(senior_client):
    """Senior Officer cannot register complaints directly (review/approval role only)."""
    payload = {
        "complaint_id": "CT-2026-100",
        "victim_name": "Rohan Deshmukh",
        "victim_phone": "+91-98222-XXXXX",
        "fraud_type": "Investment Scam",
        "amount": 500000.0,
    }
    response = senior_client.post("/complaints", json=payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "Field Investigating Officer" in response.json()["detail"]


def test_register_complaint_as_admin_forbidden(admin_client):
    """Platform Admin cannot register operational complaints directly."""
    payload = {
        "complaint_id": "CT-2026-101",
        "victim_name": "Pooja Patel",
        "victim_phone": "+91-98333-XXXXX",
        "fraud_type": "UPI Fraud",
        "amount": 10000.0,
    }
    response = admin_client.post("/complaints", json=payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN


def test_register_complaint_duplicate_id_rejected(investigator_client):
    """Attempting to register a complaint with an existing case ID returns 400 Bad Request."""
    payload = {
        "complaint_id": "CT-2026-001",  # Already seeded
        "victim_name": "Duplicate Victim",
        "victim_phone": "+91-98444-XXXXX",
        "fraud_type": "UPI Fraud",
        "amount": 100000.0,
    }
    response = investigator_client.post("/complaints", json=payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already exists" in response.json()["detail"].lower()


def test_reassign_officer_as_senior_officer_success(senior_client):
    """Senior Officer has authority to reassign the investigating officer."""
    payload = {"assigned_officer_id": 2}
    response = senior_client.patch("/complaints/CT-2026-001", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["assigned_officer_id"] == 2


def test_reassign_officer_as_investigator_forbidden(investigator_client):
    """Investigator cannot reassign cases (requires Supervisory Command)."""
    payload = {"assigned_officer_id": 2}
    response = investigator_client.patch("/complaints/CT-2026-001", json=payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "Supervisory Command" in response.json()["detail"]


def test_approve_case_closure_as_senior_officer_success(senior_client):
    """Senior Officer can approve final case closure."""
    payload = {"status": "Closed"}
    response = senior_client.patch("/complaints/CT-2026-001", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["status"] == "Closed"


def test_approve_case_closure_as_investigator_forbidden(investigator_client):
    """Investigator cannot close cases without Senior Officer supervisory sign-off."""
    payload = {"status": "Closed"}
    response = investigator_client.patch("/complaints/CT-2026-001", json=payload)
    assert response.status_code == status.HTTP_403_FORBIDDEN
    assert "Supervisory Command" in response.json()["detail"]


def test_import_transactions_as_investigator_success(investigator_client):
    """Investigator can upload transaction banking CSV records to a case."""
    csv_content = (
        b"txn_reference,source_account,dest_account,amount,txn_type,timestamp,city\n"
        b"TXN-NEW-001,ACC-VICTIM-11,ACC-MULE-22,50000,UPI,2026-10-01T12:00:00Z,Ahmedabad\n"
        b"TXN-NEW-002,ACC-MULE-22,ACC-MULE-33,25000,IMPS,2026-10-01T12:15:00Z,Ahmedabad\n"
    )
    files = {"file": ("transactions.csv", csv_content, "text/csv")}
    response = investigator_client.post("/complaints/CT-2026-001/transactions/import", files=files)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 2


def test_import_transactions_as_senior_officer_forbidden(senior_client):
    """Senior Officer cannot directly import transaction ledgers (field duty)."""
    csv_content = b"txn_reference,source_account,dest_account,amount\nTXN-1,A,B,100"
    files = {"file": ("test.csv", csv_content, "text/csv")}
    response = senior_client.post("/complaints/CT-2026-001/transactions/import", files=files)
    assert response.status_code == status.HTTP_403_FORBIDDEN
