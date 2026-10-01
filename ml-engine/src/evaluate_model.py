"""
CyberTrace AI - Model Evaluation Module
Calculates Accuracy, Precision, Recall, F1-Score, ROC-AUC, Confusion Matrix,
and Explainable AI (XAI) feature importance rankings.
Outputs evaluation_report.json to ml-engine/artifacts.
"""

import json
import time
from pathlib import Path
from typing import Dict, Any
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
)
from sklearn.model_selection import StratifiedKFold

from data_preprocessing import load_and_preprocess_data
from feature_engineering import extract_features, FEATURE_NAMES


BASE_DIR = Path(__file__).resolve().parent.parent
ARTIFACTS_DIR = BASE_DIR / "artifacts"
MODEL_SAVE_PATH = ARTIFACTS_DIR / "cashout_model.joblib"
REPORT_SAVE_PATH = ARTIFACTS_DIR / "evaluation_report.json"


def evaluate_pipeline(
    model_path: Path = MODEL_SAVE_PATH, report_path: Path = REPORT_SAVE_PATH
) -> Dict[str, Any]:
    """
    Evaluates the trained model against holdout and cross-validation data.
    """
    if not model_path.exists():
        from train_model import train_pipeline
        train_pipeline(save_path=model_path)

    artifacts = joblib.load(model_path)
    model = artifacts["calibrated_model"]
    base_rf = artifacts["model"]

    # Load evaluation dataset
    df = load_and_preprocess_data()
    X, y = extract_features(df)

    # 5-Fold Stratified Cross Validation for robust evaluation
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    acc_scores, prec_scores, rec_scores, f1_scores, auc_scores = [], [], [], [], []

    from sklearn.base import clone
    feature_names = artifacts.get("feature_names", FEATURE_NAMES)

    for train_idx, test_idx in skf.split(X, y):
        X_tr, X_te = X.iloc[train_idx], X.iloc[test_idx]
        y_tr, y_te = y.iloc[train_idx], y.iloc[test_idx]

        base_clone = clone(base_rf)
        base_clone.fit(X_tr, y_tr)
        y_pred = base_clone.predict(X_te)
        y_prob = base_clone.predict_proba(X_te)[:, 1]

        acc_scores.append(accuracy_score(y_te, y_pred))
        prec_scores.append(precision_score(y_te, y_pred, zero_division=0))
        rec_scores.append(recall_score(y_te, y_pred, zero_division=0))
        f1_scores.append(f1_score(y_te, y_pred, zero_division=0))
        auc_scores.append(roc_auc_score(y_te, y_prob))

    # Holdout / Full predictions for confusion matrix and inference latency
    start_time = time.time()
    y_pred_full = base_rf.predict(X)
    y_prob_full = model.predict_proba(X)[:, 1]
    infer_duration_ms = ((time.time() - start_time) / len(X)) * 1000.0

    cm = confusion_matrix(y, y_pred_full)
    tn, fp, fn, tp = cm.ravel()

    # Feature Importance analysis (Gini importance from RF)
    importances = base_rf.feature_importances_
    sorted_indices = np.argsort(importances)[::-1]
    feature_ranking = [
        {
            "rank": int(i + 1),
            "feature": feature_names[idx] if idx < len(feature_names) else f"feature_{idx}",
            "importance": round(float(importances[idx]), 4),
            "percentage": round(float(importances[idx] * 100), 2),
        }
        for i, idx in enumerate(sorted_indices)
    ]

    report = {
        "model_version": artifacts.get("model_version", "RF-Calibrated-DBSCAN-v2.7"),
        "total_evaluated_samples": len(df),
        "metrics": {
            "accuracy": round(float(np.mean(acc_scores)), 4),
            "accuracy_percentage": f"{round(float(np.mean(acc_scores) * 100), 1)}%",
            "precision": round(float(np.mean(prec_scores)), 4),
            "recall": round(float(np.mean(rec_scores)), 4),
            "f1_score": round(float(np.mean(f1_scores)), 4),
            "roc_auc": round(float(np.mean(auc_scores)), 4),
            "mean_inference_latency_ms": round(infer_duration_ms, 3),
        },
        "confusion_matrix": {
            "true_negatives": int(tn),
            "false_positives": int(fp),
            "false_negatives": int(fn),
            "true_positives": int(tp),
        },
        "feature_importances": feature_ranking,
        "geospatial_hotspots_count": len(artifacts.get("clusters", [])),
    }

    # Save to JSON
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)

    print("\n" + "=" * 65)
    print(" CYBERTRACE AI - ML ENGINE ACCURACY & PERFORMANCE AUDIT REPORT")
    print("=" * 65)
    print(f" Model Version        : {report['model_version']}")
    print(f" Total Evaluated Cases: {report['total_evaluated_samples']}")
    print("-" * 65)
    print(f"  Accuracy           : {report['metrics']['accuracy_percentage']} ({report['metrics']['accuracy']})")
    print(f"  Precision          : {report['metrics']['precision'] * 100:.1f}%")
    print(f"  Recall             : {report['metrics']['recall'] * 100:.1f}%")
    print(f"  F1-Score           : {report['metrics']['f1_score'] * 100:.1f}%")
    print(f"  ROC-AUC            : {report['metrics']['roc_auc']:.4f}")
    print(f"  Inference Latency  : {report['metrics']['mean_inference_latency_ms']} ms / record")
    print("-" * 65)
    print(" Confusion Matrix:")
    print(f"   TN: {tn:<5} | FP: {fp:<5}")
    print(f"   FN: {fn:<5} | TP: {tp:<5}")
    print("-" * 65)
    print(" Top Feature Importances (XAI):")
    for feat in feature_ranking:
        bar = "|" * int(feat["percentage"] / 2.5)
        print(f"   #{feat['rank']} {feat['feature']:<22} : {feat['percentage']:>5.1f}%  {bar}")
    print("=" * 65 + "\n")

    return report


if __name__ == "__main__":
    evaluate_pipeline()
