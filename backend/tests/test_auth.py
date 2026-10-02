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


def test_google_auth_init_and_registration_flow(client):
    """Test full Google Sign-in onboarding flow: dispatch OTP, complete profile with badge and role."""
    new_google_email = "new.officer.google@cybertrace.gov.in"
    
    # Step 1: Init Google sign-in
    init_res = client.post("/auth/google/init", json={
        "email": new_google_email,
        "full_name": "SI Rakesh Verma",
    })
    assert init_res.status_code == status.HTTP_200_OK
    data = init_res.json()
    assert data["status"] == "new_google_user"
    assert data["requires_profile_setup"] is True
    assert "dev_otp" in data
    otp = data["dev_otp"]

    # Step 2: Complete profile with ID, Name, Role and SMTP OTP
    complete_res = client.post("/auth/google/complete-registration", json={
        "email": new_google_email,
        "full_name": "SI Rakesh Verma",
        "badge_number": "POL-DEL-789",
        "role": "investigator",
        "otp": otp,
    })
    assert complete_res.status_code == status.HTTP_200_OK
    complete_data = complete_res.json()
    assert "access_token" in complete_data
    assert complete_data["user"]["email"] == new_google_email
    assert complete_data["user"]["role"] == "investigator"
    assert complete_data["user"]["badge_number"] == "POL-DEL-789"

    # Step 3: Now log in again as an EXISTING Google user -> MUST NOT send OTP
    login_again_res = client.post("/auth/google/init", json={
        "email": new_google_email,
        "full_name": "SI Rakesh Verma",
    })
    assert login_again_res.status_code == status.HTTP_200_OK
    again_data = login_again_res.json()
    assert again_data["status"] == "existing_user"
    assert again_data["requires_profile_setup"] is False
    assert "access_token" in again_data
    # Verify no new OTP was created for this existing user
    from backend.app.services.email_service import otp_storage
    assert new_google_email not in otp_storage


def test_forgot_and_reset_password_flow(client):
    """Test forgot password OTP generation and subsequent password reset."""
    target_email = "officer.reset@cybertrace.gov.in"
    # Create user first
    signup_res = client.post("/auth/signup", json={
        "email": target_email,
        "password": "OldPassword123!",
        "full_name": "Inspector Anand Rao",
        "role": "investigator",
        "badge_number": "POL-KA-5501",
    })
    assert signup_res.status_code == status.HTTP_200_OK

    # Step 1: Request password reset OTP
    forgot_res = client.post("/auth/forgot-password", json={"email": target_email})
    assert forgot_res.status_code == status.HTTP_200_OK
    forgot_data = forgot_res.json()
    assert forgot_data["status"] == "otp_sent"
    assert "dev_otp" in forgot_data
    reset_otp = forgot_data["dev_otp"]

    # Step 2: Reset password using OTP
    new_password = "BrandNewSecurePassword2026!"
    reset_res = client.post("/auth/reset-password", json={
        "email": target_email,
        "otp": reset_otp,
        "new_password": new_password,
    })
    assert reset_res.status_code == status.HTTP_200_OK
    assert reset_res.json()["status"] == "success"

    # Step 3: Login with the new password
    login_res = client.post("/auth/login", json={
        "email": target_email,
        "password": new_password,
    })
    assert login_res.status_code == status.HTTP_200_OK
    assert "access_token" in login_res.json()


