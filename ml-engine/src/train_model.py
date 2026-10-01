"""
CyberTrace AI - Model Training Module
Trains supervised Random Forest classifier with Platt probability calibration and DBSCAN geospatial clustering.
Saves model artifacts to ml-engine/artifacts/cashout_model.joblib.
"""

import os
from pathlib import Path
from typing import Dict, Any
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.frozen import FrozenEstimator
from sklearn.model_selection import train_test_split

from data_preprocessing import load_and_preprocess_data
from feature_engineering import extract_features, FEATURE_NAMES
from hotspot_clustering import HotspotClusterEngine


BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
MODEL_SAVE_PATH = ARTIFACTS_DIR / "cashout_model.joblib"


def train_pipeline(save_path: Path = MODEL_SAVE_PATH, force_refresh_data: bool = False) -> Dict[str, Any]:
    """
    Executes end-to-end data preparation, model training, calibration, and artifact persistence.
    """
    print("=" * 60)
    print(" CyberTrace AI - Training Cash-out Forecasting Engine")
    print("=" * 60)

    # 1. Load data
    df = load_and_preprocess_data(force_refresh=force_refresh_data)
    print(f" Loaded {len(df)} transactions.")

    # 2. Extract features
    X, y = extract_features(df)
    print(f" Extracted {len(FEATURE_NAMES)} features: {FEATURE_NAMES}")
    print(f" Target distribution (is_cash_out): Positive={y.sum()}, Negative={len(y) - y.sum()} ({y.mean():.2%})")

    # 3. Train-test split (80/20 stratified)
    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # 4. Train Regularized, Domain-Generalized Random Forest Classifier
    rf = RandomForestClassifier(
        n_estimators=220,
        max_depth=9,
        min_samples_split=6,
        min_samples_leaf=3,
        max_features="sqrt",
        random_state=42,
        class_weight="balanced_subsample",
        oob_score=True,
    )
    rf.fit(X_train, y_train)
    print(f" Base Random Forest classifier trained (OOB Generalization Score: {rf.oob_score_:.2%}).")

    # 5. Calibrate Probabilities using FrozenEstimator (scikit-learn 1.7+ compliant)
    calibrated_rf = CalibratedClassifierCV(FrozenEstimator(rf), method="sigmoid")
    calibrated_rf.fit(X_val, y_val)
    print(" Platt probability calibration fitted on validation split.")

    # 6. Fit Geospatial Hotspots with DBSCAN
    cluster_engine = HotspotClusterEngine(eps_km=3.0, min_samples=6)
    cashout_subset = df[df["is_cash_out"] == 1]
    discovered_clusters = cluster_engine.fit(cashout_subset)
    print(f" DBSCAN identified {len(discovered_clusters)} spatial cash-out hotspot clusters.")

    # 7. Package and Save Artifacts
    os.makedirs(save_path.parent, exist_ok=True)
    artifacts = {
        "model": rf,
        "calibrated_model": calibrated_rf,
        "cluster_engine": cluster_engine,
        "clusters": discovered_clusters,
        "feature_names": FEATURE_NAMES,
        "model_version": "RF-Calibrated-DBSCAN-v2.7",
        "trained_samples_count": len(df),
    }

    joblib.dump(artifacts, save_path)
    print(f" Saved model package successfully to: {save_path}")

    return artifacts


if __name__ == "__main__":
    train_pipeline()
