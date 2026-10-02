import sys
from pathlib import Path

# Add project root to sys.path so 'backend' package is resolvable
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import pytest
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from backend.app.db.database import Base
from backend.app.models.user import User
from backend.app.models.complaint import Complaint
from backend.app.models.transaction import Transaction
from backend.app.models.prediction import Prediction
from backend.app.models.alert import Alert
from backend.app.models.evidence import EvidenceFile


@pytest.fixture(scope="function")
def db():
    from sqlalchemy.pool import StaticPool
    # Fresh in-memory database for each test shared across threads
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=test_engine)
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = TestingSession()

    # Seed test users for all 3 roles
    from backend.app.core.security import get_password_hash

    user_investigator = User(
        id=1,
        full_name="Sub-Inspector Ananya Rao",
        email="investigator@cybertrace.gov.in",
        hashed_password=get_password_hash("Investigator@123"),
        role="investigator",
        badge_number="IND-DEL-409",
        is_active=True,
    )
    user_senior = User(
        id=2,
        full_name="Superintendent Rajesh Nair",
        email="senior.officer@cybertrace.gov.in",
        hashed_password=get_password_hash("Officer@123"),
        role="senior_officer",
        badge_number="IND-HQ-012",
        is_active=True,
    )
    user_admin = User(
        id=3,
        full_name="Chief Inspector Vikram Sharma",
        email="admin@cybertrace.gov.in",
        hashed_password=get_password_hash("Admin@123"),
        role="admin",
        badge_number="IND-DEL-001",
        is_active=True,
    )
    session.add_all([user_investigator, user_senior, user_admin])
    session.flush()

    # Seed test complaint CT-2026-001
    complaint = Complaint(
        id=1,
        complaint_id="CT-2026-001",
        victim_name="Ramesh Kumar",
        victim_phone="+91-98765-XXXXX",
        fraud_type="UPI Fraud",
        amount=250000.0,
        currency="INR",
        transaction_reference="UPI/2026/89823101",
        status="Under Investigation",
        assigned_officer_id=user_investigator.id,
        notes="Urgent intervention required for structured cash-out prevention",
        is_synthetic_demo=True,
        created_at=datetime.now(timezone.utc),
    )
    session.add(complaint)

    # Seed sample mule transaction
    tx = Transaction(
        id=1,
        txn_reference="UPI/2026/89823101",
        complaint_id=1,
        source_account="ACC-MULE-8812",
        dest_account="ACC-MULE-9934",
        amount=250000.0,
        currency="INR",
        timestamp=datetime.now(timezone.utc),
        txn_type="UPI",
        is_cash_out=False,
        hop_level=1,
        suspicious_flags="RAPID_HOP,REPEATED_MULE",
    )
    session.add(tx)
    session.commit()

    try:
        yield session
    finally:
        session.close()
        test_engine.dispose()


@pytest.fixture(scope="function")
def client(db):
    from fastapi.testclient import TestClient
    from backend.app.main import app
    from backend.app.db.database import get_db

    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app, base_url="http://testserver/api") as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def investigator_client(client, db):
    from backend.app.core.security import create_access_token
    token = create_access_token(subject="investigator@cybertrace.gov.in")
    client.headers["Authorization"] = f"Bearer {token}"
    return client


@pytest.fixture(scope="function")
def senior_client(client, db):
    from backend.app.core.security import create_access_token
    token = create_access_token(subject="senior.officer@cybertrace.gov.in")
    client.headers["Authorization"] = f"Bearer {token}"
    return client


@pytest.fixture(scope="function")
def admin_client(client, db):
    from backend.app.core.security import create_access_token
    token = create_access_token(subject="admin@cybertrace.gov.in")
    client.headers["Authorization"] = f"Bearer {token}"
    return client

