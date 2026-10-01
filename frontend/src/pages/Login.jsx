import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoginForm from '@/components/ui/login-form';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const registeredEmail = location.state?.registeredEmail;

  const { login, loading } = useAuth();
  const [error, setError] = useState('');
  const [activeRole, setActiveRole] = useState({
    email: registeredEmail || 'investigator@cybertrace.gov.in',
    password: registeredEmail ? '' : 'Investigator@123',
  });

  useEffect(() => {
    if (registeredEmail) {
      setActiveRole({
        email: registeredEmail,
        password: '',
      });
    }
  }, [registeredEmail]);

  const handleSignInSubmit = async ({ email, password }) => {
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error);
    }
  };

  const handleSelectRole = (email, pass) => {
    setActiveRole({ email, password: pass });
    setError('');
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-indigo-500/20">
      {location.state?.from && (
        <div className="mb-4 max-w-lg w-full p-3 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-indigo-900 text-xs font-mono text-center shadow-xs">
          Authentication required to access {location.state.from.pathname}. Please sign in below.
        </div>
      )}

      {/* Login Form Component with White Surroundings */}
      <LoginForm
        title="Sign in"
        description="Welcome back! Please sign in to continue"
        defaultEmail={activeRole.email}
        defaultPassword={activeRole.password}
        loading={loading}
        externalError={error}
        onSubmit={handleSignInSubmit}
        onSelectRole={handleSelectRole}
        extraFooter={
          <div className="w-full mt-6 pt-4 border-t border-gray-100 flex flex-col items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 font-medium transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Portal</span>
            </Link>
            <p className="text-[10px] text-gray-400 text-center font-mono leading-tight">
              CyberTrace AI • Authorized Law Enforcement Decision Support System
            </p>
          </div>
        }
      />
    </div>
  );
}


