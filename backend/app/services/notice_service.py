"""
Pillar 1: Notice Service for CyberTrace AI.
Generates statutory Section 91 CrPC / Section 94 BNSS Bank Freeze Advisories
and computes real-time Golden Hour SLA metrics for rapid cybercrime intervention.
"""

from datetime import datetime, timezone, timedelta
import hashlib
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.app.models.complaint import Complaint
from backend.app.models.transaction import Transaction
from backend.app.models.prediction import Prediction
from backend.app.domain.entities import UserPrincipal


# Standard Nodal Officer routing directory for Indian Financial Institutions
BANK_NODAL_DIRECTORY = {
    "STATE BANK OF INDIA": {
        "bank_code": "SBIN",
        "nodal_email": "nodal.cybercell@sbi.co.in",
        "portal_id": "SBI-CFCFRMS-DESK",
        "helpline": "1800-11-2211",
    },
    "HDFC BANK": {
        "bank_code": "HDFC",
        "nodal_email": "cybercell.nodal@hdfcbank.com",
        "portal_id": "HDFC-LE-PORTAL",
        "helpline": "1800-266-4332",
    },
    "ICICI BANK": {
        "bank_code": "ICIC",
        "nodal_email": "nodal.investigation@icicibank.com",
        "portal_id": "ICICI-LAW-DESK",
        "helpline": "1800-1080",
    },
    "AIRTEL PAYMENTS BANK": {
        "bank_code": "AIRP",
        "nodal_email": "nodal.officer@airtelbank.com",
        "portal_id": "AIRTEL-MULE-DESK",
        "helpline": "0124-4244444",
    },
    "PAYTM PAYMENTS BANK": {
        "bank_code": "PYTM",
        "nodal_email": "lawenforcement@paytmbank.com",
        "portal_id": "PAYTM-CFCFRMS-LE",
        "helpline": "0120-4456456",
    },
}

DEFAULT_BANK_NODAL = {
    "bank_code": "GENR",
    "nodal_email": "nodal.cyber@rbi-cfcfrms.gov.in",
    "portal_id": "I4C-NATIONAL-CLEARING",
    "helpline": "1930",
}


def calculate_golden_hour_status(db: Session, complaint_id_or_ref: str) -> Dict[str, Any]:
    """
    Computes real-time SLA Golden Hour metrics:
    Golden Hour = 90 minutes from initial fraud timestamp.
    """
    complaint = (
        db.query(Complaint)
        .filter(
            (Complaint.complaint_id == complaint_id_or_ref)
            | (Complaint.id == (int(complaint_id_or_ref) if complaint_id_or_ref.isdigit() else -1))
        )
        .first()
    )
    if not complaint:
        raise ValueError(f"Complaint '{complaint_id_or_ref}' not found")

    fraud_time = complaint.created_at
    if fraud_time.tzinfo is None:
        fraud_time = fraud_time.replace(tzinfo=timezone.utc)

    now = datetime.now(timezone.utc)
    elapsed_seconds = max(0, int((now - fraud_time).total_seconds()))
    elapsed_minutes = elapsed_seconds // 60

    golden_hour_limit_minutes = 90
    remaining_minutes = max(0, golden_hour_limit_minutes - elapsed_minutes)

    if elapsed_minutes <= 45:
        sla_tier = "TIER_1_SURVEILLANCE"
        risk_color = "emerald"
        action_label = "Optimal Intervention Window: Rapid Freeze Actionable"
    elif elapsed_minutes <= 75:
        sla_tier = "TIER_2_IMMINENT_CASHOUT"
        risk_color = "amber"
        action_label = "Imminent Cash-Out Risk: Immediate Nodal Freeze Required"
    else:
        sla_tier = "TIER_3_CRITICAL_BREACH"
        risk_color = "rose"
        action_label = "Critical Window: Terminal Cash-out Likely Occurred or In Progress"

    return {
        "complaint_id": complaint.complaint_id,
        "fraud_timestamp": fraud_time.isoformat(),
        "elapsed_minutes": elapsed_minutes,
        "remaining_minutes": remaining_minutes,
        "golden_hour_limit_minutes": golden_hour_limit_minutes,
        "sla_tier": sla_tier,
        "risk_color": risk_color,
        "action_label": action_label,
        "is_breached": remaining_minutes == 0,
        "percentage_elapsed": min(100, int((elapsed_minutes / golden_hour_limit_minutes) * 100)),
    }


def generate_bank_freeze_notice(
    db: Session, complaint_id_or_ref: str, principal: UserPrincipal
) -> Dict[str, Any]:
    """
    Generates an official statutory Section 91 CrPC / Section 94 BNSS
    Account Freeze and Transaction Trail Preservation Advisory.
    """
    complaint = (
        db.query(Complaint)
        .filter(
            (Complaint.complaint_id == complaint_id_or_ref)
            | (Complaint.id == (int(complaint_id_or_ref) if complaint_id_or_ref.isdigit() else -1))
        )
        .first()
    )
    if not complaint:
        raise ValueError(f"Complaint '{complaint_id_or_ref}' not found")

    # Fetch multi-hop transactions
    txns = (
        db.query(Transaction)
        .filter(Transaction.complaint_id == complaint.id)
        .order_by(Transaction.hop_level.asc())
        .all()
    )

    # Determine primary beneficiary/mule account
    target_account = "ACC-MULE-PRIMARY-01"
    target_bank = "STATE BANK OF INDIA"
    target_amount = complaint.amount

    if txns:
        # Pick the latest or highest hop mule account
        target_txn = txns[-1]
        target_account = target_txn.dest_account
        target_amount = target_txn.amount

    nodal_info = BANK_NODAL_DIRECTORY.get(target_bank.upper(), DEFAULT_BANK_NODAL)

    now = datetime.now(timezone.utc)
    notice_id = f"SEC94-BNSS-{complaint.complaint_id}-{now.strftime('%Y%m%d%H%M')}"

    # Draft statutory text
    notice_text = f"""
OFFICE OF THE SUPERINTENDENT OF POLICE / CYBER CRIME INVESTIGATION CELL
STATUTORY ADVISORY UNDER SECTION 94 BNSS, 2023 (ERSTWHILE SECTION 91 CrPC, 1973)
NOTICE FOR URGENT FREEZING OF FRAUDULENT BENEFICIARY ACCOUNT & PRESERVATION OF LOGS

Date: {now.strftime('%d-%b-%Y %H:%M:%S UTC')}
Notice Reference: {notice_id}
Case Reference: {complaint.complaint_id}
CFCFRMS / 1930 Acknowledgment: {complaint.transaction_reference or 'NCRP-SYN-2026-9921'}

TO:
The Nodal Officer (Law Enforcement Inquiries & Fraud Prevention Desk)
{target_bank}
Email: {nodal_info['nodal_email']}

SUBJECT: URGENT / TIME-SENSITIVE NOTICE UNDER SECTION 94 BNSS TO FREEZE ACCOUNT {target_account}
CONNECTED WITH CYBER FRAUD OF Rs. {complaint.amount:,.2f}

Sir / Madam,

1. WHEREAS, a formal cybercrime complaint ({complaint.complaint_id}) has been registered regarding a {complaint.fraud_type} incident wherein victim '{complaint.victim_name}' was defrauded of Rs. {complaint.amount:,.2f}.

2. AND WHEREAS, topological flow tracing conducted under authorized supervisory protocols indicates that siphoned funds have been swiftly layered into the following beneficiary account maintained with your institution:
   - Target Mule Account: {target_account}
   - Intercept Amount: Rs. {target_amount:,.2f}
   - Originating UTR / Ref: {complaint.transaction_reference or 'TXN-UPI-DEMO-001'}

3. NOW THEREFORE, by virtue of the powers vested under Section 94 of the Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS) / Section 91 of the Code of Criminal Procedure, 1973, you are hereby DIRECTED to:
   (a) IMMEDIATELY FREEZE / PUT DEBIT RESTRAINT on account {target_account} to prevent cash-out dissipation.
   (b) PRESERVE and furnish complete KYC documents, account opening form, linked mobile numbers, and IP/MAC login logs.
   (c) PREVENT any ATM card / POS / UPI terminal withdrawals linked to this beneficiary.

Failure to comply with this statutory directive within the mandated SLA may attract legal proceedings under Section 223 / 228 of the Bharatiya Nyaya Sanhita, 2023 (BNS).

Investigating Officer:
Officer ID: {principal.username}
Badge / Station Code: {principal.police_station_id or 'DL-CY-8841'}
Role: {principal.role.upper()}
Cyber Crime Police Station, Inter-Agency Task Force
""".strip()

    # Generate SHA-256 seal
    seal_hash = hashlib.sha256(notice_text.encode("utf-8")).hexdigest()

    return {
        "notice_id": notice_id,
        "complaint_id": complaint.complaint_id,
        "statutory_authority": "Section 94 BNSS, 2023 / Section 91 CrPC, 1973",
        "issued_at": now.isoformat(),
        "issuing_officer": {
            "officer_name": principal.username,
            "badge_number": principal.police_station_id or "DL-CY-8841",
            "role": principal.role,
        },
        "target_bank": {
            "bank_name": target_bank,
            "nodal_email": nodal_info["nodal_email"],
            "portal_code": nodal_info["portal_id"],
            "helpline": nodal_info["helpline"],
        },
        "mule_target": {
            "account_number": target_account,
            "freeze_amount": target_amount,
            "original_amount": complaint.amount,
            "transaction_reference": complaint.transaction_reference,
        },
        "sha256_digital_seal": seal_hash,
        "formatted_notice_text": notice_text,
    }
