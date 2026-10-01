import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SignupForm from '@/components/ui/signup-form';

export default function Signup() {
  const navigate = useNavigate();
  const { signup, loading } = useAuth();
  const [error, setError] = useState('');

  const handleSignupSubmit = async (formData) => {
    setError('');
    const res = await signup({
      email: formData.email,
      password: formData.password,
      full_name: formData.full_name,
      role: formData.role,
      badge_number: formData.badge_number,
    });

    if (res.success) {
      navigate('/login', {
        state: {
          registeredEmail: formData.email,
        },
      });
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-indigo-500/20">
      <SignupForm
        onSubmit={handleSignupSubmit}
        loading={loading}
        externalError={error}
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
              CyberTrace AI • Authorized Law Enforcement Decision Support System • SIH 2026
            </p>
          </div>
        }
      />
    </div>
  );
}
