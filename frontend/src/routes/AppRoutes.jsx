import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Dashboard from '../pages/Dashboard';
import Complaints from '../pages/Complaints';
import ComplaintDetails from '../pages/ComplaintDetails';
import PredictionCenter from '../pages/PredictionCenter';
import IntelligenceMap from '../pages/IntelligenceMap';
import TransactionNetwork from '../pages/TransactionNetwork';
import Alerts from '../pages/Alerts';
import SecurityCenter from '../pages/SecurityCenter';
import Login from '../pages/Login';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="complaints" element={<Complaints />} />
        <Route path="complaints/:id" element={<ComplaintDetails />} />
        <Route path="predictions" element={<PredictionCenter />} />
        <Route path="map" element={<IntelligenceMap />} />
        <Route path="network" element={<TransactionNetwork />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="security" element={<SecurityCenter />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
