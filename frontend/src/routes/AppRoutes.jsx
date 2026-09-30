import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Landing from '../pages/Landing';
import Dashboard from '../pages/Dashboard';
import Complaints from '../pages/Complaints';
import PredictionCenter from '../pages/PredictionCenter';
import IntelligenceMap from '../pages/IntelligenceMap';
import TransactionNetwork from '../pages/TransactionNetwork';
import Alerts from '../pages/Alerts';
import SecurityCenter from '../pages/SecurityCenter';
import Login from '../pages/Login';

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Landing Page matching Panel 1 */}
      <Route path="/" element={<Landing />} />
      <Route path="/landing" element={<Landing />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />

      {/* 2-8. Authenticated App Pages matching Panels 2-8 */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/complaints" element={<Complaints />} />
        <Route path="/complaints/:id" element={<Complaints />} />
        <Route path="/predictions" element={<PredictionCenter />} />
        <Route path="/map" element={<IntelligenceMap />} />
        <Route path="/network" element={<TransactionNetwork />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/security" element={<SecurityCenter />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
