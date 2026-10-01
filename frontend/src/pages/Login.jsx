import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/images/landing-bg.png';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const roles = [
    {
      id: 'super_admin', label: 'Super Admin', sub: 'System Control',
      email: 'admin@cybertrace.gov.in', password: 'Admin@123',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M2 20h20M5 20l2-8 5 4 5-4 2 8" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="7" r="2.5" fill="#2563eb" />
          <circle cx="4" cy="11" r="1.8" fill="#2563eb" />
          <circle cx="20" cy="11" r="1.8" fill="#2563eb" />
        </svg>
      ),
      bg: '#EFF6FF',
    },
    {
      id: 'cybercrime_officer', label: 'Cybercrime Officer', sub: 'Complaint Management',
      email: 'officer@cybertrace.gov.in', password: 'Officer@123',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="#374151" strokeWidth="1.8" />
          <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
      bg: '#F3F4F6',
    },
    {
      id: 'intelligence_analyst', label: 'Intelligence Analyst', sub: 'Predictive Analytics',
      email: 'investigator@cybertrace.gov.in', password: 'Investigator@123',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="13" width="3" height="7" rx="1" fill="#7C3AED" />
          <rect x="9" y="8" width="3" height="12" rx="1" fill="#7C3AED" />
          <rect x="15" y="4" width="3" height="16" rx="1" fill="#7C3AED" />
        </svg>
      ),
      bg: '#EDE9FE',
    },
    {
      id: 'field_officer', label: 'Field Officer', sub: 'Response & Intervention',
      email: 'senior@cybertrace.gov.in', password: 'Senior@123',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="9" cy="8" r="3.5" stroke="#16A34A" strokeWidth="1.8" />
          <path d="M3 20c0-3.5 2.7-6 6-6" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="17" cy="10" r="3" stroke="#16A34A" strokeWidth="1.8" />
          <path d="M14 20c0-3 2-5 5-5h2" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ),
      bg: '#DCFCE7',
    },
  ];

  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [email, setEmail] = useState(roles[0].email);
  const [password, setPassword] = useState(roles[0].password);
  const [showPwd, setShowPwd] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const pickRole = (r) => { setSelectedRole(r); setEmail(r.email); setPassword(r.password); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    const res = await login(email, password);
    if (res.success) navigate('/'); else setError(res.error);
  };

  return (
    <div style={{
      width: '100vw', height: '100vh',
      backgroundImage: `url(${loginBg})`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter','Segoe UI',sans-serif",
      overflow: 'hidden',
    }}>

      {/* ─── NAVBAR ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '60px', flexShrink: 0,
        backgroundColor: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#2563EB" />
            <path d="M16 6L8 9.5V16c0 5 3.6 9.2 8 10.5C20.4 25.2 24 21 24 16V9.5L16 6z" fill="white" fillOpacity="0.9" />
            <polyline points="12,16 15,19 21,13" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: '17px', fontWeight: '800', color: '#111827', letterSpacing: '-0.3px' }}>
            CyberTrace <span style={{ color: '#2563EB' }}>AI</span>
          </span>
        </div>
        {/* Back to Home */}
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '14px', fontWeight: '500', color: '#4B5563',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </button>
      </div>

      {/* ─── BODY ─────────────────────────────────────────────────────── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'stretch',
        padding: '28px 36px 28px 36px', gap: '0', overflow: 'hidden',
      }}>

        {/* ── LEFT CONTENT ───────────────────────────────── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', paddingRight: '20px',
        }}>
          <div>
            {/* Platform Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(6px)',
              border: '1px solid rgba(0,0,0,0.1)', borderRadius: '20px',
              padding: '5px 13px', fontSize: '12.5px', fontWeight: '500',
              color: '#374151', marginBottom: '18px',
            }}>
              🇮🇳 India's Cyber Intelligence Platform
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: '38px', fontWeight: '800', lineHeight: '1.2',
              color: '#111827', margin: '0 0 14px',
              textShadow: '0 1px 3px rgba(255,255,255,0.7)',
            }}>
              Secure Access to<br />
              a <span style={{ color: '#2563EB' }}>Safer India</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '14.5px', color: '#374151', lineHeight: '1.65',
              maxWidth: '390px', margin: '0 0 26px',
              textShadow: '0 1px 3px rgba(255,255,255,0.6)',
            }}>
              Sign in to access real-time cybercrime intelligence,
              predict potential cash-out locations, and support
              timely intervention.
            </p>

            {/* Feature 2×2 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', maxWidth: '420px' }}>
              {[
                {
                  title: 'Predict', desc: 'Identify likely withdrawal locations in advance',
                  color: '#2563EB', bg: '#EFF6FF',
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#DBEAFE" stroke="#2563EB" strokeWidth="1.5" /><polyline points="9 12 11 14 15 10" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                },
                {
                  title: 'Trace', desc: 'Link complaints, accounts and transaction trails',
                  color: '#7C3AED', bg: '#EDE9FE',
                  icon: <svg width="18" height="18" viewBox="0 0 24 24"><rect x="3" y="12" width="3.5" height="8" rx="1" fill="#7C3AED" /><rect x="9" y="7" width="3.5" height="13" rx="1" fill="#7C3AED" /><rect x="15" y="3" width="3.5" height="17" rx="1" fill="#7C3AED" /></svg>,
                },
                {
                  title: 'Prevent', desc: 'Enable proactive and timely action',
                  color: '#DC2626', bg: '#FEE2E2',
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" fill="#FEE2E2" stroke="#DC2626" strokeWidth="1.5" /><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#DC2626" strokeWidth="1.5" /></svg>,
                },
                {
                  title: 'Protect', desc: 'Support law enforcement with actionable insights',
                  color: '#16A34A', bg: '#DCFCE7',
                  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3" stroke="#16A34A" strokeWidth="1.5" /><path d="M3 20v-1a6 6 0 0 1 6-6" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" /><circle cx="17" cy="10" r="3" stroke="#16A34A" strokeWidth="1.5" /><path d="M14 20v-1a5 5 0 0 1 5-5h2" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" /></svg>,
                },
              ].map(({ title, desc, color, bg, icon }) => (
                <div key={title} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  background: 'rgba(255,255,255,0.80)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.95)',
                  borderRadius: '12px', padding: '13px 14px',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                  <div style={{
                    width: '34px', height: '34px', borderRadius: '9px',
                    background: bg, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px',
                  }}>{icon}</div>
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#111827' }}>{title}</div>
                    <div style={{ fontSize: '11.5px', color: '#6B7280', lineHeight: '1.5', marginTop: '2px' }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Stats Bar ── */}
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(10px)',
            borderRadius: '14px', border: '1px solid rgba(255,255,255,0.95)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)', overflow: 'hidden',
            marginTop: '24px',
          }}>
            {[
              { icon: '🏛️', val: '10K+', label: 'Cases Analyzed' },
              { icon: '📈', val: '95%', label: 'Prediction Accuracy' },
              { icon: '👤', val: '500+', label: 'Authorized Officers' },
              { icon: '🕐', val: '24/7', label: 'Real-time Intelligence' },
            ].map(({ icon, val, label }, i, arr) => (
              <div key={label} style={{
                flex: 1, padding: '14px 10px', textAlign: 'center',
                borderRight: i < arr.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none',
              }}>
                <div style={{ fontSize: '18px', marginBottom: '3px' }}>{icon}</div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>{val}</div>
                <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT LOGIN CARD ─────────────────────────────── */}
        <div style={{
          width: '370px', flexShrink: 0,
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '20px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          padding: '28px 28px 24px',
          display: 'flex', flexDirection: 'column', gap: '18px',
          alignSelf: 'center',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 100px)',
        }}>

          {/* Card Logo */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px' }}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#2563EB" />
                <path d="M16 6L8 9.5V16c0 5 3.6 9.2 8 10.5C20.4 25.2 24 21 24 16V9.5L16 6z" fill="white" fillOpacity="0.9" />
                <polyline points="12,16 15,19 21,13" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: '16px', fontWeight: '800', color: '#111827' }}>
                CyberTrace <span style={{ color: '#2563EB' }}>AI</span>
              </span>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#111827', margin: '0 0 4px' }}>Welcome Back</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>Sign in to continue to your account</p>
          </div>

          {/* Role Selector */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>Select Your Role</span>
              <a href="#" style={{ fontSize: '12px', color: '#2563EB', textDecoration: 'none' }}>
                Need access? <span style={{ textDecoration: 'underline' }}>Contact Admin</span>
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {roles.map((r) => {
                const sel = selectedRole.id === r.id;
                return (
                  <button key={r.id} onClick={() => pickRole(r)} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '9px 10px',
                    borderRadius: '10px',
                    border: sel ? '2px solid #2563EB' : '1.5px solid #E5E7EB',
                    background: sel ? '#EFF6FF' : '#FAFAFA',
                    cursor: 'pointer', textAlign: 'left', position: 'relative',
                    transition: 'all 0.15s ease',
                  }}>
                    <div style={{
                      width: '34px', height: '34px', borderRadius: '8px',
                      background: r.bg, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{r.icon}</div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#111827', lineHeight: '1.3' }}>{r.label}</div>
                      <div style={{ fontSize: '10.5px', color: '#6B7280' }}>{r.sub}</div>
                    </div>
                    {sel && (
                      <div style={{
                        position: 'absolute', top: '6px', right: '6px',
                        width: '16px', height: '16px', borderRadius: '50%',
                        background: '#2563EB',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="10" height="10" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              padding: '9px 12px', background: '#FEF2F2',
              border: '1px solid #FECACA', borderRadius: '8px',
              fontSize: '13px', color: '#DC2626',
            }}>{error}</div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><rect x="2" y="4" width="20" height="16" rx="2" /><polyline points="2,4 12,13 22,4" /></svg>
                </span>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px 12px 10px 38px',
                    border: '1.5px solid #E5E7EB', borderRadius: '9px',
                    fontSize: '13.5px', color: '#111827',
                    background: '#F9FAFB', outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                </span>
                <input
                  type={showPwd ? 'text' : 'password'} required value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%', boxSizing: 'border-box',
                    padding: '10px 38px 10px 38px',
                    border: '1.5px solid #E5E7EB', borderRadius: '9px',
                    fontSize: '13.5px', color: '#111827',
                    background: '#F9FAFB', outline: 'none',
                  }}
                  onFocus={e => e.target.style.borderColor = '#2563EB'}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                  position: 'absolute', right: '12px', top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
                }}>
                  {showPwd
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  }
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '7px', cursor: 'pointer', fontSize: '13px', color: '#374151' }}>
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                  style={{ width: '14px', height: '14px', cursor: 'pointer', accentColor: '#2563EB' }} />
                Remember me
              </label>
              <a href="#" style={{ fontSize: '13px', color: '#2563EB', textDecoration: 'none', fontWeight: '500' }}>
                Forgot Password?
              </a>
            </div>

            {/* Sign In */}
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '13px',
              background: loading ? '#93C5FD' : '#2563EB',
              color: 'white', fontSize: '15px', fontWeight: '700',
              borderRadius: '10px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              letterSpacing: '0.01em', transition: 'background 0.15s',
            }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#1D4ED8'; }}
              onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#2563EB'; }}
            >
              {loading ? 'Signing In…' : 'Sign In'}
              {!loading && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
            <span style={{ fontSize: '12px', color: '#9CA3AF', whiteSpace: 'nowrap' }}>Or continue with</span>
            <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }} />
          </div>

          {/* Social */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {/* Google */}
            <button style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px 8px', border: '1.5px solid #E5E7EB', borderRadius: '10px',
              background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#374151',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </button>
            {/* Microsoft */}
            <button style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px 8px', border: '1.5px solid #E5E7EB', borderRadius: '10px',
              background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#374151',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#D1D5DB'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
            >
              <svg width="16" height="16" viewBox="0 0 21 21">
                <rect width="10" height="10" fill="#F25022" /><rect x="11" width="10" height="10" fill="#7FBA00" />
                <rect y="11" width="10" height="10" fill="#00A4EF" /><rect x="11" y="11" width="10" height="10" fill="#FFB900" />
              </svg>
              Continue with Microsoft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
