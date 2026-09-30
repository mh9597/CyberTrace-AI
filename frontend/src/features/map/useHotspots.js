import { useState, useEffect, useCallback } from 'react';
import { fetchMapHotspots, fetchMapCandidateZones, fetchPatrolUnits } from './api';

export function useHotspots() {
  const [hotspots, setHotspots] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [patrolUnits, setPatrolUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [h, c, p] = await Promise.all([
        fetchMapHotspots(),
        fetchMapCandidateZones(),
        fetchPatrolUnits(),
      ]);
      setHotspots(h);
      setCandidates(c);
      setPatrolUnits(p);
    } catch (err) {
      setError(err.message || 'Failed to load geospatial intelligence');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { hotspots, candidates, patrolUnits, loading, error, refetch: loadData };
}
