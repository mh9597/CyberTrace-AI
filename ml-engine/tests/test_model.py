"""
CyberTrace AI - ML Engine Test Suite
Tests preprocessing, feature engineering, DBSCAN clustering, model training, evaluation metrics, and inference.
"""

import sys
from pathlib import Path
import pytest
import pandas as pd
import numpy as np

# Add src to path
SRC_DIR = Path(__file__).resolve().parent.parent / "src"
sys.path.insert(0, str(SRC_DIR))

from data_preprocessing import generate_synthetic_transactions, load_and_preprocess_data
from feature_engineering import extract_features, extract_features_single, FEATURE_NAMES
from hotspot_clustering import HotspotClusterEngine
from train_model import train_pipeline
from evaluate_model import evaluate_pipeline
from predict import predict_cashout_risk


def test_data_generation_and_loading(tmp_path):
    """Verifies synthetic dataset generation and schema integrity."""
    csv_path = tmp_path / "test_txns.csv"
    df = generate_synthetic_transactions(n_samples=100, save_path=csv_path)
    
    assert len(df) == 100
    assert "amount" in df.columns
    assert "is_cash_out" in df.columns
    assert df["is_cash_out"].isin([0, 1]).all()
    assert df["amount"].min() > 0


def test_feature_engineering():
    """Verifies that engineered features match required dimensions and contain no NaNs."""
    df = generate_synthetic_transactions(n_samples=50, save_path=None)
    X, y = extract_features(df)
    
    assert list(X.columns) == FEATURE_NAMES
    assert len(X) == 50
    assert not X.isna().any().any(), "Features must not contain NaN values"
    assert len(y) == 50


def test_hotspot_clustering():
    """Verifies DBSCAN spatial clustering identifies valid centroid coordinates and densities."""
    df = generate_synthetic_transactions(n_samples=150, save_path=None)
    cashouts = df[df["is_cash_out"] == 1]
    
    engine = HotspotClusterEngine(eps_km=4.0, min_samples=3)
    clusters = engine.fit(cashouts)
    
    assert len(clusters) > 0, "DBSCAN should find at least one cluster"
    first = clusters[0]
    assert "latitude" in first and "longitude" in first
    assert 0.0 <= first["density_score"] <= 1.0

    # Nearest search
    nearest = engine.find_nearest_hotspot(22.31, 73.18)
    assert nearest is not None
    assert "zone_name" in nearest


def test_model_training_and_artifacts(tmp_path):
    """Verifies complete training pipeline outputs valid joblib artifact."""
    artifact_path = tmp_path / "test_cashout_model.joblib"
    artifacts = train_pipeline(save_path=artifact_path)
    
    assert artifact_path.exists()
    assert "model" in artifacts
    assert "calibrated_model" in artifacts
    assert "feature_names" in artifacts


def test_model_evaluation_metrics(tmp_path):
    """Verifies evaluation generates valid performance metrics meeting quality thresholds."""
    artifact_path = tmp_path / "test_cashout_model.joblib"
    report_path = tmp_path / "test_report.json"
    
    report = evaluate_pipeline(model_path=artifact_path, report_path=report_path)
    
    metrics = report["metrics"]
    assert metrics["accuracy"] >= 0.80, f"Expected accuracy >= 80%, got {metrics['accuracy']}"
    assert metrics["precision"] >= 0.75, f"Expected precision >= 75%, got {metrics['precision']}"
    assert metrics["recall"] >= 0.75, f"Expected recall >= 75%, got {metrics['recall']}"
    assert metrics["roc_auc"] >= 0.85, f"Expected ROC-AUC >= 85%, got {metrics['roc_auc']}"
    assert report_path.exists()


def test_prediction_inference():
    """Verifies single-case inference returns valid calibrated probability, risk band, and XAI breakdown."""
    test_case = {
        "complaint_id": "CT-2026-TEST",
        "amount": 350000.0,
        "fraud_type": "UPI Fraud",
        "transfer_velocity_min": 4.0,
        "is_mule_account": 1,
        "mule_account_age_days": 3,
        "prior_utility_payments": 0,
        "distance_to_nearest_atm_km": 0.3,
        "latitude": 22.3106,
        "longitude": 73.1812,
    }
    
    result = predict_cashout_risk(test_case)
    
    assert "cash_out_probability" in result
    assert 0.0 <= result["cash_out_probability"] <= 1.0
    assert result["risk_band"] in ["Low", "Medium", "High", "Critical"]
    assert "candidate_zone" in result
    assert "xai_features" in result
    assert len(result["xai_features"]) > 0


def test_real_cyber_panel_dirty_data_resilience():
    """
    Verifies that the ML Engine gracefully handles raw, noisy police cyber panel inputs:
    - String currency with commas and currency symbols ("₹2,45,000")
    - Non-standard police column aliases ("txn_amount", "velocity", "suspect_mule", "atm_dist")
    - Missing optional fields without crashing
    """
    raw_police_payload = {
        "complaint_id": "POLICE-NCRB-2026-9812",
        "txn_amount": "₹2,45,000",
        "category": "SIM Swap",
        "velocity": "3.5",
        "suspect_mule": "1",
        "account_age_days": "4",
        "atm_dist": "0.35",
        "lat": 22.3106,
        "lon": 73.1812,
    }

    result = predict_cashout_risk(raw_police_payload)

    assert result is not None
    assert "cash_out_probability" in result
    assert result["cash_out_probability"] >= 0.70, "High-risk mule with ATM proximity should score high probability"
    assert result["risk_band"] in ["High", "Critical"]
    assert len(result["xai_features"]) > 0
    assert result["candidate_zone"]["name"] is not None
