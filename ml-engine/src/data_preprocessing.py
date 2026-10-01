"""
CyberTrace AI - ML Engine Data Preprocessing Module
Handles loading, synthetic data generation, cleaning, validation, and encoding.
"""

import os
from pathlib import Path
from typing import Tuple, Optional
import numpy as np
import pandas as pd

# Default paths
BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
SYNTHETIC_DATA_PATH = DATA_DIR / "synthetic" / "sample_transactions.csv"
PROCESSED_DATA_PATH = DATA_DIR / "processed" / "cleaned_transactions.csv"


# Synonym dictionary for accepting arbitrary real cyber branch CSV columns
COLUMN_MAPPINGS = {
    # Amounts
    "txn_amount": "amount",
    "amount_inr": "amount",
    "transaction_amount": "amount",
    "debit_amount": "amount",
    "amt": "amount",
    "amount": "amount",

    # Hops
    "hops": "hop_count",
    "layer": "hop_count",
    "layer_count": "hop_count",
    "hop_count": "hop_count",

    # Velocity
    "velocity": "transfer_velocity_min",
    "velocity_mins": "transfer_velocity_min",
    "transit_time_min": "transfer_velocity_min",
    "time_delta_min": "transfer_velocity_min",
    "transfer_velocity_min": "transfer_velocity_min",

    # Mule flags
    "is_mule": "is_mule_account",
    "mule_flag": "is_mule_account",
    "suspect_mule": "is_mule_account",
    "is_mule_account": "is_mule_account",
    "account_age_days": "mule_account_age_days",
    "account_tenure_days": "mule_account_age_days",
    "mule_account_age_days": "mule_account_age_days",
    "utility_bill_paid": "prior_utility_payments",
    "has_utility": "prior_utility_payments",
    "prior_utility_payments": "prior_utility_payments",

    # ATM & Location
    "atm_dist": "distance_to_nearest_atm_km",
    "atm_distance": "distance_to_nearest_atm_km",
    "atm_dist_km": "distance_to_nearest_atm_km",
    "distance_to_nearest_atm_km": "distance_to_nearest_atm_km",
    "lat": "latitude",
    "lon": "longitude",
    "long": "longitude",
    "latitude": "latitude",
    "longitude": "longitude",

    # Burst frequency
    "burst_count": "burst_txn_count",
    "rapid_txns": "burst_txn_count",
    "txns_last_hour": "burst_txn_count",
    "burst_txn_count": "burst_txn_count",

    # Fraud Category
    "category": "fraud_type",
    "crime_type": "fraud_type",
    "complaint_category": "fraud_type",
    "fraud_type": "fraud_type",

    # Target Ground Truth
    "cashout": "is_cash_out",
    "cash_out_flag": "is_cash_out",
    "atm_withdrawn": "is_cash_out",
    "withdrawn": "is_cash_out",
    "is_cash_out": "is_cash_out",
}


def normalize_cyber_panel_schema(df: pd.DataFrame) -> pd.DataFrame:
    """
    Normalizes any police cyber panel or bank CDR CSV schema to CyberTrace AI standard schema.
    Auto-maps column synonyms, sanitizes values, and applies defensive defaults.
    """
    cleaned = df.copy()
    rename_dict = {}
    for col in cleaned.columns:
        norm_col = str(col).strip().lower().replace(" ", "_")
        if norm_col in COLUMN_MAPPINGS:
            rename_dict[col] = COLUMN_MAPPINGS[norm_col]

    cleaned.rename(columns=rename_dict, inplace=True)

    # Impute missing standard columns with domain baselines if absent in real cyber branch data
    if "amount" not in cleaned.columns:
        cleaned["amount"] = 50000.0
    if "hop_count" not in cleaned.columns:
        cleaned["hop_count"] = 2
    if "transfer_velocity_min" not in cleaned.columns:
        cleaned["transfer_velocity_min"] = 25.0
    if "is_mule_account" not in cleaned.columns:
        cleaned["is_mule_account"] = 1
    if "mule_account_age_days" not in cleaned.columns:
        cleaned["mule_account_age_days"] = 30
    if "prior_utility_payments" not in cleaned.columns:
        cleaned["prior_utility_payments"] = 0
    if "distance_to_nearest_atm_km" not in cleaned.columns:
        cleaned["distance_to_nearest_atm_km"] = 1.0
    if "burst_txn_count" not in cleaned.columns:
        cleaned["burst_txn_count"] = 2
    if "fraud_type" not in cleaned.columns:
        cleaned["fraud_type"] = "UPI Fraud"

    return cleaned


def generate_synthetic_transactions(
    n_samples: int = 3000, random_state: int = 42, save_path: Optional[Path] = SYNTHETIC_DATA_PATH
) -> pd.DataFrame:
    """
    Generates a realistic synthetic dataset simulating cybercrime transaction flows,
    mule account cascades, and physical cash-out outcomes across Indian metropolitan clusters.
    Incorporates realistic noise and edge cases mirroring police cyber cell data.
    """
    np.random.seed(random_state)

    # Hotspot center points in Gujarat & Delhi NCR
    hotspots = [
        {"city": "Vadodara - Alkapuri", "lat": 22.3106, "lon": 73.1812},
        {"city": "Ahmedabad - SG Highway", "lat": 23.0338, "lon": 72.5850},
        {"city": "Surat - Ring Road", "lat": 21.1702, "lon": 72.8311},
        {"city": "Rajkot - Kalawad Road", "lat": 22.3039, "lon": 70.8022},
        {"city": "Delhi - Connaught Place", "lat": 28.6295, "lon": 77.2185},
        {"city": "Delhi - Karol Bagh", "lat": 28.6517, "lon": 77.1906},
    ]

    fraud_types = ["UPI Fraud", "Investment Scam", "Card Phishing", "Loan App Scam", "Identity Theft"]
    fraud_probs = [0.45, 0.25, 0.15, 0.10, 0.05]

    data = []
    start_date = pd.Timestamp("2026-08-01")

    for i in range(n_samples):
        # Pick hotspot or random noise
        is_cluster = np.random.rand() < 0.80
        if is_cluster:
            hs = np.random.choice(hotspots)
            lat = hs["lat"] + np.random.normal(0, 0.015)
            lon = hs["lon"] + np.random.normal(0, 0.015)
            hotspot_name = hs["city"]
        else:
            lat = 20.0 + np.random.rand() * 8.0
            lon = 70.0 + np.random.rand() * 10.0
            hotspot_name = "Rural / Other Region"

        fraud_type = np.random.choice(fraud_types, p=fraud_probs)
        hop_count = int(np.random.choice([1, 2, 3, 4, 5], p=[0.25, 0.35, 0.25, 0.10, 0.05]))
        
        # Fraudulent amounts (UPI frauds typically 10k - 1L; Investment scams 2L - 15L)
        if fraud_type == "Investment Scam":
            amount = np.random.exponential(scale=350000) + 50000
        else:
            amount = np.random.exponential(scale=45000) + 5000
        amount = round(min(amount, 2500000), 2)

        # Mule indicators with natural real-world edge cases (some legitimate accounts get caught in sweeps)
        is_mule = 1 if np.random.rand() < (0.65 + 0.06 * hop_count) else 0
        mule_age_days = int(np.random.exponential(scale=18)) + 1 if is_mule else int(np.random.uniform(180, 1500))
        prior_utility = 0 if is_mule and np.random.rand() < 0.85 else 1
        
        # Velocity in minutes
        transfer_velocity_min = round(float(np.random.exponential(scale=12.0) + 1.5 if is_mule else np.random.exponential(scale=120.0) + 30.0), 1)
        
        # Distance to ATM (mules position near ATMs: 0.1 - 1.2 km)
        atm_dist_km = round(float(np.random.exponential(scale=0.6) + 0.1 if is_mule else np.random.exponential(scale=2.5) + 0.5), 2)

        # Rapid burst transaction count within 1 hour (mule accounts experience rapid cascading transfers)
        burst_txn_count = int(np.random.poisson(lam=4.5 if is_mule else 0.8))
        burst_txn_count = max(1, min(burst_txn_count, 15))

        # Cash-out probability rule with calibrated contrast
        z = (
            -2.4
            + 0.0000035 * amount
            + 0.55 * hop_count
            + (1.9 if is_mule else -1.3)
            - 0.045 * min(mule_age_days, 60)
            - 0.040 * min(transfer_velocity_min, 60)
            - 0.85 * atm_dist_km
            - (1.1 if prior_utility else 0.0)
            + 0.30 * min(burst_txn_count, 6)
            + (0.50 if "UPI" in fraud_type else 0.2)
        ) * 1.75
        prob_cashout = 1.0 / (1.0 + np.exp(-z))
        is_cash_out = 1 if np.random.rand() < prob_cashout else 0

        # Estimated window
        cashout_window_min = round(float(np.random.normal(35, 12)), 1) if is_cash_out else None

        txn_time = start_date + pd.Timedelta(
            days=int(np.random.uniform(0, 60)),
            hours=int(np.random.choice(range(24), p=[
                0.01, 0.01, 0.01, 0.01, 0.01, 0.02, # 0-5 AM
                0.03, 0.04, 0.06, 0.08, 0.09, 0.10, # 6-11 AM
                0.11, 0.10, 0.08, 0.07, 0.06, 0.05, # 12-17h
                0.00, 0.02, 0.01, 0.01, 0.01, 0.01  # 18-23h  (sum=1.00)
            ])),
            minutes=int(np.random.uniform(0, 59)),
        )

        data.append({
            "transaction_id": f"TXN-2026-{100000 + i}",
            "complaint_id": f"CT-2026-{1000 + (i % 300)}",
            "timestamp": txn_time.isoformat(),
            "amount": amount,
            "fraud_type": fraud_type,
            "hop_count": hop_count,
            "transfer_velocity_min": transfer_velocity_min,
            "is_mule_account": is_mule,
            "mule_account_age_days": mule_age_days,
            "prior_utility_payments": prior_utility,
            "latitude": round(lat, 5),
            "longitude": round(lon, 5),
            "distance_to_nearest_atm_km": atm_dist_km,
            "burst_txn_count": burst_txn_count,
            "hotspot_zone_name": hotspot_name,
            "cash_out_window_min": cashout_window_min,
            "is_cash_out": is_cash_out,
        })

    df = pd.DataFrame(data)

    if save_path:
        os.makedirs(save_path.parent, exist_ok=True)
        df.to_csv(save_path, index=False)
        print(f"[DataPreprocessing] Saved {len(df)} transactions to {save_path}")

    return df


def load_and_preprocess_data(data_path: Optional[Path] = None, force_refresh: bool = False) -> pd.DataFrame:
    """
    Loads raw transaction data from either real Cyber Police CSV or synthetic benchmark,
    auto-normalizes schemas, cleans corrupted fields, and returns a robust DataFrame.
    """
    path = data_path or SYNTHETIC_DATA_PATH
    if force_refresh or not path.exists() or os.path.getsize(path) == 0:
        print(f"[DataPreprocessing] Generating fresh synthetic baseline data...")
        df = generate_synthetic_transactions(n_samples=3000, save_path=path)
    else:
        df = pd.read_csv(path)
        # Check if legacy dataset without burst_txn_count or less than 2500 samples
        if "burst_txn_count" not in df.columns or len(df) < 2500:
            print(f"[DataPreprocessing] Upgrading dataset with cybercrime indicators...")
            df = generate_synthetic_transactions(n_samples=3000, save_path=path)

    # 1. Normalize schema for real police or bank CSV files
    df = normalize_cyber_panel_schema(df)

    # 2. Robust cleaning & defensive imputation
    df["timestamp"] = pd.to_datetime(df.get("timestamp", pd.Timestamp.now()), errors="coerce").fillna(pd.Timestamp.now())
    df["amount"] = pd.to_numeric(df["amount"], errors="coerce").fillna(50000.0)
    df["hop_count"] = pd.to_numeric(df["hop_count"], errors="coerce").fillna(2).astype(int)
    df["transfer_velocity_min"] = pd.to_numeric(df["transfer_velocity_min"], errors="coerce").fillna(25.0)
    df["mule_account_age_days"] = pd.to_numeric(df["mule_account_age_days"], errors="coerce").fillna(30).astype(int)
    df["distance_to_nearest_atm_km"] = pd.to_numeric(df["distance_to_nearest_atm_km"], errors="coerce").fillna(1.0)
    df["burst_txn_count"] = pd.to_numeric(df.get("burst_txn_count", 2), errors="coerce").fillna(2).astype(int)
    df["prior_utility_payments"] = pd.to_numeric(df.get("prior_utility_payments", 0), errors="coerce").fillna(0).astype(int)
    df["is_mule_account"] = pd.to_numeric(df.get("is_mule_account", 1), errors="coerce").fillna(1).astype(int)
    
    # Ground truth (if available in supervised data)
    if "is_cash_out" in df.columns:
        df["is_cash_out"] = pd.to_numeric(df["is_cash_out"], errors="coerce").fillna(0).astype(int)

    # Save cleaned copy
    os.makedirs(PROCESSED_DATA_PATH.parent, exist_ok=True)
    df.to_csv(PROCESSED_DATA_PATH, index=False)
    return df


if __name__ == "__main__":
    df = load_and_preprocess_data(force_refresh=True)
    print(f"Loaded {len(df)} records. Cash-out positive rate: {df['is_cash_out'].mean():.2%}")
