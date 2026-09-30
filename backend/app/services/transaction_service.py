from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
import networkx as nx
from sqlalchemy.orm import Session
from backend.app.models.transaction import Transaction
from backend.app.models.complaint import Complaint, ComplaintStatus
from backend.app.schemas.transaction import (
    TransactionCreate,
    TransactionNetworkGraph,
    NetworkNode,
    NetworkEdge,
)


def get_transactions_by_complaint(db: Session, complaint_id: int) -> List[Transaction]:
    return (
        db.query(Transaction)
        .filter(Transaction.complaint_id == complaint_id)
        .order_by(Transaction.timestamp.asc())
        .all()
    )


def import_transaction_records(
    db: Session, complaint_id: int, records: List[Dict[str, Any]]
) -> List[Transaction]:
    """Imports, cleans, deduplicates, and assigns hop levels to transaction events."""
    created_txns = []
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise ValueError("Complaint not found")

    existing_refs = {
        t.txn_reference for t in db.query(Transaction.txn_reference).filter(Transaction.complaint_id == complaint_id).all()
    }

    # Sort incoming by timestamp if available
    def parse_time(val):
        if isinstance(val, datetime):
            return val
        if isinstance(val, str):
            try:
                return datetime.fromisoformat(val.replace("Z", "+00:00"))
            except Exception:
                pass
        return datetime.now(timezone.utc)

    records.sort(key=lambda r: parse_time(r.get("timestamp")))

    # Process and build layer hops
    account_hops = {}
    if complaint.transaction_reference:
        account_hops[complaint.transaction_reference] = 0

    for idx, rec in enumerate(records):
        ref = rec.get("txn_reference") or f"TXN-IMP-{complaint_id}-{idx+1}"
        if ref in existing_refs:
            continue  # Skip duplicates
        existing_refs.add(ref)

        src = rec.get("source_account", f"ACC-SRC-{idx}")
        dst = rec.get("dest_account", f"ACC-DST-{idx}")
        amount = float(rec.get("amount", 0.0))
        t_time = parse_time(rec.get("timestamp"))
        t_type = rec.get("txn_type", "UPI")

        # Determine hop level
        parent_hop = account_hops.get(src, idx)
        hop = parent_hop + 1
        account_hops[dst] = hop

        # Detect suspicious patterns
        flags = []
        is_cash_out = False
        if "ATM" in dst.upper() or t_type.upper() == "ATM_WITHDRAWAL":
            is_cash_out = True
            flags.append("CASH_OUT_WITHDRAWAL")
        if hop >= 2:
            flags.append("MULTI_HOP_MULE")
        if amount >= 20000:
            flags.append("HIGH_VALUE_TRANSFER")

        txn = Transaction(
            txn_reference=ref,
            complaint_id=complaint_id,
            source_account=src,
            dest_account=dst,
            amount=amount,
            timestamp=t_time,
            txn_type=t_type,
            latitude=float(rec.get("latitude")) if rec.get("latitude") is not None else None,
            longitude=float(rec.get("longitude")) if rec.get("longitude") is not None else None,
            city=rec.get("city", "New Delhi"),
            zone_name=rec.get("zone_name"),
            atm_id=rec.get("atm_id"),
            is_cash_out=is_cash_out,
            hop_level=hop,
            suspicious_flags=",".join(flags) if flags else "NORMAL",
            data_provenance="Synthetic Ingestion Service",
        )
        db.add(txn)
        created_txns.append(txn)

    if created_txns:
        if complaint.status == ComplaintStatus.NEW.value:
            complaint.status = ComplaintStatus.UNDER_ANALYSIS.value
        db.commit()

    return created_txns


def build_network_graph(db: Session, complaint_id: int) -> TransactionNetworkGraph:
    """Builds an interactive NetworkX graph of accounts, transaction edges, and cash-outs."""
    txns = get_transactions_by_complaint(db, complaint_id)
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()

    G = nx.DiGraph()
    nodes_dict = {}
    edges_list = []
    total_amount = 0.0
    rapid_hops = 0

    # Add initial victim / complaint origin node
    complaint_ref = complaint.complaint_id if complaint else f"Case-{complaint_id}"

    for t in txns:
        total_amount += t.amount
        src = t.source_account
        dst = t.dest_account

        # Source node
        if src not in nodes_dict:
            src_type = "victim" if t.hop_level <= 1 else "mule_layer_1"
            nodes_dict[src] = NetworkNode(
                id=src,
                label=src,
                type=src_type,
                amount=t.amount,
                details={"city": t.city, "hop": t.hop_level},
            )

        # Dest node
        if dst not in nodes_dict:
            if t.is_cash_out or "ATM" in dst.upper():
                dst_type = "cash_out_atm"
            elif t.hop_level >= 2:
                dst_type = f"mule_layer_{min(t.hop_level, 3)}"
            else:
                dst_type = "mule_layer_1"

            nodes_dict[dst] = NetworkNode(
                id=dst,
                label=dst,
                type=dst_type,
                amount=t.amount,
                details={"city": t.city, "zone": t.zone_name, "atm_id": t.atm_id, "hop": t.hop_level},
            )

        # Edge
        edge = NetworkEdge(
            id=f"edge-{t.id}",
            source=src,
            target=dst,
            amount=t.amount,
            timestamp=t.timestamp.strftime("%Y-%m-%d %H:%M"),
            txn_type=t.txn_type,
            hop=t.hop_level,
        )
        edges_list.append(edge)
        G.add_edge(src, dst, weight=t.amount, txn_id=t.id)

        if t.suspicious_flags and "MULTI_HOP" in t.suspicious_flags:
            rapid_hops += 1

    summary_msg = (
        f"Identified {len(nodes_dict)} connected account entities across {len(edges_list)} transfer hops "
        f"accounting for ₹{total_amount:,.2f} total velocity."
    )

    return TransactionNetworkGraph(
        nodes=list(nodes_dict.values()),
        edges=edges_list,
        total_amount_tracked=total_amount,
        rapid_hops_detected=max(rapid_hops, len(edges_list) - 1 if len(edges_list) > 1 else 0),
        summary=summary_msg,
    )
