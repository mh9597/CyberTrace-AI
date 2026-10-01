"""
CyberTrace AI - Feature Engineering Module
Transforms cleaned transaction records into standardized numerical feature matrices for ML training and inference.
"""

from typing import Tuple, List, Dict, Any
import numpy as np
import pandas as pd


FEATURE_NAMES = [
    "log_amount",
    "hop_count",
    "velocity_score",
    "mule_risk_index",
    "atm_proximity_score",
    "fraud_type_weight",
    "account_recency_score",
    "burst_txn_score",
    "velocity_mule_interaction",
    "atm_urgency_score",
]

FRAUD_WEIGHTS = {
    "UPI Fraud": 1.35,
    "Card Phishing": 1.15,
    "Loan App Scam": 1.10,
    "Investment Scam": 1.25,
    "Identity Theft": 1.00,
    "SIM Swap": 1.30,
    "Part Time Job Scam": 1.25,
    "Cryptocurrency Fraud": 1.20,
    "Sextortion": 1.10,
    "Aadhaar Enabled Payment (AePS)": 1.40,
    "Corporate Email Compromise": 1.15,
}


def compute_velocity_score(minutes: pd.Series) -> pd.Series:
    """Computes an exponential decay velocity risk score: fast transfers (<15m) score close to 1.0."""
    return np.exp(-np.clip(minutes, 0, 180) / 25.0)


def compute_atm_proximity_score(dist_km: pd.Series) -> pd.Series:
    """Computes proximity score: closer ATM (< 500m) scores higher."""
    return 1.0 / (1.0 + np.clip(dist_km, 0, 20.0))


def compute_mule_risk_index(
    is_mule: pd.Series, age_days: pd.Series, utility_flag: pd.Series
) -> pd.Series:
    """Combines mule indicators into a calibrated 0.0 - 1.0 risk index."""
    age_risk = np.exp(-np.clip(age_days, 1, 365) / 30.0)
    utility_penalty = np.where(utility_flag == 0, 0.35, 0.0)
    base = np.where(is_mule == 1, 0.45, 0.05)
    return np.clip(base + (0.35 * age_risk) + utility_penalty, 0.0, 1.0)


def compute_burst_score(burst_count: pd.Series) -> pd.Series:
    """Calculates rapid multi-transaction burst score normalized to [0, 1]."""
    return np.clip(burst_count / 8.0, 0.0, 1.0)


def extract_features(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Extracts engineered features from a DataFrame of transactions.
    Returns:
        X (pd.DataFrame): matrix containing FEATURE_NAMES
        y (pd.Series): binary cash-out outcome
    """
    burst_series = df["burst_txn_count"] if "burst_txn_count" in df.columns else pd.Series(1, index=df.index)

    features = pd.DataFrame(index=df.index)
    features["log_amount"] = np.log1p(df["amount"])
    features["hop_count"] = df["hop_count"].astype(float)
    features["velocity_score"] = compute_velocity_score(df["transfer_velocity_min"])
    features["mule_risk_index"] = compute_mule_risk_index(
        df["is_mule_account"], df["mule_account_age_days"], df["prior_utility_payments"]
    )
    features["atm_proximity_score"] = compute_atm_proximity_score(df["distance_to_nearest_atm_km"])
    features["fraud_type_weight"] = df["fraud_type"].map(lambda t: FRAUD_WEIGHTS.get(str(t).strip(), 1.15))
    features["account_recency_score"] = np.exp(-np.clip(df["mule_account_age_days"], 1, 365) / 45.0)
    features["burst_txn_score"] = compute_burst_score(burst_series)
    
    # Non-linear interaction indicators
    features["velocity_mule_interaction"] = features["velocity_score"] * features["mule_risk_index"]
    features["atm_urgency_score"] = features["atm_proximity_score"] * features["velocity_score"]

    y = df["is_cash_out"] if "is_cash_out" in df.columns else pd.Series(0, index=df.index)
    return features[FEATURE_NAMES], y


def _clean_numeric(val: Any, default: float) -> float:
    """Helper to safely parse currency symbols, commas, and malformed strings."""
    if val is None or pd.isna(val):
        return default
    try:
        clean_str = str(val).replace(",", "").replace("₹", "").replace("INR", "").replace("$", "").strip()
        return float(clean_str)
    except Exception:
        return default


def extract_features_single(input_dict: Dict[str, Any]) -> pd.DataFrame:
    """
    Transforms a single complaint/transaction payload into a 1-row feature DataFrame.
    Defensively sanitizes fields to handle raw police console payloads.
    """
    row = {
        "amount": _clean_numeric(input_dict.get("amount") or input_dict.get("txn_amount"), 50000.0),
        "hop_count": int(_clean_numeric(input_dict.get("hop_count") or input_dict.get("hops"), 2)),
        "transfer_velocity_min": _clean_numeric(input_dict.get("transfer_velocity_min") or input_dict.get("velocity"), 15.0),
        "is_mule_account": int(_clean_numeric(input_dict.get("is_mule_account") or input_dict.get("is_mule"), 1)),
        "mule_account_age_days": int(_clean_numeric(input_dict.get("mule_account_age_days") or input_dict.get("account_age_days"), 7)),
        "prior_utility_payments": int(_clean_numeric(input_dict.get("prior_utility_payments") or input_dict.get("utility_bill_paid"), 0)),
        "distance_to_nearest_atm_km": _clean_numeric(input_dict.get("distance_to_nearest_atm_km") or input_dict.get("atm_dist"), 0.5),
        "burst_txn_count": int(_clean_numeric(input_dict.get("burst_txn_count") or input_dict.get("burst_count"), 4 if input_dict.get("is_mule_account", 1) else 1)),
        "fraud_type": str(input_dict.get("fraud_type") or input_dict.get("category", "UPI Fraud")),
        "timestamp": input_dict.get("timestamp", pd.Timestamp.now().isoformat()),
    }
    df = pd.DataFrame([row])
    X, _ = extract_features(df)
    return X
