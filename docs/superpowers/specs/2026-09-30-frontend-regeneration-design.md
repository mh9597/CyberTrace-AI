# Design Specification: Frontend Regeneration & Design System Alignment

- **Date:** 2026-09-30
- **Status:** Approved Baseline (Ready for Implementation Planning)
- **Target:** `frontend/` (React 18 + Tailwind CSS + Vite)
- **References:** [design.md](file:///c:/Users/manan/OneDrive/Documents/SIH_PROJECT/CyberTrace-AI/design.md), [ARCHITECTURE_RULES.md](file:///c:/Users/manan/OneDrive/Documents/SIH_PROJECT/CyberTrace-AI/ARCHITECTURE_RULES.md), VoltAgent `awesome-design-md`

---

## 1. Executive Summary & Aesthetic Direction

This specification outlines the comprehensive frontend regeneration of **CyberTrace AI**, transforming the interface into a state-of-the-art **Tactical Void-Navy Glassmorphic Operations Console** adhering strictly to the product vision in `design.md` (SIH 2026 Problem Statement SIH26184).

The console embodies:
1. **High-Trust Operations Aesthetics:** Deep void canvas (`#030712`, `#0B0F19`), translucent glassmorphic surfaces (`backdrop-blur-md`), precise border strokes, and curated semantic accents (Cyber Cyan `#06B6D4`, Tactical Indigo `#6366F1`, Emerald `#10B981` for verified leads, Amber `#F59E0B` for synthetic/caution notices, and Crimson `#EF4444` for active risk).
2. **Honest Uncertainty & Decision Support:** Prominent data sufficiency indicators, calibrated confidence bars with uncertainty intervals (e.g. `84% ± 14%`), and visual differentiation between raw scores, DBSCAN historical clusters, and predictive candidate leads.
3. **Evidence-First Inspection:** Clickable source references, transaction hop traces, and SHA-256 evidence digest indicators across all workflows.

---

## 2. Design System Tokens & Typography

### 2.1 CSS Variables & Tokens (`frontend/src/index.css`)
```css
:root {
  --bg-void: #030712;
  --bg-surface: #0b1120;
  --bg-card: rgba(15, 23, 42, 0.75);
  --bg-card-hover: rgba(30, 41, 59, 0.85);
  
  --border-subtle: rgba(51, 65, 85, 0.5);
  --border-highlight: rgba(6, 182, 212, 0.3);
  
  --cyan-primary: #06b6d4;
  --indigo-tactical: #6366f1;
  --emerald-verified: #10b981;
  --amber-warning: #f59e0b;
  --crimson-violation: #ef4444;
  
  --font-ui: 'Inter', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

### 2.2 Typography Scale
- UI Body & Headers: `Inter` for clarity and rapid legibility under operational conditions.
- Operational Data: `JetBrains Mono` for Complaint IDs (`CT-2026-001`), Transaction Hashes, Monetary Figures (`₹50,000`), Lat/Lng Coordinates, and Timestamps.

---

## 3. Atomic Design System Components (`frontend/src/components/common/`)

To guarantee visual consistency and avoid ad-hoc styling, the following reusable primitives will be created/enhanced:

| Component | Responsibility |
| :--- | :--- |
| `GlassCard.jsx` | Translucent container with border highlights, optional hover glow, and header slot. |
| `StatusBadge.jsx` | Glowing status pill with animated pulsing beacon for case and alert states. |
| `MetricCard.jsx` | KPI card with icon, primary numerical value, secondary trend badge, and ambient glow. |
| `EvidenceBadge.jsx` | Verified provenance pill showing source reference, file SHA-256 hash, or synthetic label. |
| `DataSufficiencyBanner.jsx`| Callout banner indicating whether an analysis is a validated forecast, heuristic, or hotspot. |
| `ConfidenceBar.jsx` | Visual calibration bar depicting point estimate alongside uncertainty interval (e.g. ±14%). |
| `ModalDialog.jsx` | Accessible dialog with backdrop blur, focus trapping, ESC listener, and smooth enter animation. |

---

## 4. Navigation & Application Shell (`frontend/src/components/layout/`)

### 4.1 Navbar (`Navbar.jsx`)
- **Brand Identity:** CyberTrace AI emblem with SIH26184 badge.
- **Mandatory Synthetic Banner:** Persistent amber pill: `SYNTHETIC DEMO ENVIRONMENT | INVESTIGATIVE LEADS ONLY`.
- **Active Officer Pill:** Display officer name, role (`INVESTIGATOR`, `SENIOR OFFICER`, `ADMIN`), badge ID, and 1-click logout.
- **Quick Status Beacon:** Live WebSocket/telemetry pulse for backend and ML engine connectivity.

### 4.2 Sidebar (`Sidebar.jsx`)
- Compact, sleek navigation rail with distinct icons for the 7 primary modules:
  1. `Dashboard` (`/`)
  2. `Complaints` (`/complaints`)
  3. `Prediction Center` (`/predictions`)
  4. `Intelligence Map` (`/map`)
  5. `Transaction Network` (`/network`)
  6. `Alerts & Workflow` (`/alerts`)
  7. `Security Center` (`/security`)
- System status footer showing model version (`RF-DBSCAN-v1.0`) and database connection status.

---

## 5. Module-by-Module Overhaul Architecture

### 5.1 Operational Dashboard (`Dashboard.jsx`)
- **Top Ingestion Velocity & Calibration Benchmarks:**
  - Dynamic KPI cards (Total Cases, Active Alerts, DBSCAN Clusters, Calibration PR-AUC).
  - Recharts Ingestion Velocity chart (hourly fraud volume) and Cash-out Lead-Time distribution.
  - Held-out test evaluation banner (Precision 88.4%, Recall 82.1%, Lead Time 38 min, Centroid error 1.2 km).
- **Dual Working Panes:**
  - Left (2/3): Active Complaints Data Table with sorting, filter chips, and 1-click inspection.
  - Right (1/3): High-Priority Cash-out Candidate Queue with countdown timers and triage action links.

### 5.2 Complaints & Case Dossier (`Complaints.jsx` & `ComplaintDetails.jsx`)
- **Case Register:**
  - Searchable, filterable table with complaint ID, fraud type, reported amount, status, and last update.
  - Guided "Register New Case" modal with schema validation.
  - CSV/JSON Evidence Import modal with upload preview, duplicate detection, and format verification.
- **Case Dossier View (`ComplaintDetails.jsx`):**
  - Case metadata card with "Golden Hour" urgency timer.
  - Chronological multi-hop transaction chain with visual hop connectors, transaction IDs, amounts, and source references.
  - Actions: "Issue Bank Freeze Request" and "Export Forensic Dossier".

### 5.3 Prediction Center (`PredictionCenter.jsx`)
- Case selection dropdown with amount and fraud type context.
- Explicit "Run Analysis" CTA with real-time execution animation.
- `DataSufficiencyBanner`: Displays analysis mode (`Validated Forecast` vs `Heuristic Rule-Engine` vs `Historical Hotspot Only`).
- Candidate Lead Cards:
  - Candidate ATM/Terminal Zone.
  - Estimated Cash-out Time Window countdown.
  - Calibrated Probability Score with visual `ConfidenceBar` showing ±14% uncertainty.
  - Top 3 supporting factors (e.g. Rapid UPI hop velocity, repeated receiver account, proximity to historical cluster).
  - 1-click action: "Generate Priority Investigation Alert".

### 5.4 Intelligence Map (`IntelligenceMap.jsx`)
- Dual map provider support: Google Maps JavaScript API with graceful fallback to Leaflet/OpenStreetMap.
- Layer control pills:
  - 🟣 Historical DBSCAN Hotspots (density cluster circles).
  - 🔴 Predicted Cash-out Candidate Zones (cautiously styled with uncertainty radius).
  - 🟡 Observed Withdrawal Terminals.
- Detail Inspector Sheet: Slides in on marker/zone click, displaying coordinates, radius, supporting evidence links, and data mode label.

### 5.5 Transaction Network (`TransactionNetwork.jsx`)
- Interactive topological graph visualization of laundering paths.
- Categorized node types:
  - Victim Complaint (Cyan)
  - Intermediary Mule Account (Indigo)
  - Split Transaction Hop (Slate)
  - Physical ATM Terminal (Crimson)
- Interactive inspector showing edge amount, timestamp, and source reference.
- Tabular list fallback for full accessibility and keyboard navigation.

### 5.6 Alerts & Investigation Workflow (`Alerts.jsx`)
- Triage queue organized by urgency and status: `New`, `Assigned`, `Under Review`, `Verified`, `Dismissed`, `Resolved`.
- Officer Decision Drawer:
  - Detailed case context and candidate zone review.
  - Officer notes timeline with instant note submission.
  - Status transition buttons triggering audit records (`Mark Verified`, `Dismiss with Reason`, `Resolve Case`).

### 5.7 Security Center & Cryptographic Vault (`SecurityCenter.jsx`)
- Role-Based Access Control matrix (Admin, Senior Officer, Investigator).
- Cryptographic Evidence Integrity validator: Real-time SHA-256 hash comparison between evidence ledger and on-disk payload.
- Protected, tamper-evident audit logs table with actor, action, target record, and timestamp.

### 5.8 Officer Authentication (`Login.jsx`)
- Tactical authentication card with ambient glow and SIH header.
- Quick role-switch demo buttons (`Investigator`, `Senior Officer`, `Admin`) for seamless evaluator walkthroughs.
- Clear disclaimer on synthetic data and decision-support boundaries.

---

## 6. Implementation Guardrails & Verification Criteria

1. **Architecture Rules:**
   - Pages in `src/pages/` must act as clean compositions without monolithic inline logic.
   - Slices in `src/features/` must remain autonomous with zero cross-feature imports.
2. **Build Verification:**
   - Every modified component must cleanly compile with `npm.cmd run build` (Exit Code 0).
3. **Visual WOW Factor:**
   - Every page must feature dark glassmorphism, responsive grid layouts, custom typography, and smooth micro-interactions.
