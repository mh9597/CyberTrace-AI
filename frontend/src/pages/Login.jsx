import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import LoginForm from '@/components/ui/login-form';
import GoogleOnboardingModal from '@/components/modals/GoogleOnboardingModal';
import ForgotPasswordModal from '@/components/modals/ForgotPasswordModal';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  const registeredEmail = location.state?.registeredEmail;

  const { login, googleAuthInit, googleCompleteRegistration, loading } = useAuth();
  const [error, setError] = useState('');

  // Google onboarding modal state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [googleModalError, setGoogleModalError] = useState('');

  // Forgot password modal state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const handleSignInSubmit = async ({ email, password }) => {
    setError('');
    const res = await login(email, password);
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error);
    }
  };

  // Called after Google returns the auth code — exchange it for user profile info
  const handleGoogleSuccess = async (tokenResponse) => {
    setError('');
    try {
      // Fetch the user's profile from Google using the access token
      const profileRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const profile = await profileRes.json();

      const res = await googleAuthInit({
        email: profile.email,
        full_name: profile.name || profile.given_name || 'Officer',
        google_id: profile.sub,
      });

      if (res.success) {
        if (res.data.status === 'existing_user') {
          // Existing officer — direct access
          navigate(from, { replace: true });
        } else {
          // New Google user — show onboarding (Name, Badge, Role + SMTP OTP)
          setGoogleEmail(res.data.email);
          setGoogleName(res.data.full_name || profile.name || '');
          setGoogleModalError('');
          setShowGoogleModal(true);
        }
      } else {
        setError(res.error);
      }
    } catch (err) {
      setError('Google sign-in failed. Please try again.');
    }
  };

  // Real Google account picker — triggers the native browser Google popup
  const triggerGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Google sign-in was cancelled or failed.'),
  });

  const handleGoogleCompleteSubmit = async (formData) => {
    setGoogleModalError('');
    const res = await googleCompleteRegistration(formData);
    if (res.success) {
      setShowGoogleModal(false);
      navigate(from, { replace: true });
    } else {
      setGoogleModalError(res.error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-indigo-500/20">
      {/* Login Form */}
      <LoginForm
        title="Sign in"
        description="Welcome back! Please sign in to continue"
        defaultEmail={registeredEmail || ''}
        defaultPassword=""
        loading={loading}
        externalError={error}
        onSubmit={handleSignInSubmit}
        onGoogleSignIn={() => triggerGoogleLogin()}
        onForgotPassword={() => setShowForgotPasswordModal(true)}
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

      {/* Google Onboarding — Name, Badge, Role + SMTP OTP verification */}
      <GoogleOnboardingModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        email={googleEmail}
        initialName={googleName}
        externalError={googleModalError}
        loading={loading}
        onSubmit={handleGoogleCompleteSubmit}
      />

      {/* Forgot Password — Email OTP & Reset Key Modal */}
      <ForgotPasswordModal
        isOpen={showForgotPasswordModal}
        onClose={() => setShowForgotPasswordModal(false)}
        initialEmail={registeredEmail || ''}
      />
    </div>
  );
}
