"""
CyberTrace AI - Automated Test Suite: Pillars 1, 3 & 4 Verification
Covers:
1. Pillar 1: Golden Hour SLA Calculation & Section 94 BNSS Bank Freeze Notice Generation
2. Pillar 3: Tactical Patrol GPS Routing, Haversine Distance & Intercept Order Dispatching
3. Pillar 4: Court-Admissible Section 63 BSA / Section 65B IEA Electronic Dossier & Master Fingerprint
4. Architectural Compliance: UserPrincipal enforcement & Zero ORM leakage across all 3 pillar routes
"""

import sys
import os
import inspect
from datetime import datetime, timezone, timedelta
from pathlib import Path

# Add project root to sys.path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.domain.entities import UserPrincipal
from backend.app.db.database import SessionLocal
from backend.app.services.notice_service import (
    calculate_golden_hour_status,
    generate_bank_freeze_notice,
    BANK_NODAL_DIRECTORY,
)
from backend.app.services.patrol_service import (
    TACTICAL_POLICE_UNITS,
    haversine_distance_km,
    get_nearby_patrol_units,
    dispatch_patrol_unit,
)
from backend.app.services.dossier_service import generate_forensic_dossier

# Pillar route modules to inspect for layer compliance
import backend.app.api.routes.notices as notices_route
import backend.app.api.routes.patrol as patrol_route
import backend.app.api.routes.dossier as dossier_route


def get_test_principal():
    return UserPrincipal(
        id=1,
        username="investigator_rao",
        email="investigator@cybertrace.gov.in",
        role="investigator",
        police_station_id="IND-DEL-409",
    )


def test_pillar_1_golden_hour_sla(db):
    print("Testing Pillar 1: Golden Hour SLA Countdown Engine...")

    status = calculate_golden_hour_status(db, "CT-2026-001")

    assert status["complaint_id"] == "CT-2026-001"
    assert "elapsed_minutes" in status
    assert "remaining_minutes" in status
    assert "sla_tier" in status
    assert "action_label" in status
    assert status["golden_hour_limit_minutes"] == 90
    print(f"  [PASS] Case CT-2026-001 Golden Hour: Tier={status['sla_tier']}, Elapsed={status['elapsed_minutes']}m, Remaining={status['remaining_minutes']}m")


def test_pillar_1_statutory_freeze_notice(db):
    print("Testing Pillar 1: Section 94 BNSS / Section 91 CrPC Statutory Notice Generator...")

    principal = get_test_principal()
    notice = generate_bank_freeze_notice(db, "CT-2026-001", principal)

    # Check statutory references
    authority = notice["statutory_authority"]
    assert "Section 94 BNSS" in authority
    assert "Section 91 CrPC" in authority
    assert notice["complaint_id"] == "CT-2026-001"
    assert notice["issuing_officer"]["badge_number"] == "IND-DEL-409"
    assert "target_bank" in notice
    assert notice["target_bank"]["nodal_email"] is not None

    # Check cryptographic SHA-256 seal
    seal = notice["sha256_digital_seal"]
    assert len(seal) == 64
    assert all(c in "0123456789abcdef" for c in seal.lower())
    assert "STATUTORY ADVISORY UNDER SECTION 94 BNSS" in notice["formatted_notice_text"]
    assert "IMMEDIATELY FREEZE" in notice["formatted_notice_text"]
    print(f"  [PASS] Statutory Notice Generated with SHA-256 Seal: {seal[:16]}... for {notice['target_bank']['bank_name']}")


def test_pillar_3_tactical_patrol_dispatch():
    print("Testing Pillar 3: Tactical Patrol GPS Routing & Haversine Intercept Engine...")

    # Verify Haversine computation
    # Connaught Place (28.6315, 77.2167) to Karol Bagh (28.6514, 77.1907) is ~3.5 km
    dist = haversine_distance_km(28.6315, 77.2167, 28.6514, 77.1907)
    assert 3.0 <= dist <= 4.0, f"Unexpected haversine distance: {dist}"
    print(f"  [PASS] Haversine Distance (CP to Karol Bagh): {dist:.2f} km")

    # Verify unit listing near Connaught Place
    nearby = get_nearby_patrol_units(target_lat=28.6328, target_lng=77.2197, radius_km=10.0)
    assert len(nearby) >= 2, f"Expected at least 2 nearby patrol units, got {len(nearby)}"
    closest = nearby[0]
    assert "distance_km" in closest
    assert "eta_minutes" in closest
    assert "intercept_route" in closest
    print(f"  [PASS] Nearest Patrol Unit: {closest['call_sign']} ({closest['station_name']}) - Distance: {closest['distance_km']} km, ETA: {closest['eta_minutes']} mins")

    # Verify dispatch order generation
    principal = get_test_principal()
    dispatch_res = dispatch_patrol_unit(
        unit_id=closest["unit_id"],
        target_zone="Connaught Place Inner Circle ATM Hub",
        target_lat=28.6328,
        target_lng=77.2197,
        complaint_id="CT-2026-001",
        principal=principal,
    )

    assert dispatch_res["dispatch_order_id"].startswith("DISPATCH-ORD-")
    assert dispatch_res["unit_id"] == closest["unit_id"]
    assert len(dispatch_res["tactical_instructions"]) >= 3
    print(f"  [PASS] Field Intercept Order Created: {dispatch_res['dispatch_order_id']} via Radio Freq {dispatch_res['radio_frequency']}")


def test_pillar_4_court_admissible_dossier(db):
    print("Testing Pillar 4: Court-Admissible Section 63 BSA / 65B IEA Electronic Dossier...")

    principal = get_test_principal()
    dossier = generate_forensic_dossier(db, "CT-2026-001", principal)

    # Check evidence structure
    assert dossier["dossier_id"].startswith("DOSSIER-BSA63-")
    assert dossier["complaint_id"] == "CT-2026-001"
    assert "case_summary" in dossier
    assert "ml_forecast_summary" in dossier
    assert isinstance(dossier["transaction_trail"], list)

    # Check Section 63 BSA Certificate
    cert = dossier["bsa_section63_certificate"]
    assert "SECTION 63 OF THE BHARATIYA SAKSHYA ADHINIYAM, 2023" in cert
    assert "SECTION 65B OF THE INDIAN EVIDENCE ACT, 1872" in cert
    assert principal.username in cert

    # Verify Master Digital Fingerprint
    fingerprint = dossier["master_sha256_fingerprint"]
    assert len(fingerprint) == 64
    assert all(c in "0123456789abcdef" for c in fingerprint.lower())
    assert fingerprint in cert  # Must be embedded in sworn certificate

    print(f"  [PASS] Court Dossier Generated: {dossier['dossier_id']} with Master Fingerprint {fingerprint[:16]}...")


def test_pillars_architecture_compliance():
    print("Testing Pillars Architecture & Non-Leakage Contract...")

    routes_to_check = [
        ("notices_route", notices_route),
        ("patrol_route", patrol_route),
        ("dossier_route", dossier_route),
    ]

    for name, mod in routes_to_check:
        src = inspect.getsource(mod)
        # Check no ORM User model import (must use UserPrincipal)
        assert "from backend.app.models.user import User" not in src, f"{name} leaks ORM User model"
        # Check UserPrincipal is imported
        assert "UserPrincipal" in src, f"{name} must enforce UserPrincipal value object"
        print(f"  [PASS] {name} respects non-leakage & layer isolation rules")


if __name__ == "__main__":
    print("\n==================================================================")
    print(" CYBERTRACE AI: PILLARS 1, 3 & 4 INTEGRATION TEST SUITE")
    print("==================================================================")
    db = SessionLocal()
    try:
        test_pillar_1_golden_hour_sla(db)
        test_pillar_1_statutory_freeze_notice(db)
        test_pillar_3_tactical_patrol_dispatch()
        test_pillar_4_court_admissible_dossier(db)
        test_pillars_architecture_compliance()
        print("\nALL PILLAR INTEGRATION TESTS PASSED (100% SPEC & ARCHITECTURE COMPLIANT).")
        sys.exit(0)
    except AssertionError as err:
        print(f"\n[FAIL] PILLAR TEST FAILED: {err}")
        sys.exit(1)
    except Exception as exc:
        import traceback
        traceback.print_exc()
        print(f"\n[ERROR] UNEXPECTED ERROR: {exc}")
        sys.exit(2)
    finally:
        db.close()
