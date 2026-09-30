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
    # Fresh in-memory database for each test
    test_engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=test_engine)
    TestingSession = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = TestingSession()

    # Seed test investigator
    user = User(
        id=1,
        full_name="Investigator Rao",
        email="investigator@cybertrace.gov.in",
        hashed_password="mock_password",
        role="investigator",
        badge_number="IND-DEL-409",
    )
    session.add(user)
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
        assigned_officer_id=user.id,
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
        Base.metadata.drop_all(bind=test_engine)
        test_engine.dispose()
