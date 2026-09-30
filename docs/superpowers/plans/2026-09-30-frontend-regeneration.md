# Frontend UI Regeneration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Regenerate the CyberTrace AI frontend into a state-of-the-art Tactical Void-Navy Glassmorphic Operations Console in full alignment with `design.md` (SIH 2026 Problem Statement SIH26184) and VoltAgent `awesome-design-md`.

**Architecture:** A Feature-Sliced React 18 application built on Tailwind CSS, Lucide icons, Recharts, and Leaflet/Google Maps. The architecture pairs an atomic common design system (`src/components/common/`) with isolated feature slices (`src/features/`) and composed route views (`src/pages/`).

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, Recharts, Leaflet / React-Leaflet, Google Maps Loader, Lucide Icons, Axios.

**Spec:** [docs/superpowers/specs/2026-09-30-frontend-regeneration-design.md](file:///c:/Users/manan/OneDrive/Documents/SIH_PROJECT/CyberTrace-AI/docs/superpowers/specs/2026-09-30-frontend-regeneration-design.md) and [design.md](file:///c:/Users/manan/OneDrive/Documents/SIH_PROJECT/CyberTrace-AI/design.md)

---

## Global Constraints

- **Design Philosophy:** Restrained, high-trust operations console — dark void canvas (`#030712`, `#0B0F19`), translucent glass cards, accessible contrast (WCAG 2.2 AA).
- **Mandatory Synthetic Banner:** Must be visibly present across the application shell and demo pages.
- **Honest Uncertainty:** Never present scores as certainty; distinguish calibrated forecasts from DBSCAN historical hotspots and heuristics; always display data sufficiency states.
- **Zero Broken Builds:** `cmd.exe /c "npm.cmd run build"` in `frontend/` must exit with code 0 at the conclusion of every task.
- **Slice Independence:** No cross-feature imports between `src/features/*`.

## Review Focus

1. **Empty / Insufficient Data States:** When a complaint has no transactions or no candidate prediction, the UI must display a clear explanation rather than blank space or broken charts.
2. **Accessible Contrast:** Text on glassmorphic backgrounds must satisfy WCAG 2.2 AA contrast standards.
3. **Responsive Degradation:** On narrow screens (< 1024px), large tables and maps must remain navigable without layout overflow.
4. **Interactive State Feedback:** Async operations (uploading evidence, running prediction, signing off alert) must show clear pending spinners and success toasts.
5. **Masked Financial Identifiers:** Account numbers and phone numbers should have accessible masking with hover/reveal capabilities.

---

### Task 1: Design Tokens, Typography & Base CSS

**Files:**
- Modify: `frontend/index.html`
- Modify: `frontend/tailwind.config.js`
- Modify: `frontend/src/index.css`

**Interfaces:**
- Produces: CSS variables (`--bg-void`, `--bg-surface`, `--bg-card`, `--cyan-primary`, `--indigo-tactical`, `--emerald-verified`, `--amber-warning`, `--crimson-alert`), custom Tailwind utility classes (`glow-cyan`, `glow-rose`, `glass-panel`), and loaded Google Fonts (`Inter`, `JetBrains Mono`).

- [ ] **Step 1: Update `frontend/index.html`**
  - Add Google Fonts preconnect and stylesheet links for `Inter` (weights 400, 500, 600, 700) and `JetBrains Mono` (weights 400, 500, 700).
  - Update page title to `CyberTrace AI — Secure Predictive Cybercrime Intelligence`.

- [ ] **Step 2: Update `frontend/tailwind.config.js`**
  - Extend fonts with `fontFamily: { sans: ['Inter', 'sans-serif'], mono: ['"JetBrains Mono"', 'monospace'] }`.
  - Extend colors with void, surface, and semantic tones.

- [ ] **Step 3: Update `frontend/src/index.css`**
  - Define root design tokens, custom scrollbars, enhanced glassmorphism utilities, and dark Leaflet map filters.

- [ ] **Step 4: Verify build**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Expected: Exit code 0.

- [ ] **Step 5: Commit**
  - `git add frontend/index.html frontend/tailwind.config.js frontend/src/index.css`
  - `git commit -m "feat(ui): configure design tokens, typography, and base glassmorphism"`

---

### Task 2: Core Atomic Design System Components

**Files:**
- Create: `frontend/src/components/common/GlassCard.jsx`
- Create: `frontend/src/components/common/StatusBadge.jsx`
- Create: `frontend/src/components/common/MetricCard.jsx`
- Create: `frontend/src/components/common/EvidenceBadge.jsx`
- Create: `frontend/src/components/common/DataSufficiencyBanner.jsx`
- Create: `frontend/src/components/common/ConfidenceBar.jsx`
- Create: `frontend/src/components/common/ModalDialog.jsx`

**Interfaces:**
- Consumes: Tailwind classes and Lucide icons.
- Produces: Reusable primitives for all pages and features.

- [ ] **Step 1: Implement `GlassCard.jsx`**
  - Accepts `children`, `className`, `hoverGlow` (cyan/rose/emerald), `headerTitle`, `headerAction`.

- [ ] **Step 2: Implement `StatusBadge.jsx`**
  - Accepts `status`, `variant` (neutral, success, warning, danger, cyan), with animated beacon dot.

- [ ] **Step 3: Implement `MetricCard.jsx`**
  - Accepts `title`, `value`, `subtext`, `icon`, `trend`, `glowColor`.

- [ ] **Step 4: Implement `EvidenceBadge.jsx` & `ConfidenceBar.jsx`**
  - `EvidenceBadge`: Shows source reference or SHA-256 hash badge with copy icon.
  - `ConfidenceBar`: Visual progress bar showing confidence percentage alongside ± uncertainty interval.

- [ ] **Step 5: Implement `DataSufficiencyBanner.jsx` & `ModalDialog.jsx`**
  - `DataSufficiencyBanner`: Displays mode (`Validated Forecast`, `Heuristic Ruleset`, `Historical Hotspot Only`).
  - `ModalDialog`: Accessible modal with backdrop blur and ESC close handler.

- [ ] **Step 6: Verify build**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Expected: Exit code 0.

- [ ] **Step 7: Commit**
  - `git add frontend/src/components/common/`
  - `git commit -m "feat(ui): add atomic design system components"`

---

### Task 3: Application Shell, Navbar & Sidebar

**Files:**
- Modify: `frontend/src/components/layout/Navbar.jsx`
- Modify: `frontend/src/components/layout/Sidebar.jsx`
- Modify: `frontend/src/components/layout/Layout.jsx`

**Interfaces:**
- Consumes: `useAuth()`, `StatusBadge`, Lucide icons, `NavLink`.
- Produces: Persistent layout shell with responsive collapsible navigation rail, persistent synthetic disclaimer, and officer profile pill.

- [ ] **Step 1: Overhaul `Navbar.jsx`**
  - Embed CyberTrace AI emblem, SIH26184 badge, amber synthetic demo warning pill, officer role badge, and system status beacon.

- [ ] **Step 2: Overhaul `Sidebar.jsx`**
  - Implement sleek tactical navigation list for the 7 primary modules with active glow indicators and telemetry footer.

- [ ] **Step 3: Update `Layout.jsx`**
  - Ensure responsive shell sizing with smooth scrollbar management.

- [ ] **Step 4: Verify build**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Expected: Exit code 0.

- [ ] **Step 5: Commit**
  - `git add frontend/src/components/layout/`
  - `git commit -m "feat(ui): elevate application shell, navbar, and sidebar navigation"`

---

### Task 4: Operational Dashboard Overhaul

**Files:**
- Modify: `frontend/src/pages/Dashboard.jsx`

**Interfaces:**
- Consumes: `api.get('/complaints')`, `api.get('/alerts')`, `api.get('/map/hotspots')`, `MetricCard`, `GlassCard`, `StatusBadge`, Recharts.
- Produces: Primary operational overview with live charts, KPI counters, active cases table, and priority alerts queue.

- [ ] **Step 1: Implement dynamic KPI grid**
  - Total Ingested Cases, Active Priority Alerts, DBSCAN Clustered Hotspots, Model PR-AUC Calibration.

- [ ] **Step 2: Implement Recharts Ingestion Velocity chart**
  - Hourly case ingestion trend (AreaChart) and Cash-out Lead-Time distribution (BarChart).

- [ ] **Step 3: Implement Held-out Synthetic Benchmark panel**
  - Precision (88.4%), Recall (82.1%), Avg Lead-time (38 min), Geospatial Error (1.2 km).

- [ ] **Step 4: Implement Active Cases table & Priority Alerts triage queue**
  - Clean table with sorting, quick filter tags, and direct inspection links.

- [ ] **Step 5: Verify build**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Expected: Exit code 0.

- [ ] **Step 6: Commit**
  - `git add frontend/src/pages/Dashboard.jsx`
  - `git commit -m "feat(ui): regenerate operational intelligence dashboard"`

---

### Task 5: Complaints Register, Intake & Case Dossier

**Files:**
- Modify: `frontend/src/pages/Complaints.jsx`
- Modify: `frontend/src/pages/ComplaintDetails.jsx`
- Create: `frontend/src/features/complaints/TransactionImportModal.jsx`

**Interfaces:**
- Consumes: `api.get('/complaints')`, `api.post('/complaints')`, `api.get('/complaints/:id')`, `api.post('/complaints/:id/transactions/import')`.
- Produces: Searchable complaint registry, CSV validation preview modal, and multi-hop chronological dossier.

- [ ] **Step 1: Elevate `Complaints.jsx`**
  - Search bar, status filter chips, guided "Register Case" modal with form validation and preview.

- [ ] **Step 2: Create `TransactionImportModal.jsx`**
  - Drag-and-drop CSV/JSON upload with validation preview (duplicate checking, missing columns, row preview) before committing.

- [ ] **Step 3: Elevate `ComplaintDetails.jsx`**
  - Case dossier banner, Golden Hour timer, multi-hop chronological transaction timeline with visual hop connectors and source references.

- [ ] **Step 4: Verify build**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Expected: Exit code 0.

- [ ] **Step 5: Commit**
  - `git add frontend/src/pages/Complaints.jsx frontend/src/pages/ComplaintDetails.jsx frontend/src/features/complaints/`
  - `git commit -m "feat(ui): regenerate complaints registry, CSV import modal, and case dossier"`

---

### Task 6: Prediction Center & Cash-out Forecasting

**Files:**
- Modify: `frontend/src/pages/PredictionCenter.jsx`

**Interfaces:**
- Consumes: `api.get('/complaints/:id/predictions')`, `api.post('/complaints/:id/predict')`, `DataSufficiencyBanner`, `ConfidenceBar`, `GlassCard`.
- Produces: Predictive forecasting view with explicit trigger, data sufficiency status, and candidate cards with ±14% uncertainty.

- [ ] **Step 1: Implement Case Selector & Analysis Trigger**
  - Case selector with meta summary; "Run Predictive Analysis" button with execution animation.

- [ ] **Step 2: Integrate `DataSufficiencyBanner`**
  - Displays analysis mode (`Validated Forecast` vs `Heuristic Rule-Engine` vs `Historical Hotspots Only`).

- [ ] **Step 3: Implement Candidate Lead Cards**
  - Candidate ATM/Terminal Zone, time-window countdown, `ConfidenceBar` (calibrated probability ±14%), top supporting factors, and 1-click alert generation.

- [ ] **Step 4: Verify build**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Expected: Exit code 0.

- [ ] **Step 5: Commit**
  - `git add frontend/src/pages/PredictionCenter.jsx`
  - `git commit -m "feat(ui): regenerate prediction center with honest uncertainty and candidate lead cards"`

---

### Task 7: Intelligence Map & Transaction Network

**Files:**
- Modify: `frontend/src/pages/IntelligenceMap.jsx`
- Modify: `frontend/src/pages/TransactionNetwork.jsx`

**Interfaces:**
- Consumes: `useHotspots()`, `api.get('/complaints/:id/network')`, Leaflet, GoogleMapView.
- Produces: Dual-engine map with layer toggles and inspector sheet; SVG topological network graph with accessible table fallback.

- [ ] **Step 1: Elevate `IntelligenceMap.jsx`**
  - Dark-styled Leaflet/Google Maps view, layer toggle pills (DBSCAN Hotspots, Candidate Zones, Observed Withdrawals), map legend, and slide-in zone inspector sheet.

- [ ] **Step 2: Elevate `TransactionNetwork.jsx`**
  - Visual topology graph with color-coded node types (Victim, Mule, Split, Cash-out ATM), glowing SVG links, edge inspection drawer, and accessible tabular fallback.

- [ ] **Step 3: Verify build**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Expected: Exit code 0.

- [ ] **Step 4: Commit**
  - `git add frontend/src/pages/IntelligenceMap.jsx frontend/src/pages/TransactionNetwork.jsx`
  - `git commit -m "feat(ui): elevate intelligence map and transaction network visualization"`

---

### Task 8: Alerts Workflow, Security Center & Authentication

**Files:**
- Modify: `frontend/src/pages/Alerts.jsx`
- Modify: `frontend/src/pages/SecurityCenter.jsx`
- Modify: `frontend/src/pages/Login.jsx`

**Interfaces:**
- Consumes: `api.get('/alerts')`, `api.patch('/alerts/:id')`, `api.get('/security/audit-logs')`, `api.get('/security/evidence/1/integrity')`, `useAuth()`.
- Produces: Alerts triage workflow, cryptographic evidence validator, and tactical officer sign-in.

- [ ] **Step 1: Elevate `Alerts.jsx`**
  - Triage queue with state transitions (`New`, `Assigned`, `Under Review`, `Verified`, `Dismissed`, `Resolved`), officer notes feed, and decision sign-off modal.

- [ ] **Step 2: Elevate `SecurityCenter.jsx`**
  - RBAC privilege matrix, cryptographic SHA-256 evidence integrity validation card with live verification test, and immutable audit logs table.

- [ ] **Step 3: Elevate `Login.jsx`**
  - Tactical card with SIH branding, 1-click role switcher demo buttons (`Investigator`, `Senior Officer`, `Admin`), and responsible use disclaimers.

- [ ] **Step 4: Final verification build**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Expected: Exit code 0.

- [ ] **Step 5: Commit**
  - `git add frontend/src/pages/Alerts.jsx frontend/src/pages/SecurityCenter.jsx frontend/src/pages/Login.jsx`
  - `git commit -m "feat(ui): complete alerts workflow, cryptographic security vault, and login screen"`
