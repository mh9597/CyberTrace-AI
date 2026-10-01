"""
CyberTrace AI - Model Prediction & Inference Service
Provides standalone single-case and batch inference, candidate zone projection, and explainable AI insights.
"""

from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta, timezone
import joblib
import numpy as np
import pandas as pd

from feature_engineering import extract_features_single, FEATURE_NAMES


BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
MODEL_SAVE_PATH = ARTIFACTS_DIR / "cashout_model.joblib"

_ARTIFACT_CACHE = None


def get_model_artifacts(model_path: Path = MODEL_SAVE_PATH) -> Dict[str, Any]:
    """Loads and caches model artifacts."""
    global _ARTIFACT_CACHE
    if _ARTIFACT_CACHE is None:
        if not model_path.exists():
            from train_model import train_pipeline
            _ARTIFACT_CACHE = train_pipeline(save_path=model_path)
        else:
            _ARTIFACT_CACHE = joblib.load(model_path)
    return _ARTIFACT_CACHE


def predict_cashout_risk(
    case_data: Dict[str, Any], transactions: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Inference endpoint: takes case metadata and transaction hops,
    predicts cashout probability, projects nearest DBSCAN candidate hotspot,
    and returns XAI supporting factors.
    """
    artifacts = get_model_artifacts()
    calibrated_model = artifacts["calibrated_model"]
    base_rf = artifacts["model"]
    cluster_engine = artifacts.get("cluster_engine")

    # If transactions provided, aggregate features
    txns = transactions or []
    hop_count = max(1, len(txns))
    
    # Calculate velocity
    if len(txns) >= 2:
        try:
            t0 = pd.to_datetime(txns[0]["timestamp"])
            t1 = pd.to_datetime(txns[-1]["timestamp"])
            velocity_min = max(1.0, abs((t1 - t0).total_seconds() / 60.0))
        except Exception:
            velocity_min = float(case_data.get("transfer_velocity_min", 15.0))
    else:
        velocity_min = float(case_data.get("transfer_velocity_min", 15.0))

    # Input payload
    payload = {
        "amount": float(case_data.get("amount", 50000.0)),
        "hop_count": hop_count,
        "transfer_velocity_min": velocity_min,
        "is_mule_account": int(case_data.get("is_mule_account", 1)),
        "mule_account_age_days": int(case_data.get("mule_account_age_days", 7)),
        "prior_utility_payments": int(case_data.get("prior_utility_payments", 0)),
        "distance_to_nearest_atm_km": float(case_data.get("distance_to_nearest_atm_km", 0.5)),
        "burst_txn_count": int(case_data.get("burst_txn_count", 4 if case_data.get("is_mule_account", 1) else 1)),
        "fraud_type": str(case_data.get("fraud_type", "UPI Fraud")),
        "timestamp": case_data.get("timestamp", datetime.now(timezone.utc).isoformat()),
    }

    # Extract 1-row feature vector
    X = extract_features_single(payload)
    feature_names = artifacts.get("feature_names", FEATURE_NAMES)

    # Predict calibrated probability
    prob = float(calibrated_model.predict_proba(X)[0][1])
    calibrated_risk = round(prob, 2)

    # Uncertainty calculation (distance from decision boundary 0.5)
    margin = abs(prob - 0.5) * 2.0  # 0.0 at 0.5 prob, 1.0 at 0 or 1
    uncertainty = round(float(max(0.08, 0.40 * (1.0 - margin))), 2)

    # Risk Band
    if calibrated_risk >= 0.75:
        risk_band = "Critical"
    elif calibrated_risk >= 0.60:
        risk_band = "High"
    elif calibrated_risk >= 0.40:
        risk_band = "Medium"
    else:
        risk_band = "Low"

    # Geospatial Hotspot Assignment
    lat = case_data.get("latitude")
    lon = case_data.get("longitude")
    if lat is None or lon is None:
        for t in txns:
            if t.get("latitude") and t.get("longitude"):
                lat, lon = float(t["latitude"]), float(t["longitude"])
                break

    if cluster_engine:
        hotspot = cluster_engine.find_nearest_hotspot(lat, lon)
    else:
        hotspot = {
            "cluster_id": 1,
            "zone_name": "Vadodara - Alkapuri Commercial Area",
            "latitude": 22.3106,
            "longitude": 73.1812,
            "radius_km": 1.2,
            "density_score": 0.92,
        }

    # Time Window Estimation
    now = datetime.now(timezone.utc)
    start_window = now + timedelta(minutes=15)
    end_window = now + timedelta(minutes=60)

    # Explainable AI (XAI) feature attribution
    importances = base_rf.feature_importances_
    xai_features = []
    for i, name in enumerate(feature_names):
        val = float(X.iloc[0][name])
        imp = float(importances[i])
        impact_score = round(imp * min(val, 2.0) * 100, 1)
        
        detail_msg = f"{name.replace('_', ' ').title()}: value {val:.2f}"
        if name == "velocity_score" and val > 0.5:
            detail_msg = "Rapid fund movement across accounts within under 15 minutes"
        elif name == "mule_risk_index" and val > 0.6:
            detail_msg = "Suspect account exhibits zero utility bills and newly opened tenure"
        elif name == "atm_proximity_score" and val > 0.5:
            detail_msg = "Transaction initiated within 800m of dense ATM terminal cluster"
        elif name == "burst_txn_score" and val > 0.4:
            detail_msg = "Multiple clustered transactions detected in rapid succession"
        elif name == "velocity_mule_interaction" and val > 0.3:
            detail_msg = "Compounded threat: fresh mule paired with rapid fund movement"
        elif name == "atm_urgency_score" and val > 0.3:
            detail_msg = "Critical ATM proximity paired with high transit velocity"

        xai_features.append({
            "name": name.replace("_", " ").title(),
            "score": int(min(99, max(15, impact_score * 3.5))),
            "impact": "High" if imp > 0.12 else "Medium",
            "detail": detail_msg,
        })

    xai_features.sort(key=lambda x: x["score"], reverse=True)

    return {
        "complaint_id": case_data.get("complaint_id", "CT-2026-UNKNOWN"),
        "model_version": artifacts.get("model_version", "RF-Calibrated-DBSCAN-v2.7"),
        "cash_out_probability": calibrated_risk,
        "probability_percentage": f"{int(calibrated_risk * 100)}%",
        "risk_band": risk_band,
        "uncertainty_score": uncertainty,
        "time_window": {
            "start": start_window.isoformat(),
            "end": end_window.isoformat(),
            "display": f"{start_window.strftime('%I:%M %p')} - {end_window.strftime('%I:%M %p')} Today",
        },
        "candidate_zone": {
            "name": hotspot.get("zone_name"),
            "latitude": hotspot.get("latitude"),
            "longitude": hotspot.get("longitude"),
            "radius_km": hotspot.get("radius_km", 1.2),
            "density_score": hotspot.get("density_score", 0.90),
        },
        "xai_features": xai_features[:5],
        "disclaimer": "Synthetic Investigative Lead. Human verification required before action.",
    }


if __name__ == "__main__":
    test_case = {
        "complaint_id": "CT-2026-001",
        "amount": 450000.0,
        "fraud_type": "UPI Fraud",
        "transfer_velocity_min": 3.5,
        "is_mule_account": 1,
        "mule_account_age_days": 4,
        "prior_utility_payments": 0,
        "distance_to_nearest_atm_km": 0.4,
        "latitude": 22.3106,
        "longitude": 73.1812,
    }
    result = predict_cashout_risk(test_case)
    import pprint
    pprint.pprint(result)
