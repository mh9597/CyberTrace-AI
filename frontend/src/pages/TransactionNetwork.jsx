import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  GitFork,
  Maximize2,
  Minimize2,
  ChevronDown,
  ShieldAlert,
  AlertTriangle,
  Lock,
  ArrowRight,
  Download,
  Filter,
  Eye,
  FileText,
  RefreshCw,
  Zap,
  TrendingUp,
  BarChart2,
  Clock,
  Search,
  CheckCircle2,
  Share2,
  Building2,
  Scale,
  Cpu,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CreditCard,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  SkipForward,
  PlusCircle,
  Plus,
  UserPlus,
  Trash2,
  X,
  Users,
  UserCheck,
  CheckSquare,
  Square,
  Info,
} from 'lucide-react';
import api from '../services/api';

// Comprehensive Database of Victims and Syndicate Network
const ALL_VICTIMS = [
  {
    id: 'victim-1',
    name: 'Priya Patel',
    caseId: 'CT-3026-002',
    loss: '₹8,00,000',
    lossNum: 800000,
    fraudType: 'Investment Scam',
    bank: 'State Bank of India',
    bankCode: 'SBI',
    account: '883921XXXX',
    ifsc: 'SBIN0001824',
    city: 'Ahmedabad',
    time: '12 Oct, 10:15 AM',
    color: '#2563EB',
    targetScammer: 'node-scammer-1',
    transferMode: 'UPI QR Phish',
  },
  {
    id: 'victim-2',
    name: 'Rohan Sharma',
    caseId: 'CT-2026-001',
    loss: '₹4,50,000',
    lossNum: 450000,
    fraudType: 'UPI Instant Refund',
    bank: 'HDFC Bank Ltd',
    bankCode: 'HDFC',
    account: '109283XXXX',
    ifsc: 'HDFC0001092',
    city: 'Surat',
    time: '12 Oct, 09:30 AM',
    color: '#2563EB',
    targetScammer: 'node-scammer-1',
    transferMode: 'UPI Link Scam',
  },
  {
    id: 'victim-3',
    name: 'Mehul Desai',
    caseId: 'CT-3026-003',
    loss: '₹1,20,000',
    lossNum: 120000,
    fraudType: 'Card Cloning / OTP Theft',
    bank: 'ICICI Bank Ltd',
    bankCode: 'ICICI',
    account: '772910XXXX',
    ifsc: 'ICIC0001882',
    city: 'Rajkot',
    time: '11 Oct, 02:20 PM',
    color: '#2563EB',
    targetScammer: 'node-scammer-2',
    transferMode: 'NetBanking Gateway',
  },
  {
    id: 'victim-4',
    name: 'Ananya Roy',
    caseId: 'CT-3056-003',
    loss: '₹5,40,000',
    lossNum: 540000,
    fraudType: 'Phishing Ring',
    bank: 'Axis Bank Ltd',
    bankCode: 'AXIS',
    account: '554411XXXX',
    ifsc: 'UTIB0002910',
    city: 'Mumbai',
    time: '12 Oct, 08:45 AM',
    color: '#2563EB',
    targetScammer: 'node-scammer-1',
    transferMode: 'IMPS Fraud Transfer',
  },
  {
    id: 'victim-5',
    name: 'Kavita Sen',
    caseId: 'CT-2034-007',
    loss: '₹3,20,000',
    lossNum: 320000,
    fraudType: 'Fake Loan App Extortion',
    bank: 'Kotak Mahindra Bank',
    bankCode: 'KOTAK',
    account: '339922XXXX',
    ifsc: 'KKBK0000712',
    city: 'Vadodara',
    time: '11 Oct, 05:10 PM',
    color: '#2563EB',
    targetScammer: 'node-scammer-2',
    transferMode: 'UPI Instant Debit',
  },
];

// Fixed Scammer, Intermediate Banks, and Cash-Out Terminals
const SYNDICATE_INFRASTRUCTURE = {
  scammers: [
    {
      id: 'node-scammer-1',
      account: '112233XXXX',
      holder: 'Rameshwar Yadav (Primary Scammer)',
      bank: 'HDFC Bank Ltd',
      bankCode: 'HDFC',
      ifsc: 'HDFC0004819',
      branch: 'Vadodara - Alkapuri',
      city: 'Vadodara',
      type: 'Primary Scammer Account (L1 Hub)',
      role: 'scammer',
      color: '#EA580C',
      hop: 1,
      x: 320,
      y: 190,
      sharedInCases: ['CT-3026-002', 'CT-2026-001', 'CT-3056-003'],
    },
    {
      id: 'node-scammer-2',
      account: '556677XXXX',
      holder: 'Karan Mehra (Digital Mule Escrow)',
      bank: 'Paytm Payments Bank',
      bankCode: 'PAYTM',
      ifsc: 'PYTM0123456',
      branch: 'Noida Hub',
      city: 'Noida',
      type: 'Layer 1 Gateway Mule',
      role: 'scammer',
      color: '#F59E0B',
      hop: 1,
      x: 320,
      y: 370,
      sharedInCases: ['CT-3026-003', 'CT-2034-007'],
    },
  ],
  muleBanks: [
    {
      id: 'node-bank-axis',
      account: '455666XXXX',
      holder: 'Suresh Kumar Rawat',
      bank: 'Axis Bank Ltd',
      bankCode: 'AXIS',
      ifsc: 'UTIB0001092',
      branch: 'Surat - Ring Road',
      city: 'Surat',
      type: 'Layer 2 Mule Account',
      role: 'mule_layer_2',
      color: '#9333EA',
      hop: 2,
      x: 540,
      y: 120,
      sharedInCases: ['CT-2034-007'],
    },
    {
      id: 'node-bank-kotak',
      account: '778809XXXX',
      holder: 'Deepak Varma',
      bank: 'Kotak Mahindra Bank',
      bankCode: 'KOTAK',
      ifsc: 'KKBK0000881',
      branch: 'Ahmedabad - SG Highway',
      city: 'Ahmedabad',
      type: 'Layer 2 Mule Account',
      role: 'mule_layer_2',
      color: '#9333EA',
      hop: 2,
      x: 540,
      y: 250,
      sharedInCases: ['CT-3026-002'],
    },
    {
      id: 'node-bank-icici',
      account: '990011XXXX',
      holder: 'Vikram Choudhary',
      bank: 'ICICI Bank Ltd',
      bankCode: 'ICICI',
      ifsc: 'ICIC0002901',
      branch: 'Mumbai - Andheri',
      city: 'Mumbai',
      type: 'Layer 2 Mule Account',
      role: 'mule_layer_2',
      color: '#9333EA',
      hop: 2,
      x: 540,
      y: 390,
      sharedInCases: ['CT-3056-003'],
    },
  ],
  terminals: [
    {
      id: 'node-atm-satellite',
      account: 'ATM #GJ-01-992',
      holder: 'SBI ATM Terminal - Satellite Road',
      bank: 'SBI ATM Outlet',
      bankCode: 'ATM',
      ifsc: 'N/A',
      branch: 'Satellite Road Corridor',
      city: 'Ahmedabad',
      type: 'Cash-Out ATM Terminal',
      role: 'atm_cashout',
      color: '#E11D48',
      hop: 3,
      x: 760,
      y: 130,
    },
    {
      id: 'node-atm-vastrapur',
      account: 'ATM #GJ-01-441',
      holder: 'HDFC ATM Terminal - Vastrapur Lake',
      bank: 'HDFC ATM Outlet',
      bankCode: 'ATM',
      ifsc: 'N/A',
      branch: 'Vastrapur Corridor',
      city: 'Ahmedabad',
      type: 'Forecast Cash-Out Target',
      role: 'atm_cashout',
      color: '#E11D48',
      hop: 3,
      x: 760,
      y: 260,
    },
    {
      id: 'node-crypto-escrow',
      account: 'WALLET #USDT-889',
      holder: 'Binance P2P Merchant Escrow',
      bank: 'Crypto Exchange Escrow',
      bankCode: 'CRYPTO',
      ifsc: 'N/A',
      branch: 'Offshore P2P Gateway',
      city: 'Offshore',
      type: 'Crypto Exfiltration Node',
      role: 'crypto_node',
      color: '#10B981',
      hop: 3,
      x: 760,
      y: 400,
    },
  ],
};

export default function TransactionNetwork() {
  const navigate = useNavigate();

  // Persistent Victims List State (loaded from localStorage or ALL_VICTIMS default)
  const [victimsList, setVictimList] = useState(() => {
    try {
      const saved = localStorage.getItem('cybertrace_victims');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading saved victims:', e);
    }
    return ALL_VICTIMS;
  });

  // Victim Search and Add Modal State
  const [victimSearch, setVictimSearch] = useState('');
  const [showAddVictimModal, setShowAddVictimModal] = useState(false);
  const [victimToast, setVictimToast] = useState(null);

  // Helper to generate sequential case IDs
  const generateNextCaseId = useCallback(() => {
    const year = new Date().getFullYear();
    const count = (victimsList ? victimsList.length : ALL_VICTIMS.length) + 1;
    return `CT-${year}-${String(count).padStart(3, '0')}`;
  }, [victimsList]);

  // Add Victim Form State
  const initialVictimForm = {
    name: '',
    caseId: '',
    lossNum: '',
    fraudType: 'Investment Scam',
    bank: 'State Bank of India',
    bankCode: 'SBI',
    account: '',
    ifsc: 'SBIN0001824',
    city: 'Ahmedabad',
    time: 'Today, 11:30 AM',
    targetScammer: 'node-scammer-1',
    transferMode: 'UPI QR Phish',
  };
  const [newVictimForm, setNewVictimForm] = useState(initialVictimForm);

  // Single Victim Selection State (officer selects one victim at a time)
  const [selectedVictimId, setSelectedVictimId] = useState('victim-1');
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  // Dynamic Flow Simulation Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0); // 0: All, 1: Victims->Scammers, 2: Scammers->Banks, 3: Banks->ATMs
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Search, Zoom & Action State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHopFilter, setSelectedHopFilter] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [freezeSuccess, setFreezeSuccess] = useState(false);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const graphContainerRef = useRef(null);

  // Dragging state (node drag)
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  // Canvas panning state (drag background to move view)
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Compute Active Victim (single selection from dynamic victimsList)
  const activeVictims = useMemo(() => {
    const found = victimsList.find((v) => v.id === selectedVictimId);
    return found ? [found] : (victimsList[0] ? [victimsList[0]] : []);
  }, [victimsList, selectedVictimId]);

  // Filtered Victims for the Victim Selection section
  const filteredVictims = useMemo(() => {
    const query = victimSearch.trim().toLowerCase();
    if (!query) return victimsList;
    return victimsList.filter((v) => {
      return (
        (v.name && v.name.toLowerCase().includes(query)) ||
        (v.caseId && v.caseId.toLowerCase().includes(query)) ||
        (v.bank && v.bank.toLowerCase().includes(query)) ||
        (v.bankCode && v.bankCode.toLowerCase().includes(query)) ||
        (v.fraudType && v.fraudType.toLowerCase().includes(query)) ||
        (v.city && v.city.toLowerCase().includes(query)) ||
        (v.account && v.account.toLowerCase().includes(query)) ||
        (v.loss && v.loss.toLowerCase().includes(query))
      );
    });
  }, [victimsList, victimSearch]);

  // Total Combined Loss
  const totalCombinedLossNum = useMemo(() => {
    return activeVictims.reduce((sum, v) => sum + v.lossNum, 0);
  }, [activeVictims]);

  const totalCombinedLossFormatted = useMemo(() => {
    return `₹${totalCombinedLossNum.toLocaleString('en-IN')}`;
  }, [totalCombinedLossNum]);

  // Bank code auto-derivation
  const deriveBankCode = (bankName) => {
    if (!bankName) return 'BANK';
    const b = bankName.toLowerCase();
    if (b.includes('sbi') || b.includes('state bank')) return 'SBI';
    if (b.includes('hdfc')) return 'HDFC';
    if (b.includes('icici')) return 'ICICI';
    if (b.includes('axis')) return 'AXIS';
    if (b.includes('kotak')) return 'KOTAK';
    if (b.includes('punjab') || b.includes('pnb')) return 'PNB';
    if (b.includes('baroda') || b.includes('bob')) return 'BOB';
    if (b.includes('canara')) return 'CANARA';
    if (b.includes('paytm')) return 'PAYTM';
    return bankName.trim().slice(0, 5).toUpperCase();
  };

  // Open modal with initial preset or query
  const handleOpenAddModal = (presetName = '') => {
    setNewVictimForm({
      ...initialVictimForm,
      name: presetName || '',
      caseId: generateNextCaseId(),
    });
    setShowAddVictimModal(true);
  };

  // Preset templates for quick addition and demo
  const sampleVictimPresets = [
    {
      label: 'Digital Arrest / CBI Impersonation',
      badge: '₹14.5L Loss',
      data: {
        name: 'Suresh Chandra Mehta',
        lossNum: 1450000,
        fraudType: 'Digital Arrest / Impersonation',
        bank: 'Punjab National Bank',
        bankCode: 'PNB',
        account: '552199XXXX',
        ifsc: 'PUNB0123900',
        city: 'Delhi',
        time: 'Today, 11:45 AM',
        targetScammer: 'node-scammer-1',
        transferMode: 'RTGS High-Value Transfer',
      },
    },
    {
      label: 'Telegram Task / Crypto Scam',
      badge: '₹6.2L Loss',
      data: {
        name: 'Neha Singhania',
        lossNum: 620000,
        fraudType: 'Task / Part-Time Job Scam',
        bank: 'ICICI Bank Ltd',
        bankCode: 'ICICI',
        account: '998822XXXX',
        ifsc: 'ICIC0004921',
        city: 'Bengaluru',
        time: 'Today, 02:15 PM',
        targetScammer: 'node-scammer-2',
        transferMode: 'UPI Link Scam',
      },
    },
    {
      label: 'Fake Stock Trading / AI IPO',
      badge: '₹9.8L Loss',
      data: {
        name: 'Deepak Agrawal',
        lossNum: 980000,
        fraudType: 'Investment Scam',
        bank: 'Axis Bank Ltd',
        bankCode: 'AXIS',
        account: '334455XXXX',
        ifsc: 'UTIB0001890',
        city: 'Pune',
        time: 'Today, 09:10 AM',
        targetScammer: 'node-scammer-1',
        transferMode: 'IMPS Fraud Transfer',
      },
    },
  ];

  // Submit Handler for Add Victim Form
  const handleAddVictimSubmit = (e) => {
    e.preventDefault();
    if (!newVictimForm.name.trim()) return;

    const rawNum = typeof newVictimForm.lossNum === 'number'
      ? newVictimForm.lossNum
      : Number(String(newVictimForm.lossNum).replace(/[^0-9]/g, '')) || 350000;

    const formattedLoss = `₹${rawNum.toLocaleString('en-IN')}`;
    const newId = `victim-${Date.now()}`;
    const caseId = newVictimForm.caseId.trim() || generateNextCaseId();
    const bankCode = newVictimForm.bankCode?.trim() || deriveBankCode(newVictimForm.bank);

    const victimToAdd = {
      id: newId,
      name: newVictimForm.name.trim(),
      caseId: caseId,
      loss: formattedLoss,
      lossNum: rawNum,
      fraudType: newVictimForm.fraudType || 'Cyber Financial Fraud',
      bank: newVictimForm.bank || 'State Bank of India',
      bankCode: bankCode,
      account: newVictimForm.account.trim() || `${Math.floor(1000 + Math.random() * 9000)}99XXXX`,
      ifsc: newVictimForm.ifsc.trim() || 'SBIN0001090',
      city: newVictimForm.city.trim() || 'Ahmedabad',
      time: newVictimForm.time || 'Today, 11:30 AM',
      color: '#2563EB',
      targetScammer: newVictimForm.targetScammer || 'node-scammer-1',
      transferMode: newVictimForm.transferMode || 'UPI Instant Transfer',
      isCustom: true,
    };

    const updated = [victimToAdd, ...victimsList];
    setVictimList(updated);
    try {
      localStorage.setItem('cybertrace_victims', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setSelectedVictimId(newId);
    setShowAddVictimModal(false);

    setVictimToast({
      title: 'Victim Registered',
      message: `${victimToAdd.name} (${victimToAdd.caseId}) registered. Tracing transaction flow...`,
    });
    setTimeout(() => setVictimToast(null), 5000);
  };

  // Delete a custom-added victim
  const handleDeleteVictim = (e, victimId) => {
    e.stopPropagation();
    const updated = victimsList.filter((v) => v.id !== victimId);
    setVictimList(updated);
    try {
      localStorage.setItem('cybertrace_victims', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    if (selectedVictimId === victimId) {
      setSelectedVictimId(updated[0]?.id || null);
    }
  };

  // Reset to default 5 victims
  const handleResetVictims = () => {
    setVictimList(ALL_VICTIMS);
    try {
      localStorage.removeItem('cybertrace_victims');
    } catch (err) {
      console.error(err);
    }
    setSelectedVictimId(ALL_VICTIMS[0].id);
    setVictimSearch('');
  };

  // Fullscreen toggle handler
  const toggleFullscreen = useCallback(() => {
    if (!isFullscreen) {
      const el = graphContainerRef.current;
      if (el) {
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  }, [isFullscreen]);

  // Listen for fullscreen change events (ESC key, etc.)
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  // ——— LAYOUT CONSTANTS ———
  const CANVAS_W = 960;
  const CANVAS_H = 600;
  const COL_X = [100, 340, 580, 820]; // Victims | Scammers | Banks | Terminals
  const PAD_TOP = 70;
  const PAD_BOT = 50;

  // Mapping: scammer → downstream banks & terminals
  const SCAMMER_DOWNSTREAM = {
    'node-scammer-1': {
      banks: ['node-bank-axis', 'node-bank-kotak'],
      splits: [0.5, 0.5],
    },
    'node-scammer-2': {
      banks: ['node-bank-icici'],
      splits: [1.0],
    },
  };

  const BANK_DOWNSTREAM = {
    'node-bank-axis': { terminal: 'node-atm-satellite', split: 1.0 },
    'node-bank-kotak': { terminal: 'node-atm-vastrapur', split: 1.0 },
    'node-bank-icici': { terminal: 'node-crypto-escrow', split: 1.0 },
  };

  // Helper: evenly space N items vertically within canvas
  const layoutColumn = (count) => {
    if (count === 0) return [];
    const usable = CANVAS_H - PAD_TOP - PAD_BOT;
    if (count === 1) return [CANVAS_H / 2];
    const gap = usable / (count - 1);
    return Array.from({ length: count }, (_, i) => PAD_TOP + i * gap);
  };

  // Dynamically Generate Graph when Selected Victims Change
  useEffect(() => {
    if (activeVictims.length === 0) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      return;
    }

    // ——— STEP 1: Determine which scammers are active ———
    const scammer1Victims = activeVictims.filter((v) => v.targetScammer === 'node-scammer-1');
    const scammer2Victims = activeVictims.filter((v) => v.targetScammer === 'node-scammer-2');
    const scammer1Inflow = scammer1Victims.reduce((sum, v) => sum + v.lossNum, 0);
    const scammer2Inflow = scammer2Victims.reduce((sum, v) => sum + v.lossNum, 0);

    const activeScammerIds = [];
    const scammerInflowMap = {};
    if (scammer1Victims.length > 0) {
      activeScammerIds.push('node-scammer-1');
      scammerInflowMap['node-scammer-1'] = scammer1Inflow;
    }
    if (scammer2Victims.length > 0) {
      activeScammerIds.push('node-scammer-2');
      scammerInflowMap['node-scammer-2'] = scammer2Inflow;
    }

    // ——— STEP 2: Determine reachable banks (only those connected to active scammers) ———
    const activeBankIds = [];
    const bankInflowMap = {};
    activeScammerIds.forEach((sid) => {
      const down = SCAMMER_DOWNSTREAM[sid];
      if (!down) return;
      down.banks.forEach((bankId, idx) => {
        if (!activeBankIds.includes(bankId)) {
          activeBankIds.push(bankId);
          bankInflowMap[bankId] = 0;
        }
        bankInflowMap[bankId] += scammerInflowMap[sid] * (down.splits[idx] || 0) * 0.95;
      });
    });

    // ——— STEP 3: Determine reachable terminals (only those connected to active banks) ———
    const activeTerminalIds = [];
    const terminalInflowMap = {};
    activeBankIds.forEach((bid) => {
      const down = BANK_DOWNSTREAM[bid];
      if (!down) return;
      if (!activeTerminalIds.includes(down.terminal)) {
        activeTerminalIds.push(down.terminal);
        terminalInflowMap[down.terminal] = 0;
      }
      terminalInflowMap[down.terminal] += bankInflowMap[bid] * down.split * 0.95;
    });

    // ——— STEP 4: Layout positions per column ———
    const victimYs = layoutColumn(activeVictims.length);
    const scammerYs = layoutColumn(activeScammerIds.length);
    const bankYs = layoutColumn(activeBankIds.length);
    const terminalYs = layoutColumn(activeTerminalIds.length);

    // ——— STEP 5: Generate victim nodes ———
    const generatedVictimNodes = activeVictims.map((v, idx) => ({
      id: `node-${v.id}`,
      victimRefId: v.id,
      account: v.account,
      holder: `${v.name} (Victim)`,
      bank: v.bank,
      bankCode: v.bankCode,
      ifsc: v.ifsc,
      city: v.city,
      type: 'Victim Account',
      role: 'victim',
      color: '#2563EB',
      amount: `-${v.loss}`,
      inflow: '₹0',
      outflow: v.loss,
      balance: '₹8,500',
      risk: 'Victim Debit',
      riskLevel: 'LOW',
      hop: 0,
      x: COL_X[0],
      y: victimYs[idx],
      caseId: v.caseId,
      fraudType: v.fraudType,
    }));

    // ——— STEP 6: Generate scammer nodes ———
    const generatedScammerNodes = activeScammerIds.map((sid, idx) => {
      const infra = SYNDICATE_INFRASTRUCTURE.scammers.find((s) => s.id === sid);
      const inflow = scammerInflowMap[sid];
      return {
        ...infra,
        x: COL_X[1],
        y: scammerYs[idx],
        amount: `₹${inflow.toLocaleString('en-IN')}`,
        inflow: `₹${inflow.toLocaleString('en-IN')}`,
        outflow: `₹${Math.round(inflow * 0.95).toLocaleString('en-IN')}`,
        balance: `₹${Math.round(inflow * 0.05).toLocaleString('en-IN')}`,
        risk: infra.id === 'node-scammer-1' ? 'Critical Scammer' : 'Digital Mule Escrow',
        riskLevel: infra.id === 'node-scammer-1' ? 'CRITICAL' : 'HIGH',
      };
    });

    // ——— STEP 7: Generate bank nodes ———
    const generatedMuleBanks = activeBankIds.map((bid, idx) => {
      const infra = SYNDICATE_INFRASTRUCTURE.muleBanks.find((b) => b.id === bid);
      const inflow = Math.round(bankInflowMap[bid]);
      return {
        ...infra,
        x: COL_X[2],
        y: bankYs[idx],
        amount: `₹${inflow.toLocaleString('en-IN')}`,
        inflow: `₹${inflow.toLocaleString('en-IN')}`,
        outflow: `₹${inflow.toLocaleString('en-IN')}`,
        balance: bid === 'node-bank-kotak' ? `₹${Math.round(inflow * 0.3).toLocaleString('en-IN')}` : '₹0',
        risk: bid === 'node-bank-kotak' ? 'Active Balance Target' : 'Critical Layering',
        riskLevel: 'CRITICAL',
      };
    });

    // ——— STEP 8: Generate terminal nodes ———
    const generatedTerminals = activeTerminalIds.map((tid, idx) => {
      const infra = SYNDICATE_INFRASTRUCTURE.terminals.find((t) => t.id === tid);
      const inflow = Math.round(terminalInflowMap[tid]);
      const isCrypto = tid === 'node-crypto-escrow';
      const isForecasted = tid === 'node-atm-vastrapur';
      return {
        ...infra,
        x: COL_X[3],
        y: terminalYs[idx],
        amount: `₹${inflow.toLocaleString('en-IN')}`,
        inflow: `₹${inflow.toLocaleString('en-IN')}`,
        outflow: isCrypto ? 'USDT Converted' : isForecasted ? 'Forecast Lead' : 'Cash Dispensed',
        balance: isForecasted ? `₹${inflow.toLocaleString('en-IN')}` : '₹0',
        risk: isCrypto ? 'Crypto Escrow' : isForecasted ? 'Active Intercept Window' : 'Withdrawn',
        riskLevel: 'TERMINAL',
      };
    });

    const allGeneratedNodes = [
      ...generatedVictimNodes,
      ...generatedScammerNodes,
      ...generatedMuleBanks,
      ...generatedTerminals,
    ];

    // ——— STEP 9: Generate edges (only between reachable connected nodes) ———
    const generatedEdges = [];

    // Hop 1: Victim → Scammer (only for active victims → active scammers)
    activeVictims.forEach((v) => {
      if (activeScammerIds.includes(v.targetScammer)) {
        generatedEdges.push({
          id: `edge-${v.id}-${v.targetScammer}`,
          source: `node-${v.id}`,
          target: v.targetScammer,
          amount: v.loss,
          mode: v.transferMode,
          latency: '3 min',
          time: v.time,
          hop: 1,
          color: '#EA580C',
        });
      }
    });

    // Hop 2: Scammer → Bank (only for active scammers → reachable banks)
    activeScammerIds.forEach((sid) => {
      const down = SCAMMER_DOWNSTREAM[sid];
      if (!down) return;
      const inflow = scammerInflowMap[sid];
      down.banks.forEach((bankId, idx) => {
        if (activeBankIds.includes(bankId)) {
          const shareAmt = Math.round(inflow * 0.95 * (down.splits[idx] || 0));
          generatedEdges.push({
            id: `edge-${sid}-${bankId}`,
            source: sid,
            target: bankId,
            amount: `₹${shareAmt.toLocaleString('en-IN')}`,
            mode: idx === 0 ? 'IMPS Split' : 'NEFT Split',
            latency: `${6 + idx * 2} min`,
            time: `10:${24 + idx * 3} AM`,
            hop: 2,
            color: '#9333EA',
          });
        }
      });
    });

    // Hop 3: Bank → Terminal (only for active banks → reachable terminals)
    activeBankIds.forEach((bid) => {
      const down = BANK_DOWNSTREAM[bid];
      if (!down || !activeTerminalIds.includes(down.terminal)) return;
      const bankInflow = Math.round(bankInflowMap[bid]);
      const isCrypto = down.terminal === 'node-crypto-escrow';
      const isForecasted = down.terminal === 'node-atm-vastrapur';
      generatedEdges.push({
        id: `edge-${bid}-${down.terminal}`,
        source: bid,
        target: down.terminal,
        amount: `₹${Math.round(bankInflow * 0.95).toLocaleString('en-IN')}`,
        mode: isCrypto ? 'P2P Escrow Buy' : 'ATM Cash Withdrawal',
        latency: isCrypto ? '18 min' : isForecasted ? 'Forecast Window' : '22 min',
        time: isCrypto ? '10:38 AM' : isForecasted ? '11:00 AM - 1:00 PM' : '10:45 AM',
        hop: 3,
        color: isCrypto ? '#10B981' : '#E11D48',
        isWithdrawn: !isCrypto && !isForecasted,
        isPending: isForecasted,
      });
    });

    setNodes(allGeneratedNodes);
    setEdges(generatedEdges);
    setSelectedNode(allGeneratedNodes[0] || null);
    setSelectedEdge(null);
  }, [selectedVictimId, activeVictims, totalCombinedLossNum]);

  // Simulation player loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setSimulationStep((prev) => {
        if (prev >= 3) {
          setIsPlaying(false);
          return 3;
        }
        return prev + 1;
      });
    }, 2000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  // ——— Node drag handlers ———
  const handleNodeMouseDown = (nodeId, e) => {
    e.stopPropagation();
    setDraggedNodeId(nodeId);
    const svgRect = svgRef.current.getBoundingClientRect();
    const node = nodes.find((n) => n.id === nodeId);
    if (node) {
      const mouseX = ((e.clientX - svgRect.left) / svgRect.width) * CANVAS_W;
      const mouseY = ((e.clientY - svgRect.top) / svgRect.height) * CANVAS_H;
      setDragOffset({ x: mouseX - node.x, y: mouseY - node.y });
    }
  };

  // ——— Canvas pan: start on SVG background mousedown ———
  const handleCanvasPanStart = (e) => {
    // Only pan if clicking empty background (not on a node)
    if (e.target === svgRef.current || e.target.tagName === 'line' || e.target.tagName === 'rect') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  // ——— Unified mouse move: node drag OR canvas pan ———
  const handleMouseMove = (e) => {
    // Node dragging
    if (draggedNodeId && svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - svgRect.left) / svgRect.width) * CANVAS_W;
      const mouseY = ((e.clientY - svgRect.top) / svgRect.height) * CANVAS_H;
      setNodes((prev) =>
        prev.map((n) =>
          n.id === draggedNodeId
            ? {
                ...n,
                x: Math.max(40, Math.min(CANVAS_W - 40, mouseX - dragOffset.x)),
                y: Math.max(40, Math.min(CANVAS_H - 40, mouseY - dragOffset.y)),
              }
            : n
        )
      );
      return;
    }

    // Canvas panning
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDraggedNodeId(null);
    setIsPanning(false);
  };

  // ——— Touch gestures for mobile & tablet ———
  const handleNodeTouchStart = (nodeId, e) => {
    e.stopPropagation();
    if (e.touches && e.touches[0]) {
      setDraggedNodeId(nodeId);
      const touch = e.touches[0];
      const svgRect = svgRef.current?.getBoundingClientRect();
      const node = nodes.find((n) => n.id === nodeId);
      if (node && svgRect) {
        const touchX = ((touch.clientX - svgRect.left) / svgRect.width) * CANVAS_W;
        const touchY = ((touch.clientY - svgRect.top) / svgRect.height) * CANVAS_H;
        setDragOffset({ x: touchX - node.x, y: touchY - node.y });
      }
    }
  };

  const handleCanvasTouchStart = (e) => {
    if (e.touches && e.touches[0] && (e.target === svgRef.current || e.target.tagName === 'line' || e.target.tagName === 'rect')) {
      const touch = e.touches[0];
      setIsPanning(true);
      setPanStart({ x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y });
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      if (draggedNodeId && svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const touchX = ((touch.clientX - svgRect.left) / svgRect.width) * CANVAS_W;
        const touchY = ((touch.clientY - svgRect.top) / svgRect.height) * CANVAS_H;
        setNodes((prev) =>
          prev.map((n) =>
            n.id === draggedNodeId
              ? {
                  ...n,
                  x: Math.max(40, Math.min(CANVAS_W - 40, touchX - dragOffset.x)),
                  y: Math.max(40, Math.min(CANVAS_H - 40, touchY - dragOffset.y)),
                }
              : n
          )
        );
        return;
      }
      if (isPanning) {
        setPanOffset({
          x: touch.clientX - panStart.x,
          y: touch.clientY - panStart.y,
        });
      }
    }
  };

  const handleTouchEnd = () => {
    setDraggedNodeId(null);
    setIsPanning(false);
  };

  // ——— Mouse wheel zoom on canvas ———
  const handleWheelZoom = useCallback((e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoomLevel((z) => Math.max(0.4, Math.min(2.5, z + delta)));
  }, []);

  // ——— Reset pan + zoom ———
  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Select a single victim (radio-style)
  const handleSelectVictim = (victimId) => {
    setSelectedVictimId(victimId);
  };

  // Filtered nodes and edges based on search & simulation
  const filteredNodes = nodes.filter((node) => {
    const matchesSearch =
      !searchTerm ||
      node.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.holder.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesHop =
      selectedHopFilter === 'all' || node.hop.toString() === selectedHopFilter;

    const matchesStep =
      simulationStep === 0 || node.hop <= simulationStep;

    return matchesSearch && matchesHop && matchesStep;
  });

  const filteredNodeIds = new Set(filteredNodes.map((n) => n.id));

  const filteredEdges = edges.filter((edge) => {
    const bothNodesVisible =
      filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target);
    const matchesStep =
      simulationStep === 0 || edge.hop <= simulationStep;
    return bothNodesVisible && matchesStep;
  });

  const handleFreezeAccount = () => {
    setFreezeSuccess(true);
    setTimeout(() => setFreezeSuccess(false), 3500);
  };

  const handleExportDossier = () => {
    const content = `CYBERTRACE AI — MULTI-VICTIM SYNDICATE MONEY TRAIL REPORT
========================================================================
Total Selected Victims: ${activeVictims.length} Complainants
Total Combined Loss Velocity: ${totalCombinedLossFormatted}
Report Generated: ${new Date().toLocaleString('en-IN')}

1. SELECTED VICTIM COMPLAINTS INVOLVED IN SYNDICATE:
------------------------------------------------------------------------
${activeVictims
  .map(
    (v, i) =>
      `${i + 1}. [${v.caseId}] ${v.name} | Loss: ${v.loss} | Bank: ${v.bank} (${v.city}) | Mode: ${v.transferMode}`
  )
  .join('\n')}

2. CONVERGED SCAMMER INTERCEPT HUBS (HOP 1):
------------------------------------------------------------------------
${nodes
  .filter((n) => n.hop === 1)
  .map((n) => `• ${n.holder} | ${n.bank} (${n.account}) | Total Inflow: ${n.inflow} | Risk: ${n.risk}`)
  .join('\n')}

3. LAYERED MULE BANKS & ATM OUTLETS (HOP 2 & 3):
------------------------------------------------------------------------
${nodes
  .filter((n) => n.hop >= 2)
  .map((n) => `• [Hop ${n.hop}] ${n.bank} (${n.account}) | ${n.holder} | Flow: ${n.amount} | Status: ${n.risk}`)
  .join('\n')}
========================================================================
Certified by CyberTrace AI Multi-Hop Graph Analysis Engine.`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Multi_Victim_Syndicate_Report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="space-y-4 max-w-[1720px] mx-auto px-2.5 sm:px-4 md:px-6 pb-16 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. Top Header Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
            <GitFork className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight text-slate-900 dark:text-white truncate">
                Syndicate Money Flow Engine
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-[10px] font-bold font-mono flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {activeVictims.length > 0 ? activeVictims[0].name : 'No Victim'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium truncate sm:whitespace-normal">
              Select a victim below to trace: <strong className="text-slate-700 dark:text-slate-300">Victim ➔ Scammers ➔ Mule Banks ➔ Terminals</strong>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full sm:w-auto shrink-0">
          <button
            onClick={handleExportDossier}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Syndicate Report</span>
          </button>
        </div>
      </div>

      {/* 2. VICTIM SELECTION BOX (With Search Bar and Add Victim) */}
      <div className="bg-white dark:bg-slate-900 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        {/* Header Row: Title, Total Badge & Combined Loss */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <UserCheck className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Select a Victim Complaint to Trace Money Flow
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono shrink-0">
                {victimsList.length} Total
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[11px] font-mono text-slate-400">
              Loss Amount: <strong className="text-blue-600 dark:text-blue-400 text-xs">{totalCombinedLossFormatted}</strong>
            </span>
          </div>
        </div>

        {/* Search Bar & Action Buttons Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5">
          {/* Integrated Search Bar */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={victimSearch}
              onChange={(e) => setVictimSearch(e.target.value)}
              placeholder="Search victim by name, case ID (e.g. CT-3026), bank, crime type, city..."
              className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {victimSearch && (
              <button
                type="button"
                onClick={() => setVictimSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 flex-wrap">
            {victimSearch && (
              <span className="text-[11px] font-mono font-semibold text-slate-400 px-1">
                {filteredVictims.length} of {victimsList.length}
              </span>
            )}

            {/* + Add Victim Button */}
            <button
              type="button"
              onClick={() => handleOpenAddModal(victimSearch)}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow transition cursor-pointer active:scale-95 flex-1 sm:flex-initial"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Victim</span>
            </button>

            {/* Reset to defaults button if modified */}
            {victimsList.length !== ALL_VICTIMS.length && (
              <button
                type="button"
                onClick={handleResetVictims}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Reset to default victims"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Feedback / Registration Toast Banner */}
        {victimToast && (
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs animate-in fade-in slide-in-from-top-1">
            <div className="flex items-center gap-2 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="font-bold">{victimToast.title}: </span>
                <span className="truncate">{victimToast.message}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setVictimToast(null)}
              className="p-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 shrink-0 ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Victim Selection Cards Grid */}
        {filteredVictims.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
            {filteredVictims.map((v) => {
              const isSelected = selectedVictimId === v.id;
              return (
                <div
                  key={v.id}
                  onClick={() => handleSelectVictim(v.id)}
                  className={`relative p-3 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between group min-w-0 ${
                    isSelected
                      ? 'bg-blue-50/90 dark:bg-blue-950/50 border-blue-500 dark:border-blue-600 shadow-md ring-2 ring-blue-400/40 scale-[1.01] sm:scale-[1.02]'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100 hover:border-slate-400 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Radio circle indicator */}
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-400 bg-transparent'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {v.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <span className="font-mono text-[10px] font-bold text-slate-400">{v.caseId}</span>
                      {v.isCustom && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteVictim(e, v.id)}
                          className="opacity-80 sm:opacity-0 sm:group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 transition"
                          title="Remove custom victim"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="my-1.5 min-w-0">
                    <span className="font-mono font-black text-xs text-blue-600 dark:text-blue-400">{v.loss}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{v.fraudType}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-slate-500 min-w-0">
                    <span className="font-semibold truncate max-w-[130px]">{v.bankCode} ({v.city})</span>
                    <span className={`font-bold shrink-0 ml-1 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`}>
                      {isSelected ? '● Selected' : 'Select'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Search Results State */
          <div className="py-7 px-4 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-800/30">
            <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-1.5" />
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              No victim complaints match "{victimSearch}"
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Try searching with another name, bank, case ID, or register this complainant now.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setVictimSearch('')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Clear Search
              </button>
              <button
                type="button"
                onClick={() => handleOpenAddModal(victimSearch)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add "{victimSearch}" as Victim</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Reoriented Flow Tracer & Simulation Bar */}
      <div className="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0 w-full lg:w-auto -mx-1 px-1">
          <span className="text-[11px] font-black uppercase font-mono text-slate-400 dark:text-slate-500 mr-1 shrink-0">
            TRACER:
          </span>

          {[
            { step: 0, label: 'All Hops', icon: Layers },
            { step: 1, label: `1. Victims (${activeVictims.length}) ➔ Scammers`, icon: ArrowUpRight },
            { step: 2, label: '2. Scammers ➔ Layered Banks', icon: GitFork },
            { step: 3, label: '3. Banks ➔ ATMs / Crypto', icon: Zap },
          ].map((st) => {
            const Icon = st.icon;
            const isActive = simulationStep === st.step;
            return (
              <button
                key={st.step}
                onClick={() => {
                  setSimulationStep(st.step);
                  setIsPlaying(false);
                }}
                className={`shrink-0 flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">{st.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full lg:w-auto shrink-0">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer shadow-xs ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause Simulation' : 'Play Live Tracer'}</span>
          </button>

          <button
            onClick={() => setPlaybackSpeed((s) => (s === 1 ? 2 : 1))}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 cursor-pointer shrink-0"
            title="Toggle Playback Speed"
          >
            {playbackSpeed}x Speed
          </button>
        </div>
      </div>

      {/* 4. Top KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {[
          { label: 'Combined Victim Loss', value: totalCombinedLossFormatted, sub: `${activeVictims.length} Selected Complainants`, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Scammer Intercept Inflow', value: totalCombinedLossFormatted, sub: `${nodes.filter((n) => n.hop === 1).length} Primary Hubs`, color: 'text-orange-600 dark:text-orange-400' },
          { label: 'Destination Mule Banks', value: `${nodes.filter((n) => n.hop === 2).length} Banks`, sub: nodes.filter((n) => n.hop === 2).map((n) => n.bankCode).join(', ') || 'None Active', color: 'text-purple-600 dark:text-purple-400' },
          { label: 'ATM & Crypto Outlets', value: `${nodes.filter((n) => n.hop === 3).length} Terminals`, sub: nodes.filter((n) => n.hop === 3).map((n) => n.bankCode).join(', ') || 'None Active', color: 'text-rose-600 dark:text-rose-400' },
          { label: 'Syndicate Pattern', value: 'Jamtara Multi-Hop', sub: '94% Match Confidence', color: 'text-emerald-600 dark:text-emerald-400' },
        ].map((c, i) => (
          <div key={i} className="p-2.5 sm:p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between min-w-0">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono truncate">{c.label}</span>
            <div className={`my-1 font-mono text-sm sm:text-base md:text-lg font-black tracking-tight truncate ${c.color}`}>{c.value}</div>
            <span className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate font-medium">{c.sub}</span>
          </div>
        ))}
      </div>

      {/* 5. Main Workspace: Dynamic Graph Canvas (Left 8) + Forensics Dossier (Right 4) */}
      <div className={`${isFullscreen ? '' : 'grid grid-cols-1 xl:grid-cols-12 gap-4 items-start'}`}>
        {/* Dynamic Graph Canvas — fullscreen capable */}
        <div
          ref={graphContainerRef}
          className={`${
            isFullscreen
              ? 'fixed inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col'
              : 'xl:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col'
          }`}
        >
          {/* Canvas Subheader / Filters */}
          <div className="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 bg-slate-50/80 dark:bg-slate-950/60">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Filter account, person, bank..."
                  className="bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden w-full sm:w-44 md:w-56 shadow-2xs font-medium"
                />
              </div>

              {/* Hop Filter */}
              <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0 overflow-x-auto no-scrollbar">
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">HOP:</span>
                {['all', '0', '1', '2', '3'].map((h) => (
                  <button
                    key={h}
                    onClick={() => setSelectedHopFilter(h)}
                    className={`px-1.5 sm:px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-mono transition cursor-pointer ${
                      selectedHopFilter === h
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {h === 'all' ? 'All' : `L${h}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Hint Badge, Zoom Controls & Fullscreen Toggle */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <span className="text-[10px] text-slate-400 font-medium hidden xl:inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                <Info className="w-3 h-3 text-blue-500" />
                Drag nodes · Pan · Zoom
              </span>

              <div className="flex items-center gap-0.5 sm:gap-1 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5 sm:p-1 shadow-2xs">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.1))}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[9.5px] sm:text-[10px] font-mono font-bold px-0.5 sm:px-1 text-slate-600 dark:text-slate-300">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.1))}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Reset View */}
              <button
                onClick={handleResetView}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer border border-slate-200 dark:border-slate-700"
                title="Reset View (pan & zoom)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-[11px] font-bold shadow-xs transition cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen (ESC)' : 'View Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
              </button>
            </div>
          </div>

          {/* SVG Canvas Area with Dynamic Multi-Victim Drag & Bezier Curves */}
          <div
            className={`relative bg-slate-950/5 dark:bg-slate-950/90 w-full overflow-hidden ${
              isFullscreen ? 'flex-1' : 'h-[380px] sm:h-[480px] md:h-[560px] lg:h-[620px]'
            }`}
          >
            <div
              className="absolute inset-0 opacity-10 dark:opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />

            <svg
              ref={svgRef}
              viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
              className={`w-full h-full select-none ${isPanning ? 'cursor-grabbing' : draggedNodeId ? 'cursor-move' : 'cursor-grab'}`}
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transformOrigin: 'center center',
                transition: isPanning || draggedNodeId ? 'none' : 'transform 0.15s ease-out',
              }}
              xmlns="http://www.w3.org/2000/svg"
              onMouseDown={handleCanvasPanStart}
              onTouchStart={handleCanvasTouchStart}
              onWheel={handleWheelZoom}
            >
              <defs>
                <marker id="marker-orange" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#EA580C" />
                </marker>
                <marker id="marker-purple" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#9333EA" />
                </marker>
                <marker id="marker-red" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#E11D48" />
                </marker>
                <marker id="marker-green" viewBox="0 0 10 10" refX="28" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#10B981" />
                </marker>

                <filter id="nodeCardShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000000" floodOpacity="0.3" />
                </filter>

                <filter id="glowOrange" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Dynamic Column Guides — using auto COL_X positions */}
              <g opacity="0.25">
                {[
                  { x: COL_X[0], label: `VICTIMS (${activeVictims.length})` },
                  { x: COL_X[1], label: 'SCAMMER HUBS' },
                  { x: COL_X[2], label: 'LAYERED BANKS' },
                  { x: COL_X[3], label: 'CASHOUT / CRYPTO' },
                ].map((col, idx) => (
                  <g key={idx}>
                    <line x1={col.x} y1="30" x2={col.x} y2={CANVAS_H - 20} stroke="#94A3B8" strokeDasharray="4 4" strokeWidth="1" />
                    <text x={col.x} y="24" textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="bold" fontFamily="monospace">
                      {col.label}
                    </text>
                  </g>
                ))}
              </g>

              {/* Dynamic Transaction Edge Links — CURVED BEZIER PATHS */}
              {filteredEdges.map((edge) => {
                const srcNode = nodes.find((n) => n.id === edge.source);
                const dstNode = nodes.find((n) => n.id === edge.target);
                if (!srcNode || !dstNode) return null;

                const isSelected =
                  selectedEdge?.id === edge.id ||
                  selectedNode?.id === edge.source ||
                  selectedNode?.id === edge.target;

                const markerType =
                  edge.color === '#EA580C'
                    ? 'orange'
                    : edge.color === '#9333EA'
                    ? 'purple'
                    : edge.color === '#10B981'
                    ? 'green'
                    : 'red';

                // Bezier control points: smooth horizontal curve from source to target
                const dx = dstNode.x - srcNode.x;
                const cp1x = srcNode.x + dx * 0.4;
                const cp2x = srcNode.x + dx * 0.6;
                const pathD = `M ${srcNode.x} ${srcNode.y} C ${cp1x} ${srcNode.y}, ${cp2x} ${dstNode.y}, ${dstNode.x} ${dstNode.y}`;

                // Badge position: midpoint of Bezier approximation
                const badgeX = (srcNode.x + dstNode.x) / 2;
                const badgeY = (srcNode.y + dstNode.y) / 2 - 12;

                const pathId = `flow-path-${edge.id}`;

                return (
                  <g key={edge.id} className="cursor-pointer" onClick={() => setSelectedEdge(edge)}>
                    {/* Glow under selected edges */}
                    {isSelected && (
                      <path
                        d={pathD}
                        fill="none"
                        stroke={edge.color}
                        strokeWidth="10"
                        opacity="0.2"
                        strokeLinecap="round"
                      />
                    )}

                    {/* Main curved path */}
                    <path
                      id={pathId}
                      d={pathD}
                      fill="none"
                      stroke={edge.color}
                      strokeWidth={isSelected ? '3' : '2'}
                      strokeDasharray={edge.isPending ? '8 5' : 'none'}
                      markerEnd={`url(#marker-${markerType})`}
                      opacity={isSelected ? '1' : '0.75'}
                      strokeLinecap="round"
                    />

                    {/* Animated flow pulse traveling along the curve */}
                    <circle r="4" fill={edge.color} opacity="0.9">
                      <animateMotion
                        dur={`${2.5 + Math.random() * 1.5}s`}
                        repeatCount="indefinite"
                        path={pathD}
                      />
                    </circle>
                    <circle r="2" fill="#FFFFFF" opacity="0.8">
                      <animateMotion
                        dur={`${2.5 + Math.random() * 1.5}s`}
                        repeatCount="indefinite"
                        path={pathD}
                      />
                    </circle>

                    {/* Transfer Amount Badge */}
                    <g transform={`translate(${badgeX}, ${badgeY})`}>
                      <rect
                        x="-38"
                        y="-10"
                        width="76"
                        height="20"
                        rx="6"
                        fill="#0F172A"
                        stroke={edge.color}
                        strokeWidth="1.5"
                        opacity="0.92"
                      />
                      <text x="0" y="3" textAnchor="middle" fill="#FFFFFF" fontSize="8.5" fontWeight="bold" fontFamily="monospace">
                        {edge.amount}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Draggable Entity Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const isVictim = node.role === 'victim';
                const isScammer = node.role === 'scammer';
                const isTerminal = node.role === 'atm_cashout' || node.role === 'crypto_node';

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-move group"
                    onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                    onTouchStart={(e) => handleNodeTouchStart(node.id, e)}
                    onClick={() => {
                      setSelectedNode(node);
                      setSelectedEdge(null);
                    }}
                    filter="url(#nodeCardShadow)"
                  >
                    {isSelected && (
                      <circle
                        r={isVictim ? '32' : isScammer ? '36' : '30'}
                        fill="none"
                        stroke={node.color}
                        strokeWidth="3"
                        strokeDasharray="4 3"
                        className="animate-spin [animation-duration:8s]"
                      />
                    )}

                    {isTerminal && (
                      <circle r="34" fill="#E11D48" opacity="0.25" className="animate-pulse" />
                    )}

                    {isScammer && (
                      <circle r="38" fill="#EA580C" opacity="0.2" className="animate-ping [animation-duration:3s]" />
                    )}

                    {/* Node Circle */}
                    <circle
                      r={isVictim ? '24' : isScammer ? '28' : '22'}
                      fill={node.color}
                      stroke="#FFFFFF"
                      strokeWidth={isSelected ? '3' : '2'}
                      className="group-hover:scale-105 transition-transform"
                    />

                    {/* Bank Code */}
                    <text
                      y="-3"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize={isVictim ? '8.5' : isScammer ? '9.5' : '8'}
                      fontWeight="black"
                      fontFamily="monospace"
                    >
                      {node.bankCode}
                    </text>
                    <text
                      y="8"
                      textAnchor="middle"
                      fill="#F1F5F9"
                      fontSize="7"
                      fontWeight="bold"
                    >
                      {node.account.slice(0, 6)}
                    </text>

                    {/* External Name Tag */}
                    <g transform={`translate(0, ${isVictim ? 38 : isScammer ? 42 : 34})`}>
                      <rect
                        x="-44"
                        y="-7"
                        width="88"
                        height="15"
                        rx="4"
                        fill="#0F172A"
                        opacity="0.85"
                      />
                      <text x="0" y="3" textAnchor="middle" fill="#E2E8F0" fontSize="7.5" fontWeight="bold">
                        {node.holder.split(' ')[0]} ({node.city})
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Floating Legend Bar */}
            <div
              onMouseDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
              className="absolute bottom-1.5 sm:bottom-3 left-1.5 sm:left-3 right-1.5 sm:right-3 flex items-center justify-between gap-2 p-1.5 sm:p-2.5 rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-[9.5px] sm:text-xs shadow-md overflow-x-auto no-scrollbar pointer-events-auto"
            >
              <div className="flex items-center gap-2 sm:gap-3 font-semibold shrink-0">
                <span className="font-extrabold text-slate-800 dark:text-slate-200">Role:</span>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600" /><span>Victims ({activeVictims.length})</span></div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-600" /><span>Scammer Hubs</span></div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-600" /><span>Mule Banks</span></div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" /><span>Cash-Out Targets</span></div>
                <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600" /><span>Crypto P2P</span></div>
              </div>
              <div className="font-mono text-[10px] text-slate-400 font-bold hidden xl:block shrink-0">
                Drag nodes to inspect topology
              </div>
            </div>
          </div>
        </div>

        {/* Right Forensic Dossier Panel */}
        <div className="xl:col-span-4 space-y-4">
          {selectedNode ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs">
              <div className="pb-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs" style={{ backgroundColor: selectedNode.color }}>
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      {selectedNode.type}
                    </h3>
                    <p className="text-[10.5px] text-slate-400 font-mono font-bold">{selectedNode.account}</p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                    selectedNode.riskLevel === 'CRITICAL'
                      ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-900'
                      : selectedNode.riskLevel === 'HIGH'
                      ? 'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-900'
                      : 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-900'
                  }`}
                >
                  {selectedNode.risk}
                </span>
              </div>

              {/* Cross-Complaint Link Alert */}
              {selectedNode.sharedInCases && selectedNode.sharedInCases.length > 0 && (
                <div className="mt-3.5 p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 text-xs">
                  <div className="flex items-center gap-1.5 font-bold mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    Multi-Victim Syndicate Node
                  </div>
                  <p className="text-[11px] leading-relaxed text-purple-800/90 dark:text-purple-300">
                    This account is shared across <strong>{selectedNode.sharedInCases.join(', ')}</strong>, absorbing money from multiple victim complaints simultaneously.
                  </p>
                </div>
              )}

              {/* Dossier Facts */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs mt-3">
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Account Holder:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{selectedNode.holder}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Nodal Bank:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedNode.bank}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">IFSC / Branch:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{selectedNode.ifsc} ({selectedNode.city})</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Flow Velocity:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white font-mono">{selectedNode.amount}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Active Balance Remaining:</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">{selectedNode.balance}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row xl:flex-col gap-2">
                {freezeSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 animate-in fade-in w-full">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Section 102 CrPC Debit Freeze Requisition Dispatched!</span>
                  </div>
                ) : (
                  <button
                    onClick={handleFreezeAccount}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>Issue Immediate Debit Freeze (Sec 102)</span>
                  </button>
                )}

                <button
                  onClick={() => navigate('/map')}
                  className="w-full py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span>Locate ATMs on Intelligence Map</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-400">
              <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-semibold">Select any node on the graph to inspect forensic intelligence</p>
            </div>
          )}

          {/* AI Modus Operandi & Graph Reasoning Card */}
          <div className="bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-blue-50/80 dark:from-slate-900 dark:via-indigo-950/40 dark:to-purple-950/30 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span className="text-xs font-extrabold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">
                Multi-Victim Syndicate Analysis
              </span>
            </div>
            <p className="text-xs text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium">
              Identified <strong>{activeVictims.length} connected victim complaints</strong> channeling {totalCombinedLossFormatted} into central scammer accounts, splitting through {nodes.filter((n) => n.hop === 2).length} layered banks into ATM cash-outs.
            </p>
            <div className="mt-3 pt-2.5 border-t border-indigo-200/60 dark:border-indigo-900/60 flex items-center justify-between text-[11px] font-mono text-indigo-700 dark:text-indigo-300">
              <span>Graph AST Engine: v3.2</span>
              <span className="font-bold">Confidence: 94%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Sequential Multi-Victim Transaction Stream Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-slate-50/60 dark:bg-slate-950/40">
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500 shrink-0" />
              Sequential Multi-Victim Transaction Provenance Stream
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Step-by-step money movement trail for {activeVictims.length} selected victim complaints
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 sm:hidden">Swipe table ➔</span>
            <span className="text-xs font-mono font-bold text-slate-500 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
              {edges.length} Active Transfers
            </span>
          </div>
        </div>

        <div className="overflow-x-auto -mx-0.5">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-100/70 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3">Transfer ID</th>
                <th className="px-4 py-3">Source Bank / Entity</th>
                <th className="px-4 py-3">Destination Bank / Entity</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Channel Mode</th>
                <th className="px-4 py-3">Hop Layer</th>
                <th className="px-4 py-3">Latency / Time</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {edges.map((e, idx) => {
                const src = nodes.find((n) => n.id === e.source);
                const dst = nodes.find((n) => n.id === e.target);

                return (
                  <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{e.id}</td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{src?.bankCode || 'Bank'}</span>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10.5px]">{src?.holder}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-bold text-slate-900 dark:text-slate-100">{dst?.bankCode || 'Bank'}</span>
                      <span className="text-slate-500 dark:text-slate-400 block text-[10.5px]">{dst?.holder}</span>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-white">{e.amount}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px] font-bold">
                        {e.mode}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">Hop {e.hop}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{e.time} ({e.latency})</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${
                          e.isWithdrawn
                            ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                            : e.isPending
                            ? 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-900 animate-pulse'
                            : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                        }`}
                      >
                        {e.isWithdrawn ? 'Cash Dispensed' : e.isPending ? 'Forecast Window' : 'Completed'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. ADD VICTIM COMPLAINT MODAL */}
      {showAddVictimModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div
            className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 relative max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Register Victim Complaint
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Map victim money trails to scammer hubs, intermediate mule accounts, and cash-out points
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddVictimModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 font-mono flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Quick Autofill Realistic Sample Complaint
                </span>
                <span className="text-[10px] text-slate-400">Click to test instant flow</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {sampleVictimPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewVictimForm({
                        ...initialVictimForm,
                        ...preset.data,
                        caseId: generateNextCaseId(),
                      });
                    }}
                    className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-xs transition text-left cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                        {preset.data.name}
                      </span>
                      <span className="text-[9.5px] font-bold text-blue-600 dark:text-blue-400 font-mono">
                        {preset.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate mt-0.5">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleAddVictimSubmit} className="mt-4 space-y-4 text-xs">
              {/* Complainant Identity */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                  1. Victim Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Complainant Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rameshwar Patel"
                      value={newVictimForm.name}
                      onChange={(e) => setNewVictimForm({ ...newVictimForm, name: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Complaint / Case FIR ID
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CT-2026-009"
                      value={newVictimForm.caseId}
                      onChange={(e) => setNewVictimForm({ ...newVictimForm, caseId: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Fraud Particulars */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                  2. Incident & Loss Details
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Loss Amount (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1000"
                      step="1000"
                      placeholder="e.g. 500000"
                      value={newVictimForm.lossNum}
                      onChange={(e) => setNewVictimForm({ ...newVictimForm, lossNum: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Fraud / Crime Category
                    </label>
                    <select
                      value={newVictimForm.fraudType}
                      onChange={(e) => setNewVictimForm({ ...newVictimForm, fraudType: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="Investment Scam">Investment / Fake Stock Scam</option>
                      <option value="UPI Instant Refund">UPI Instant Refund / QR Theft</option>
                      <option value="Card Cloning / OTP Theft">Card Cloning / OTP Theft</option>
                      <option value="Phishing Ring">Phishing Ring / Malware APK</option>
                      <option value="Fake Loan App Extortion">Fake Loan App Extortion</option>
                      <option value="Digital Arrest / Impersonation">Digital Arrest / CBI Impersonation</option>
                      <option value="Task / Part-Time Job Scam">Telegram Task / Part-Time Job</option>
                      <option value="Crypto P2P Extortion">Crypto P2P / Escrow Fraud</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bank & Routing Details */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                  3. Victim Bank & Destination Syndicate Hub
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Victim Bank
                    </label>
                    <select
                      value={newVictimForm.bank}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNewVictimForm({
                          ...newVictimForm,
                          bank: val,
                          bankCode: deriveBankCode(val),
                        });
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="State Bank of India">State Bank of India (SBI)</option>
                      <option value="HDFC Bank Ltd">HDFC Bank Ltd</option>
                      <option value="ICICI Bank Ltd">ICICI Bank Ltd</option>
                      <option value="Axis Bank Ltd">Axis Bank Ltd</option>
                      <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                      <option value="Bank of Baroda">Bank of Baroda</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      City / Branch
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ahmedabad"
                      value={newVictimForm.city}
                      onChange={(e) => setNewVictimForm({ ...newVictimForm, city: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                      Transfer Channel
                    </label>
                    <select
                      value={newVictimForm.transferMode}
                      onChange={(e) => setNewVictimForm({ ...newVictimForm, transferMode: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="UPI QR Phish">UPI QR Phish</option>
                      <option value="UPI Link Scam">UPI Link Scam</option>
                      <option value="IMPS Fraud Transfer">IMPS Instant Transfer</option>
                      <option value="RTGS High-Value Transfer">RTGS High-Value</option>
                      <option value="NetBanking Gateway">NetBanking Gateway</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">
                    Destination Scammer Hub (Hop 1 Target)
                  </label>
                  <select
                    value={newVictimForm.targetScammer}
                    onChange={(e) => setNewVictimForm({ ...newVictimForm, targetScammer: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="node-scammer-1">
                      Rameshwar Yadav (Primary Scammer - HDFC Vadodara) ➔ Layer 2: Axis & Kotak Mule Banks ➔ SBI/HDFC ATMs
                    </option>
                    <option value="node-scammer-2">
                      Karan Mehra (Digital Mule Escrow - Paytm Noida) ➔ Layer 2: ICICI Mule Bank ➔ Binance Crypto Escrow
                    </option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddVictimModal(false)}
                  className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl text-slate-600 dark:text-slate-400 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Trace Money Flow</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}