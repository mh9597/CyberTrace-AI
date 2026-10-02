import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RestrictedAccess from '../components/common/RestrictedAccess';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7FAFF] dark:bg-slate-950 flex items-center justify-center font-mono text-xs text-slate-500">
        Authenticating officer credentials...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <RestrictedAccess userRole={user.role} requiredRoles={allowedRoles} />;
  }

  return children;
}
