"""
LLM Investigative Copilot Service using OpenAI via OpenRouter for CyberTrace AI.
Provides grounded cybercrime intelligence, legal notice drafting, and forensic Q&A.
"""

import json
import urllib.request
import urllib.error
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.app.core.config import settings
from backend.app.models.complaint import Complaint
from backend.app.models.transaction import Transaction
from backend.app.models.prediction import Prediction
from backend.app.models.alert import Alert


COPILOT_SYSTEM_PROMPT = """You are CyberTrace AI Copilot, a senior Law Enforcement & Cybercrime Investigative AI Assistant for India's Smart India Hackathon (SIH 2026).
Your primary role is to assist Cyber Police Officers, Investigating Officers (IO), and Intelligence Analysts in:
1. Forensic Multi-Hop Mule Account Analysis & rapid split-transfer tracking.
2. Cash-out Location & Time-Window prediction heuristics (ATM perimeters, plainclothes dispatch).
3. Indian Cyber Law & Procedure (Information Technology Act 2000 Section 43/66C/66D/70, CrPC Section 91 & 102 / Bharatiya Nagarik Suraksha Sanhita 2023).
4. Statutory Bank Freeze Notice generation to Nodal Officers under 1930 / I4C protocols.
5. Modus Operandi Profiling (Jamtara Phishing, Mewat Sextortion, Digital Arrest Scam, Bogus Crypto Investment Rings).

Guidelines:
- Provide clear, actionable, structured intelligence. Use markdown bullet points and bold section headers.
- Always include relevant statutory sections (e.g., Section 91 CrPC for banking records, Section 66D IT Act for impersonation).
- If case data is provided in the prompt, reference the exact amounts, victim details, transaction references, and candidate cash-out zones.
- Maintain a professional, authoritative law-enforcement demeanor.
"""


def _get_case_context(db: Session, case_id: str) -> str:
    """Retrieve case, transactions, predictions, and alerts from DB to ground the LLM."""
    complaint = db.query(Complaint).filter(Complaint.complaint_id == case_id).first()
    if not complaint:
        # Try matching by ID
        if case_id.isdigit():
            complaint = db.query(Complaint).filter(Complaint.id == int(case_id)).first()
    
    if not complaint:
        return f"No active database record found for Case ID: {case_id}."

    txns = db.query(Transaction).filter(Transaction.complaint_id == complaint.id).order_by(Transaction.hop_level).all()
    predictions = db.query(Prediction).filter(Prediction.complaint_id == complaint.id).order_by(desc(Prediction.created_at)).all()
    alerts = db.query(Alert).filter(Alert.complaint_id == complaint.id).all()

    context_lines = [
        f"=== ACTIVE CASE FILE: {complaint.complaint_id} ===",
        f"Victim: {complaint.victim_name} (Phone: {complaint.victim_phone})",
        f"Category: {complaint.fraud_type}",
        f"Defrauded Amount: {complaint.currency} {complaint.amount:,.2f}",
        f"Initial Reference: {complaint.transaction_reference}",
        f"Status: {complaint.status}",
        f"Reported At: {complaint.reported_at.isoformat() if complaint.reported_at else 'Unknown'}",
        f"Case Notes: {complaint.notes or 'None'}",
        "",
        f"=== MULTI-HOP MULE TRANSACTION TRAIL ({len(txns)} records) ==="
    ]

    for t in txns:
        context_lines.append(
            f"- Hop {t.hop_level} | Txn: {t.txn_reference} | {t.source_account} ➔ {t.dest_account} | "
            f"₹{t.amount:,.2f} via {t.txn_type} | Zone: {t.zone_name or 'N/A'}, {t.city or ''} | "
            f"Cash-out Flag: {t.is_cash_out} | Flags: {t.suspicious_flags or 'None'}"
        )

    if predictions:
        context_lines.append("")
        context_lines.append(f"=== ML CASH-OUT FORECAST CANDIDATES ({len(predictions)} records) ===")
        for p in predictions:
            context_lines.append(
                f"- Model: {p.model_version} | Zone: {p.candidate_zone} | "
                f"Window: {p.time_window_start} to {p.time_window_end} | "
                f"Risk: {p.risk_band} ({int(p.risk_estimate * 100)}%) | Factors: {json.dumps(p.supporting_factors or {})}"
            )

    if alerts:
        context_lines.append("")
        context_lines.append(f"=== ACTIVE INVESTIGATION ALERTS ({len(alerts)} records) ===")
        for a in alerts:
            context_lines.append(
                f"- Alert: {a.alert_code} | Zone: {a.candidate_zone} | Risk: {a.risk_level} | "
                f"Review Status: {a.review_status} | Officer: {a.assigned_officer_name or 'Unassigned'} | "
                f"Notes: {a.decision_notes or 'None'}"
            )

    return "\n".join(context_lines)


def call_openrouter_api(messages: List[Dict[str, str]], model: str = None) -> Dict[str, Any]:
    """Execute API request to OpenRouter with automatic model fallback."""
    api_key = settings.OPENROUTER_API_KEY
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY is not configured.")

    target_model = model or settings.OPENROUTER_MODEL
    fallback_model = settings.OPENROUTER_FALLBACK_MODEL

    url = f"{settings.OPENROUTER_BASE_URL.rstrip('/')}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "CyberTrace AI Platform",
    }

    # First attempt with requested model
    for active_model in [target_model, fallback_model]:
        payload = {
            "model": active_model,
            "messages": messages,
            "temperature": 0.3,
            "max_tokens": 1200,
        }

        try:
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers=headers,
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=25) as response:
                res_data = json.loads(response.read().decode("utf-8"))
                choice = res_data.get("choices", [{}])[0]
                content = choice.get("message", {}).get("content", "")
                return {
                    "content": content,
                    "model": active_model,
                    "usage": res_data.get("usage", {}),
                    "success": True,
                }
        except urllib.error.HTTPError as e:
            error_body = e.read().decode("utf-8") if e.fp else str(e)
            # If rate limited (429) or model not found (404), try fallback model
            if e.code in [429, 404] and active_model != fallback_model:
                continue
            raise RuntimeError(f"OpenRouter API error (HTTP {e.code}): {error_body}")
        except Exception as e:
            if active_model != fallback_model:
                continue
            raise RuntimeError(f"Failed connecting to OpenRouter: {str(e)}")

    raise RuntimeError("All model attempts on OpenRouter were exhausted.")


def generate_copilot_response(
    db: Session,
    message: str,
    case_id: Optional[str] = None,
    history: Optional[List[Dict[str, str]]] = None,
) -> Dict[str, Any]:
    """
    Generate grounded investigative intelligence for the officer using OpenAI via OpenRouter.
    """
    messages = [{"role": "system", "content": COPILOT_SYSTEM_PROMPT}]

    # 1. Check if a case is referenced and inject factual ground truth
    case_context = ""
    if case_id:
        case_context = _get_case_context(db, case_id)
    else:
        # Detect if user mentioned CT-2026-001 or similar in text
        for potential_id in ["CT-2026-001", "CT-2026-002", "CT-2026-003", "CT-3026-001", "CT-3026-002"]:
            if potential_id.lower() in message.lower():
                case_context = _get_case_context(db, potential_id)
                case_id = potential_id
                break

    if case_context:
        messages.append({
            "role": "system",
            "content": f"CURRENT GROUNDED CASE EVIDENCE FROM DATABASE:\n{case_context}"
        })

    # 2. Append conversation history (up to last 6 turns)
    if history and isinstance(history, list):
        for h in history[-6:]:
            if isinstance(h, dict) and "role" in h and "content" in h:
                messages.append({"role": h["role"], "content": h["content"]})

    # 3. Append current user query
    messages.append({"role": "user", "content": message})

    # 4. Call OpenRouter
    api_result = call_openrouter_api(messages)
    reply_text = api_result["content"]

    # 5. Extract smart suggestion actions and legal references
    suggested_actions = [
        "Draft Section 91 CrPC Bank Freeze Notice",
        "Trace Multi-Hop Mule Layer 2 Accounts",
        "Deploy Plainclothes Unit to ATM Perimeter",
        "Export Forensic Dossier (Court-Admissible)",
    ]

    legal_references = [
        "Section 66D IT Act 2000 (Cheating by Impersonation via Computer)",
        "Section 91 CrPC (Summons to Produce Document/Account Trail)",
        "Section 102 CrPC (Power of Police Officer to Seize/Freeze Property)",
        "BNSS 2023 Section 94 (Electronic Record Preservation Order)",
    ]

    return {
        "reply": reply_text,
        "model_used": api_result["model"],
        "case_id": case_id,
        "suggested_actions": suggested_actions,
        "legal_references": legal_references,
        "timestamp": None,
    }


def draft_statutory_notice(
    db: Session,
    case_id: str,
    target_bank: str = "State Bank of India / Nodal Officer",
    officer_name: str = "Sub-Inspector Ananya Rao",
    badge_number: str = "IND-DEL-409",
) -> Dict[str, Any]:
    """Generates a formal legal Section 91 / 102 CrPC account debit freeze notice."""
    complaint = db.query(Complaint).filter(Complaint.complaint_id == case_id).first()
    if not complaint:
        complaint = db.query(Complaint).first()

    txns = db.query(Transaction).filter(Transaction.complaint_id == complaint.id).all() if complaint else []
    mule_accounts = [t.dest_account for t in txns if t.dest_account]

    complaint_id_str = complaint.complaint_id if complaint else case_id
    fraud_type_str = complaint.fraud_type if complaint else "Financial Cyber Fraud"
    amount_str = f"{complaint.amount:,.2f}" if (complaint and complaint.amount is not None) else "50,000.00"
    txn_ref_str = complaint.transaction_reference if (complaint and complaint.transaction_reference) else "TXN-DEMO-001"
    mule_accs_str = ", ".join(mule_accounts) if mule_accounts else "ACC-MULE-LAYER1-5521, ACC-MULE-LAYER2-7714"

    prompt = f"""Draft a formal, court-admissible STATUTORY POLICE NOTICE FOR IMMEDIATE DEBIT FREEZE OF SUSPECT MULE ACCOUNTS.
Legal Basis: Section 91 and Section 102 of the Code of Criminal Procedure, 1973 (CrPC) / Section 94 Bharatiya Nagarik Suraksha Sanhita (BNSS 2023).
Case Details:
- Crime Complaint ID: {complaint_id_str}
- Crime Type: {fraud_type_str}
- Defrauded Amount: ₹{amount_str}
- Initial UPI Transaction Ref: {txn_ref_str}
- Suspect Mule Accounts to Freeze Immediately: {mule_accs_str}
- Addressed To: The Nodal Officer / Branch Manager, {target_bank}
- Issuing Investigating Officer: {officer_name}, Badge No: {badge_number}, Cyber Crime Police Station, New Delhi.

Output the complete, formal legal notice text ready to be dispatched with official stamps and statutory compliance deadlines."""

    messages = [
        {"role": "system", "content": COPILOT_SYSTEM_PROMPT},
        {"role": "user", "content": prompt}
    ]

    api_result = call_openrouter_api(messages)
    return {
        "notice_text": api_result["content"],
        "case_id": complaint.complaint_id if complaint else case_id,
        "model_used": api_result["model"],
        "target_bank": target_bank,
        "accounts_frozen": mule_accounts,
    }
