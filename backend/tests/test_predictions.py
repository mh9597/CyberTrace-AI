import pytest
from fastapi import status


def test_generate_prediction_pipeline(investigator_client):
    """POST /complaints/{id}/predict executes the ML pipeline and returns candidate zone."""
    response = investigator_client.post("/complaints/CT-2026-001/predict?force_recalculate=true")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "candidate_zone" in data
    assert "risk_estimate" in data
    assert 0.0 <= data["risk_estimate"] <= 1.0
    assert "supporting_factors" in data


def test_generate_prediction_nonexistent_complaint(investigator_client):
    """POST /complaints/{id}/predict on invalid case ID returns 404."""
    response = investigator_client.post("/complaints/CT-NON-EXISTENT/predict")
    assert response.status_code == status.HTTP_404_NOT_FOUND


def test_get_case_predictions_list(investigator_client):
    """GET /complaints/{id}/predictions returns history of generated forecasts."""
    # First ensure at least one prediction exists
    investigator_client.post("/complaints/CT-2026-001/predict")
    response = investigator_client.get("/complaints/CT-2026-001/predictions")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_map_hotspots(investigator_client):
    """GET /map/hotspots returns historical withdrawal clusters discovered via DBSCAN."""
    response = investigator_client.get("/map/hotspots")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "cluster_id" in data[0]
        assert "latitude" in data[0]
        assert "longitude" in data[0]


def test_get_map_candidate_zones(investigator_client):
    """GET /map/candidate-zones returns active candidate zones from live predictions."""
    investigator_client.post("/complaints/CT-2026-001/predict")
    response = investigator_client.get("/map/candidate-zones")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert isinstance(data, list)


def test_get_transaction_network_graph(investigator_client):
    """GET /complaints/{id}/network returns NetworkX graph with nodes and directed edges."""
    response = investigator_client.get("/complaints/CT-2026-001/network")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "nodes" in data
    assert "edges" in data
    assert "total_amount_tracked" in data
    assert "rapid_hops_detected" in data
    assert len(data["nodes"]) >= 2
    assert len(data["edges"]) >= 1
