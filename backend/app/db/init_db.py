import hashlib
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from backend.app.db.database import Base, engine, SessionLocal
from backend.app.core.security import get_password_hash
from backend.app.models import (
    User,
    UserRole,
    Complaint,
    ComplaintStatus,
    Transaction,
    Prediction,
    Alert,
    AuditLog,
    EvidenceFile,
)


def init_database_tables():
    """Create all tables in the database."""
    Base.metadata.create_all(bind=engine)


def seed_demo_data(db: Session):
    """Seed initial users, blueprint demo cases, synthetic transactions, and hotspots."""
    # 1. Seed Initial Role-Based Users
    if not db.query(User).filter(User.email == "admin@cybertrace.gov.in").first():
        admin_user = User(
            email="admin@cybertrace.gov.in",
            full_name="Chief Inspector Vikram Sharma",
            role=UserRole.ADMIN.value,
            badge_number="IND-DEL-001",
            hashed_password=get_password_hash("Admin@123"),
            is_active=True,
        )
        investigator_user = User(
            email="investigator@cybertrace.gov.in",
            full_name="Sub-Inspector Ananya Rao",
            role=UserRole.INVESTIGATOR.value,
            badge_number="IND-DEL-409",
            hashed_password=get_password_hash("Investigator@123"),
            is_active=True,
        )
        senior_user = User(
            email="senior.officer@cybertrace.gov.in",
            full_name="Superintendent Rajesh Nair",
            role=UserRole.SENIOR_OFFICER.value,
            badge_number="IND-HQ-012",
            hashed_password=get_password_hash("Officer@123"),
            is_active=True,
        )
        db.add_all([admin_user, investigator_user, senior_user])
        db.commit()

    investigator = db.query(User).filter(User.email == "investigator@cybertrace.gov.in").first()

    # 2. Seed Blueprint Case CT-2026-001 (UPI/Payment Fraud ₹50,000)
    base_case = db.query(Complaint).filter(Complaint.complaint_id == "CT-2026-001").first()
    if not base_case:
        base_time = datetime.now(timezone.utc) - timedelta(hours=3)
        case1 = Complaint(
            complaint_id="CT-2026-001",
            victim_name="Ramesh K. (Synthetic Persona)",
            victim_phone="+91-98765-XXXX1",
            fraud_type="UPI/payment fraud",
            amount=50000.0,
            currency="INR",
            transaction_reference="TXN-DEMO-001",
            reported_at=base_time,
            status=ComplaintStatus.ALERT_GENERATED.value,
            assigned_officer_id=investigator.id if investigator else 1,
            notes="Victim reported fake electricity bill update request leading to unauthorized UPI debit of ₹50,000.",
            is_synthetic_demo=True,
        )
        db.add(case1)
        db.commit()
        db.refresh(case1)

        # 3. Seed Synthetic Transaction Trail (Rapid Mule Account Multi-Hop)
        t1 = Transaction(
            txn_reference="TXN-DEMO-001",
            complaint_id=case1.id,
            source_account="ACC-VICTIM-9081",
            dest_account="ACC-MULE-LAYER1-5521",
            amount=50000.0,
            timestamp=base_time + timedelta(minutes=2),
            txn_type="UPI",
            latitude=28.6139,
            longitude=77.2090,
            city="New Delhi",
            zone_name="Central Delhi Hub",
            is_cash_out=False,
            hop_level=1,
            suspicious_flags="RAPID_INITIAL_DEBIT",
            data_provenance="Synthetic Demonstration Dataset",
        )
        t2 = Transaction(
            txn_reference="TXN-DEMO-002",
            complaint_id=case1.id,
            source_account="ACC-MULE-LAYER1-5521",
            dest_account="ACC-MULE-LAYER2-7714",
            amount=30000.0,
            timestamp=base_time + timedelta(minutes=9),
            txn_type="IMPS",
            latitude=28.6328,
            longitude=77.2197,
            city="New Delhi",
            zone_name="Connaught Place Commercial Zone",
            is_cash_out=False,
            hop_level=2,
            suspicious_flags="RAPID_HOP,SPLIT_TRANSFER",
            data_provenance="Synthetic Demonstration Dataset",
        )
        t3 = Transaction(
            txn_reference="TXN-DEMO-003",
            complaint_id=case1.id,
            source_account="ACC-MULE-LAYER1-5521",
            dest_account="ACC-MULE-LAYER2-8890",
            amount=20000.0,
            timestamp=base_time + timedelta(minutes=11),
            txn_type="IMPS",
            latitude=28.6448,
            longitude=77.2167,
            city="New Delhi",
            zone_name="Karol Bagh Corridor",
            is_cash_out=False,
            hop_level=2,
            suspicious_flags="RAPID_HOP,SPLIT_TRANSFER",
            data_provenance="Synthetic Demonstration Dataset",
        )
        t4 = Transaction(
            txn_reference="TXN-DEMO-004",
            complaint_id=case1.id,
            source_account="ACC-MULE-LAYER2-7714",
            dest_account="ATM-DEL-CP-04",
            amount=25000.0,
            timestamp=base_time + timedelta(minutes=35),
            txn_type="ATM_WITHDRAWAL",
            latitude=28.6289,
            longitude=77.2173,
            city="New Delhi",
            zone_name="Janpath Inner Circle ATM Cluster",
            atm_id="ATM-DEL-CP-04",
            is_cash_out=True,
            hop_level=3,
            suspicious_flags="CASH_OUT_PATTERN_MATCH",
            data_provenance="Synthetic Demonstration Dataset",
        )
        db.add_all([t1, t2, t3, t4])
        db.commit()

        # 4. Seed ML Forecast Candidate Prediction
        pred = Prediction(
            complaint_id=case1.id,
            model_version="RandomForest-DBSCAN-v1.0",
            candidate_zone="Janpath & Outer Circle ATM Cluster, Connaught Place",
            latitude=28.6295,
            longitude=77.2185,
            radius_km=1.2,
            time_window_start=base_time + timedelta(minutes=25),
            time_window_end=base_time + timedelta(minutes=65),
            risk_estimate=0.89,
            risk_band="High",
            uncertainty_score=0.14,
            is_heuristic_analysis=False,
            supporting_factors={
                "hop_count": 3,
                "transfer_velocity_min": 7.2,
                "historical_hotspot_density": 0.92,
                "atm_proximity_score": 0.88,
                "time_decay_factor": 0.95
            },
            disclaimer="Synthetic Investigative Lead. Human verification required before action.",
        )
        db.add(pred)
        db.commit()
        db.refresh(pred)

        # 5. Seed Alert
        alert1 = Alert(
            alert_code="ALT-2026-001",
            complaint_id=case1.id,
            prediction_id=pred.id,
            candidate_zone=pred.candidate_zone,
            time_window="Within 40 minutes of report",
            risk_level="High",
            review_status="Pending Review",
            assigned_officer_name="Sub-Inspector Ananya Rao",
            decision_notes="Preliminary alert generated based on rapid mule hop velocity toward Central Delhi ATM cluster.",
        )
        db.add(alert1)
        db.commit()

        # 6. Seed Additional Demo Cases for realistic dashboard
        case2 = Complaint(
            complaint_id="CT-2026-002",
            victim_name="Sanjay M. (Synthetic Persona)",
            victim_phone="+91-91234-XXXX2",
            fraud_type="Investment Scam",
            amount=250000.0,
            currency="INR",
            transaction_reference="TXN-DEMO-088",
            reported_at=base_time - timedelta(days=1),
            status=ComplaintStatus.UNDER_INVESTIGATION.value,
            assigned_officer_id=investigator.id if investigator else 1,
            notes="Bogus crypto investment platform scam. Multiple mule withdrawals identified in Bandra Kurla Complex.",
            is_synthetic_demo=True,
        )
        case3 = Complaint(
            complaint_id="CT-2026-003",
            victim_name="Pooja S. (Synthetic Persona)",
            victim_phone="+91-97654-XXXX3",
            fraud_type="Phishing",
            amount=18500.0,
            currency="INR",
            transaction_reference="TXN-DEMO-102",
            reported_at=base_time - timedelta(days=2),
            status=ComplaintStatus.RESOLVED.value,
            assigned_officer_id=investigator.id if investigator else 1,
            notes="Fake KYC SMS update. Mule accounts blocked proactively; funds recovered.",
            is_synthetic_demo=True,
        )
        db.add_all([case2, case3])
        db.commit()

        # 7. Seed Synthetic Evidence Checksum
        demo_evidence_content = b"TXN_ID,SOURCE,DEST,AMOUNT,TIMESTAMP\nTXN-DEMO-001,ACC-VICTIM-9081,ACC-MULE-LAYER1-5521,50000,2026-09-29T10:17:00Z"
        sha_hash = hashlib.sha256(demo_evidence_content).hexdigest()
        evidence = EvidenceFile(
            complaint_id=case1.id,
            file_name="CT-2026-001-banking-trail-synthetic.csv",
            file_size_bytes=len(demo_evidence_content),
            mime_type="text/csv",
            sha256_hash=sha_hash,
            storage_path="synthetic_evidence/CT-2026-001.csv",
            uploaded_by="Cyber Intelligence Ingestion Engine",
        )
        db.add(evidence)

        # 8. Seed Initial Audit Logs
        log1 = AuditLog(
            user_id=investigator.id if investigator else 1,
            user_email="investigator@cybertrace.gov.in",
            action="CASE_REGISTERED",
            target_record="CT-2026-001",
            ip_address="127.0.0.1",
            outcome="SUCCESS",
            details="Registered new complaint CT-2026-001 (UPI/payment fraud ₹50,000)",
        )
        log2 = AuditLog(
            user_id=None,
            user_email="SYSTEM_ENGINE",
            action="ML_PREDICTION_DISPATCHED",
            target_record="CT-2026-001",
            ip_address="127.0.0.1",
            outcome="SUCCESS",
            details="Executed RandomForest-DBSCAN-v1.0 model. Candidate zone Janpath Inner Circle.",
        )
        db.add_all([log1, log2])
        db.commit()
