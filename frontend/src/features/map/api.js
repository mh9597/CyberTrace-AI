import api from '../../services/api';

export async function fetchMapHotspots() {
  const res = await api.get('/map/hotspots');
  return res.data;
}

export async function fetchMapCandidateZones() {
  const res = await api.get('/map/candidate-zones');
  return res.data;
}

export async function fetchPatrolUnits(lat = 28.6295, lng = 77.2185) {
  const res = await api.get(`/map/patrol/units?lat=${lat}&lng=${lng}&radius_km=15.0`);
  return res.data;
}
