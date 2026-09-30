# Dual Light & Dark Theme GovTech UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul the CyberTrace AI interface into an authoritative High-Trust Law Enforcement & GovTech Console with dynamic Light and Dark theme switching across all components, maps, charts, and pages.

**Architecture:** Tailwind CSS `darkMode: 'class'` powered by a reactive `ThemeContext`. Persistent theme storage in `localStorage`, clean semantic color mapping (`dark:` classes alongside crisp light defaults), and reactive map/chart styling.

**Tech Stack:** React 18, Tailwind CSS 3 (`darkMode: 'class'`), Lucide React, Recharts, Leaflet, Axios.

**Spec:** [docs/superpowers/specs/2026-09-30-dual-theme-govtech-ui-design.md](file:///c:/Users/manan/OneDrive/Documents/SIH_PROJECT/CyberTrace-AI/docs/superpowers/specs/2026-09-30-dual-theme-govtech-ui-design.md)

---

## Global Constraints

- **Dual-Mode Consistency:** Every surface, text label, border, and badge must be fully legible and aesthetically refined in both Light and Dark mode.
- **No Hardcoded Dark-Only Styles:** Avoid standalone `bg-[#030712]` or `text-slate-100` without light counterparts (e.g. use `bg-slate-50 dark:bg-[#030712]` and `text-slate-900 dark:text-slate-100`).
- **Zero Broken Builds:** `cmd.exe /c "npm.cmd run build"` in `frontend/` must exit with code 0 at every task boundary.
- **High-Trust GovTech Aesthetic:** Restrained colors, clean borders, zero neon or sci-fi gimmicks.

---

### Task 1: Theme Engine & Global Styling Configuration

**Files:**
- Create: `frontend/src/context/ThemeContext.jsx`
- Create: `frontend/src/components/common/ThemeToggle.jsx`
- Modify: `frontend/tailwind.config.js`
- Modify: `frontend/src/index.css`
- Modify: `frontend/src/App.jsx`

- [ ] **Step 1: Create `ThemeContext.jsx`**
  - Implement `ThemeProvider` with `theme` state (`light`, `dark`, `system`), toggle function, `localStorage` synchronization, and `matchMedia` listener.

- [ ] **Step 2: Create `ThemeToggle.jsx`**
  - Accessible button with Sun/Moon icons, rotation transition, and tooltip.

- [ ] **Step 3: Update `tailwind.config.js`**
  - Add `darkMode: 'class'` and GovTech color tokens.

- [ ] **Step 4: Update `index.css`**
  - Configure CSS custom properties for light/dark canvas, dual-mode scrollbars, and theme-dependent Leaflet tile filters (`.dark .leaflet-tile`).

- [ ] **Step 5: Update `App.jsx`**
  - Wrap application tree in `<ThemeProvider>`.

- [ ] **Step 6: Verify build & commit**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Commit: `feat(theme): implement ThemeContext, ThemeToggle, and dual-mode base styles`

---

### Task 2: Dual-Mode Atomic Design System Components

**Files:**
- Modify: `frontend/src/components/common/GlassCard.jsx`
- Modify: `frontend/src/components/common/StatusBadge.jsx`
- Modify: `frontend/src/components/common/MetricCard.jsx`
- Modify: `frontend/src/components/common/EvidenceBadge.jsx`
- Modify: `frontend/src/components/common/ConfidenceBar.jsx`
- Modify: `frontend/src/components/common/DataSufficiencyBanner.jsx`
- Modify: `frontend/src/components/common/ModalDialog.jsx`

- [ ] **Step 1: Adapt `GlassCard.jsx`**
  - White surface with `border-slate-200 shadow-sm` in light mode; dark glass with `dark:bg-slate-900/80 dark:border-slate-800` in dark mode.

- [ ] **Step 2: Adapt `StatusBadge.jsx`**
  - Crisp solid pastel badges in light mode; translucent dark badges in dark mode.

- [ ] **Step 3: Adapt `MetricCard.jsx`**
  - High-contrast text `#0f172a` in light mode; bold white in dark mode.

- [ ] **Step 4: Adapt `EvidenceBadge.jsx` & `ConfidenceBar.jsx`**
  - Dual-mode backgrounds, borders, and legible contrast.

- [ ] **Step 5: Adapt `DataSufficiencyBanner.jsx` & `ModalDialog.jsx`**
  - High-trust formal banner in light mode; dark obsidian dialog in dark mode.

- [ ] **Step 6: Verify build & commit**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Commit: `feat(theme): adapt atomic design system components to dual light/dark mode`

---

### Task 3: Dual-Mode Application Shell (Navbar, Sidebar, Layout)

**Files:**
- Modify: `frontend/src/components/layout/Navbar.jsx`
- Modify: `frontend/src/components/layout/Sidebar.jsx`
- Modify: `frontend/src/components/layout/Layout.jsx`

- [ ] **Step 1: Adapt `Navbar.jsx`**
  - Embed `ThemeToggle`, crisp white header in light mode with dark border-b, and dark glass in dark mode.

- [ ] **Step 2: Adapt `Sidebar.jsx`**
  - Crisp light navigation rail in light mode with slate-100 hover; dark rail in dark mode.

- [ ] **Step 3: Adapt `Layout.jsx`**
  - Canvas background: `bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-100`.

- [ ] **Step 4: Verify build & commit**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Commit: `feat(theme): adapt application shell and navigation to dual light/dark mode`

---

### Task 4: Dual-Mode Operational Dashboard Overhaul

**Files:**
- Modify: `frontend/src/pages/Dashboard.jsx`

- [ ] **Step 1: Adapt KPI grid & Top Banner to Light & Dark**
  - Official GovTech header banner styling for light & dark modes.

- [ ] **Step 2: Adapt Recharts Analytics to Theme**
  - AreaChart and BarChart grid lines, axis text, and tooltip cards adapt dynamically to active theme.

- [ ] **Step 3: Adapt Active Cases Table & Priority Alerts Queue**
  - Crisp tabular rows with legible borders in light mode.

- [ ] **Step 4: Verify build & commit**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Commit: `feat(theme): adapt operational dashboard and charts to dual light/dark mode`

---

### Task 5: Dual-Mode Complaints & Case Dossier

**Files:**
- Modify: `frontend/src/pages/Complaints.jsx`
- Modify: `frontend/src/pages/ComplaintDetails.jsx`
- Modify: `frontend/src/features/complaints/TransactionImportModal.jsx`

- [ ] **Step 1: Adapt `Complaints.jsx` registry table & search filters**
- [ ] **Step 2: Adapt `TransactionImportModal.jsx` upload drop zone & schema preview**
- [ ] **Step 3: Adapt `ComplaintDetails.jsx` case dossier & multi-hop timeline**
- [ ] **Step 4: Verify build & commit**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Commit: `feat(theme): adapt complaints registry, import modal, and case dossier to dual mode`

---

### Task 6: Dual-Mode Prediction Center & Forecasting

**Files:**
- Modify: `frontend/src/pages/PredictionCenter.jsx`

- [ ] **Step 1: Adapt case selector, trigger button, and candidate lead card**
- [ ] **Step 2: Verify build & commit**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Commit: `feat(theme): adapt prediction center to dual light/dark mode`

---

### Task 7: Dual-Mode Intelligence Map & Transaction Network

**Files:**
- Modify: `frontend/src/pages/IntelligenceMap.jsx`
- Modify: `frontend/src/pages/TransactionNetwork.jsx`

- [ ] **Step 1: Adapt `IntelligenceMap.jsx` floating toggles, legend, and inspector**
- [ ] **Step 2: Adapt `TransactionNetwork.jsx` topological nodes and accessible table**
- [ ] **Step 3: Verify build & commit**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Commit: `feat(theme): adapt intelligence map and transaction network to dual mode`

---

### Task 8: Dual-Mode Alerts Workflow, Security Center & Login

**Files:**
- Modify: `frontend/src/pages/Alerts.jsx`
- Modify: `frontend/src/pages/SecurityCenter.jsx`
- Modify: `frontend/src/pages/Login.jsx`

- [ ] **Step 1: Adapt `Alerts.jsx` queue, triage inspector, and decision notes**
- [ ] **Step 2: Adapt `SecurityCenter.jsx` RBAC cards, hash validator, and audit table**
- [ ] **Step 3: Adapt `Login.jsx` tactical authentication portal**
- [ ] **Step 4: Final verification build**
  - Run: `cmd.exe /c "npm.cmd run build"` in `frontend/`
  - Expected: Exit code 0.
- [ ] **Step 5: Commit**
  - Commit: `feat(theme): complete dual-mode transformation for alerts, security, and login`
