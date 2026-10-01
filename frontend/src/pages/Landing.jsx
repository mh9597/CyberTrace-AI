import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  ArrowRight,
  Play,
  Calendar,
  Clock,
  Radio,
  FileText,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Layers,
  MapPin,
  CheckCircle2,
  GitFork,
  Lock,
  ChevronRight,
  Database,
  BarChart3,
  Users,
  Compass,
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'solution', label: 'Solution' },
    { id: 'how-it-works', label: 'How it Works' },
    { id: 'impact', label: 'Impact' },
    { id: 'about', label: 'About' },
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // 1. IsScrolled state for header background
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 2. Bottom of page check (activates 'about' when scrolled near bottom)
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
        setActiveSection('about');
        return;
      }

      // 3. Section scroll-spy with header offset
      const headerOffset = 160;
      let current = 'home';
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= headerOffset) {
            current = item.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setActiveSection(id);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFF] text-[#0F172A] font-sans relative overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-700">
      {/* Dynamic Header: Transparent at top, Transitions to White when scrolling */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3.5'
            : 'bg-transparent border-transparent shadow-none py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md ring-1 ring-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-[#0F172A]">
              CyberTrace <span className="text-blue-600">AI</span>
            </span>
          </div>

          {/* Navigation Links with Dynamic Active Switching */}
          <div className="hidden md:flex items-center gap-2 sm:gap-4 text-sm font-medium text-slate-700">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => scrollToSection(e, item.id)}
                  className={`px-3.5 py-1 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-100/80 text-blue-600 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/60'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Action CTA */}
          <button
            onClick={handleGetStarted}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all"
          >
            <span>{user ? 'Dashboard' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* FULL-SIZE HERO SECTION WITH FULL-BLEED BACKGROUND IMAGE */}
      <section id="home" className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden pt-24 pb-8">
        {/* Full Edge-to-Edge Background Image - Zero washing out of the majestic left fort */}
        <div className="absolute inset-0 w-full h-full pointer-events-none -z-0 overflow-hidden">
          <img
            src="/images/landing-bg.png"
            alt="CyberTrace AI Intelligence Map"
            className="w-full h-full object-cover object-center select-none"
          />

          {/* Smooth bottom transition into scrollable content sections */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F7FAFF] via-[#F7FAFF]/80 to-transparent" />
        </div>

        {/* Hero Interactive Content Container */}
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 pt-4 pb-6 relative z-10 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[480px]">
            {/* Left Column: Headlines & Actions */}
            <div className="lg:col-span-6 space-y-6">
              {/* Brand Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-blue-200/80 text-blue-700 text-xs font-semibold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                <span>CyberTrace AI</span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-600 font-normal">SIH 2026</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-1.5">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#0F172A] leading-[1.1]">
                  CyberTrace AI
                </h1>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent tracking-tight">
                  Predict. Trace. Prevent.
                </p>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg font-medium">
                AI powered cybercrime intelligence platform to predict potential cash-out
                locations, analyze transaction trails and assist law enforcement with timely
                actionable insights.
              </p>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={handleGetStarted}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all"
                >
                  <span>{user ? 'Open Dashboard' : 'Get Started'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setShowDemoVideo(true)}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 shadow-xs hover:border-slate-300 transition-all backdrop-blur-md"
                >
                  <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>

            {/* Right Column: Floating Cards matching Reference Screenshot */}
            <div className="lg:col-span-6 relative h-[440px] flex flex-col justify-between">
              {/* Top Row: Floating Cards 1 & 2 */}
              <div className="flex items-start justify-between gap-4">
                {/* Floating Card 1: High Risk Zone matching Reference UI */}
                <div
                  onClick={() => navigate('/dashboard')}
                  className="bg-white/85 backdrop-blur-xl rounded-2xl p-3.5 pr-5 border border-white/80 shadow-[0_10px_25px_-5px_rgba(239,68,68,0.15)] flex items-center gap-3.5 hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-red-500 via-rose-500 to-red-400 text-white flex items-center justify-center shadow-md shadow-red-500/30 shrink-0 ring-2 ring-red-400/40">
                    <ShieldAlert className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-semibold text-slate-500">High Risk Zone</p>
                    <p className="text-sm font-extrabold text-slate-900 leading-tight">Ahmedabad</p>
                    <p className="text-[11px] font-bold text-red-600">82% Probability</p>
                  </div>
                </div>

                {/* Floating Card 2: Potential Cash-out matching Reference UI */}
                <div
                  onClick={() => navigate('/predictions')}
                  className="bg-white/85 backdrop-blur-xl rounded-2xl p-3.5 pr-5 border border-sky-200/80 shadow-[0_10px_25px_-5px_rgba(59,130,246,0.15)] flex items-center gap-3.5 hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white flex items-center justify-center shadow-md shadow-blue-500/30 shrink-0 ring-2 ring-sky-400/40">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] font-semibold text-slate-500">Potential Cash-out</p>
                    <p className="text-sm font-extrabold text-slate-900 leading-tight">13 Oct 2026</p>
                    <p className="text-[11px] font-bold text-blue-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>10:00 AM – 2:00 PM</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Floating Card 3 (Live Intelligence Feed) matching Reference UI */}
              <div className="self-end w-[310px] bg-gradient-to-b from-white/95 via-white/85 to-[#ecfdf5]/85 backdrop-blur-xl rounded-2xl p-4 border border-emerald-200/60 shadow-[0_14px_35px_-5px_rgba(16,185,129,0.12)] space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-900">
                    Live Intelligence Feed
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 animate-pulse"></span>
                </div>
                <div className="space-y-2 text-[11px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                        B
                      </span>
                      <span className="truncate">Suspicious transaction detected</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-1">
                      3 min ago
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                        ✓
                      </span>
                      <span className="truncate">New complaint registered</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-1">
                      5 min ago
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                        !
                      </span>
                      <span className="truncate">High risk zone predicted</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-1">
                      12 min ago
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                        ●
                      </span>
                      <span className="truncate">Case CT-3026-002 updated</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-1">
                      20 min ago
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Bottom Statistics Bar directly floating over the cloud wave */}
        <div className="max-w-7xl mx-auto w-full px-6 sm:px-8 pt-4 pb-2 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left divide-y md:divide-y-0 md:divide-x divide-slate-300/40">
            <div className="space-y-0.5 pl-2">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                10K+
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Cases Analyzed
              </div>
            </div>

            <div className="space-y-0.5 pl-0 md:pl-6 pt-3 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                95%
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Prediction Accuracy
              </div>
            </div>

            <div className="space-y-0.5 pl-0 md:pl-6 pt-3 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                500+
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Authorized Officers
              </div>
            </div>

            <div className="space-y-0.5 pl-0 md:pl-6 pt-3 md:pt-0">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                24/7
              </div>
              <div className="text-xs font-semibold text-slate-500">
                Real-time Intelligence
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLLABLE SECTION 2: CORE CAPABILITIES (FEATURES) */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-6 sm:px-8 relative z-20">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
            <span>Core Intelligence Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Advanced Predictive Cybercrime Analytics
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Designed specifically for law enforcement agencies to identify cash-out nodes,
            dismantle mule accounts, and execute proactive field intercepts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              RF-DBSCAN Cash-out Engine
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Spatial clustering and time-window forecasting algorithm identifying candidate ATM withdrawal spots up to 4 hours in advance.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Mule Account Graph Topology
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multi-tier transaction graph traversal detecting mule network layers, rapid layering hops, and immediate destination accounts.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Geospatial Threat Heatmaps
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time state and district-level threat heat density with integrated ATM centroids, branch registries, and live surveillance pins.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              SHA-256 Chain of Custody
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tamper-evident cryptographic ledger recording every evidence upload, officer view, export action, and investigative note.
            </p>
          </div>
        </div>
      </section>

      {/* SCROLLABLE SECTION: SOLUTION ARCHITECTURE */}
      <section id="solution" className="py-20 bg-slate-900 text-white relative z-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pointer-events-none opacity-90" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
              <Layers className="w-3.5 h-3.5" />
              <span>Full-Stack Solution Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              An End-to-End Decision Support System
            </h2>
            <p className="text-sm sm:text-base text-slate-400">
              Bridge the critical gap between raw banking records and physical police field interdiction with proactive AI orchestration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm space-y-4 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">1. Ingestion & Graph Unification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects heterogeneous CDRs, bank statement CSVs, UPI gateway logs, and victim complaint reports into a single normalized graph representation.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm space-y-4 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">2. Predictive Intelligence Core</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dual AI engines combine random-walk mule detection with geospatial RF-DBSCAN clustering to project withdrawal probability and ATM candidate centroids.
              </p>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-6 backdrop-blur-sm space-y-4 hover:border-blue-500/50 transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold">3. Actionable Field Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generates time-critical alerts, pre-fills bank freeze notices, and arms local cyber cell officers with exact operational heat maps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLLABLE SECTION 3: HOW IT WORKS PIPELINE */}
      <section id="how-it-works" className="py-20 bg-white border-y border-slate-200 relative z-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
              <span>Operational Workflow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              From Cyber Complaint to Timely Action
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              How CyberTrace AI turns disparate transaction records into actionable police field intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-md">
                01
              </div>
              <h3 className="text-sm font-bold text-slate-900">Complaint & Data Ingestion</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parse victim reports, bank statements, transaction UTR numbers, and beneficiary records into canonical schema.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-md">
                02
              </div>
              <h3 className="text-sm font-bold text-slate-900">Graph & ML Inference</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Construct transaction topologies to identify intermediary mule nodes and calculate withdrawal likelihood scores.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-md">
                03
              </div>
              <h3 className="text-sm font-bold text-slate-900">Centroid Forecasting</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Project spatial candidate zones (e.g. Ahmedabad - Satellite) with tight ±1.2 km precision and estimated time windows.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-mono font-bold flex items-center justify-center shadow-md">
                04
              </div>
              <h3 className="text-sm font-bold text-slate-900">Officer Intervention</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Issue tactical alerts to local cyber crime cells for targeted field monitoring, bank coordination, and account freeze actions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SCROLLABLE SECTION 4: IMPACT & PROBLEM STATEMENT */}
      <section id="impact" className="py-20 max-w-7xl mx-auto px-6 sm:px-8 relative z-20">
        <div className="bg-gradient-to-tr from-blue-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-semibold border border-blue-400/30">
              SIH 2026 Problem Statement SIH26184
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Transforming Cybercrime Response from Reactive to Predictive
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Traditional cyber investigation takes hours to track money trails after cash has already been liquidated at distant ATMs. CyberTrace AI provides actionable intelligence in advance, giving law enforcement the critical lead window needed to protect citizen funds.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={handleGetStarted}
                className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/30 transition flex items-center gap-2"
              >
                <span>{user ? 'Launch Investigation Platform' : 'Get Started'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="about" className="border-t border-slate-200 bg-white py-12 relative z-20 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm text-slate-900">CyberTrace AI</span>
            <span className="text-slate-400">|</span>
            <span>SIH 2026 National Finalist</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <button onClick={handleGetStarted} className="hover:text-blue-600 transition">
              Dashboard
            </button>
            <button onClick={() => navigate('/complaints')} className="hover:text-blue-600 transition">
              Complaints
            </button>
            <button onClick={() => navigate('/predictions')} className="hover:text-blue-600 transition">
              Prediction Center
            </button>
            <button onClick={() => navigate('/map')} className="hover:text-blue-600 transition">
              Intelligence Map
            </button>
            <button onClick={() => navigate('/network')} className="hover:text-blue-600 transition">
              Transaction Network
            </button>
            <button onClick={() => navigate('/security')} className="hover:text-blue-600 transition">
              Security Center
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            &copy; 2026 CyberTrace AI. Authorized Law Enforcement Decision Support System.
          </p>
        </div>
      </footer>

      {/* Demo Walkthrough Modal */}
      {showDemoVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                CyberTrace AI Platform Walkthrough
              </h3>
              <button
                onClick={() => setShowDemoVideo(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-slate-950 rounded-xl flex items-center justify-center text-white text-center p-6 relative overflow-hidden">
              <img
                src="/images/landing-bg.png"
                alt="Walkthrough"
                className="absolute inset-0 w-full h-full object-cover opacity-25"
              />
              <div className="relative z-10 space-y-2">
                <ShieldAlert className="w-10 h-10 text-blue-500 mx-auto animate-bounce" />
                <p className="text-xs sm:text-sm font-semibold">
                  Prediction & Money Trail Demo System Active
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Explore live cash-out probability models, geospatial heatmaps, and transaction topology.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDemoVideo(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowDemoVideo(false);
                  handleGetStarted();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                {user ? 'Enter Dashboard' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
