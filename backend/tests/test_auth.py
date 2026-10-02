import pytest
from fastapi import status


def test_login_admin_success(client):
    """Admin login with valid credentials returns 200, JWT token, and admin role."""
    response = client.post(
        "/auth/login",
        json={"email": "admin@cybertrace.gov.in", "password": "Admin@123"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "admin@cybertrace.gov.in"
    assert data["user"]["role"] == "admin"


def test_login_senior_officer_success(client):
    """Senior Officer login with valid credentials returns 200, JWT token, and senior_officer role."""
    response = client.post(
        "/auth/login",
        json={"email": "senior.officer@cybertrace.gov.in", "password": "Officer@123"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["user"]["role"] == "senior_officer"


def test_login_investigator_success(client):
    """Investigator login with valid credentials returns 200, JWT token, and investigator role."""
    response = client.post(
        "/auth/login",
        json={"email": "investigator@cybertrace.gov.in", "password": "Investigator@123"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["user"]["role"] == "investigator"


def test_login_invalid_password(client):
    """Login with wrong password returns 401 Unauthorized."""
    response = client.post(
        "/auth/login",
        json={"email": "investigator@cybertrace.gov.in", "password": "WrongPassword!999"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert "Incorrect email or password" in response.json()["detail"]


def test_login_nonexistent_user(client):
    """Login with non-registered email returns 401 Unauthorized."""
    response = client.post(
        "/auth/login",
        json={"email": "nonexistent@cybertrace.gov.in", "password": "RandomPassword123"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_login_empty_credentials(client):
    """Login with empty email/password triggers schema validation error (422)."""
    response = client.post("/auth/login", json={"email": "", "password": ""})
    assert response.status_code in [status.HTTP_422_UNPROCESSABLE_ENTITY, status.HTTP_400_BAD_REQUEST, status.HTTP_401_UNAUTHORIZED]


def test_signup_investigator_success(client):
    """Public signup allows registering an operational investigator."""
    payload = {
        "email": "new.investigator@cybertrace.gov.in",
        "full_name": "SI K. Raman",
        "role": "investigator",
        "badge_number": "IND-MUM-771",
        "password": "SecurePassword@123",
    }
    response = client.post("/auth/signup", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["user"]["email"] == "new.investigator@cybertrace.gov.in"
    assert data["user"]["role"] == "investigator"
    assert "access_token" in data


def test_signup_senior_officer_success(client):
    """Public signup allows registering a supervisory senior officer."""
    payload = {
        "email": "new.senior@cybertrace.gov.in",
        "full_name": "SP Meera Deshmukh",
        "role": "senior_officer",
        "badge_number": "IND-HQ-882",
        "password": "SecurePassword@123",
    }
    response = client.post("/auth/signup", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["user"]["role"] == "senior_officer"


def test_signup_admin_prevention(client):
    """Public signup prevents arbitrary self-elevation to admin (falls back to investigator)."""
    payload = {
        "email": "rogue.admin@cybertrace.gov.in",
        "full_name": "Fake Admin",
        "role": "admin",
        "badge_number": "FAKE-001",
        "password": "SecurePassword@123",
    }
    response = client.post("/auth/signup", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    # Must NOT be granted admin role via public registration
    assert data["user"]["role"] != "admin"
    assert data["user"]["role"] == "investigator"


def test_signup_duplicate_email(client):
    """Attempting to signup with an existing email returns 400 Bad Request."""
    payload = {
        "email": "investigator@cybertrace.gov.in",
        "full_name": "Duplicate Officer",
        "role": "investigator",
        "badge_number": "IND-DEL-999",
        "password": "Password123!",
    }
    response = client.post("/auth/signup", json=payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "already exists" in response.json()["detail"]


def test_get_current_user_profile(investigator_client):
    """GET /auth/me returns the authenticated investigator profile."""
    response = investigator_client.get("/auth/me")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "investigator@cybertrace.gov.in"
    assert data["role"] == "investigator"


def test_update_current_user_profile(investigator_client):
    """PUT /auth/me updates officer profile details."""
    response = investigator_client.put(
        "/auth/me",
        json={"full_name": "Sub-Inspector Ananya Rao Updated", "badge_number": "IND-DEL-409-B"},
    )
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["full_name"] == "Sub-Inspector Ananya Rao Updated"
    assert data["badge_number"] == "IND-DEL-409-B"


def test_logout(investigator_client):
    """POST /auth/logout logs the officer sign-out event."""
    response = investigator_client.post("/auth/logout")
    assert response.status_code == status.HTTP_200_OK
    assert "Successfully logged out" in response.json()["message"]
