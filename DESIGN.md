# CyberTrace AI — Design System & Visual Specification

> **Reference Standard:** Recreated from the SIH 2026 CyberTrace AI reference UI design specifications.

---

## 1. Visual Identity & Design Direction

- **Product:** CyberTrace AI — Predictive Cybercrime Intelligence Platform (SIH 2026)
- **Style:** Modern enterprise SaaS dashboard, clean, futuristic, authoritative law-enforcement feel.
- **Theme:** Pure light UI. Crisp white surfaces on a soft `#F7FAFF` blue-tinted background, punctuated by ambient bottom-left pastel fluid gradients.
- **Primary Action Color:** Royal Blue (`#2563EB`)
- **Secondary Accents:** Indigo/Purple (`#6366F1`), Cyan (`#06B6D4`), Amber/Coral
- **Card Treatment:** 16px border-radius, 1px `#E2E8F0` border, soft elevation shadows (`shadow-xs` / `shadow-sm`), zero clutter.

---

## 2. Color System

| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| **Primary** | `#2563EB` | Primary buttons, active navigation, key highlights, case IDs |
| **Deep Blue** | `#0F172A` | Primary typography, headers, metric values |
| **Background** | `#F7FAFF` | Application base background |
| **Card Surface** | `#FFFFFF` | Dashboard widgets, tables, modals, side panels |
| **Light Blue** | `#EFF6FF` | Active nav pill backgrounds, subtle tags |
| **Secondary Accent** | `#6366F1` | Secondary indicators, role labels, network graph nodes |
| **Cyan Accent** | `#06B6D4` | Model metrics, secondary KPIs, technical telemetry |
| **Success** | `#10B981` | Positive status, closed cases, resolved alerts |
| **Warning** | `#F59E0B` | Medium risk, pending items, ATM indicators |
| **Danger** | `#EF4444` | High risk indicators, critical cash-out probability |
| **Text Secondary** | `#64748B` | Subtitles, table column labels, timestamps |
| **Border** | `#E2E8F0` | Dividers, card boundaries, input outlines |

---

## 3. Typography Hierarchy

- **Font Family:** `Inter`, `-apple-system`, `sans-serif`
- **Page Titles:** 24–30px, font-bold, `#0F172A`
- **Section Titles:** 16–20px, font-bold / semibold
- **Card Titles:** 12–14px, uppercase / font-bold
- **KPI Metrics:** 28–34px, font-extrabold, `#0F172A`
- **Body & Data:** 12–13px, font-medium, `#0F172A` / `#64748B`
- **Metadata / Identifiers:** 10–11px, monospace (`font-mono`)

---

## 4. UI Architecture & Recreated Screens

The platform implements 8 interconnected primary pages and 1 universal Case Details modal:

### 1. Landing Page (`/` and `/landing`)
- **Hero Section:**
  - Left: "CyberTrace AI - Predict. Trace. Prevent." headline, value proposition, "Get Started ->" and "Watch Demo" CTAs.
  - Right: Interactive India/Gujarat cyber-mesh visualization with 3 floating intelligence cards:
    - *High Risk Zone:* Ahmedabad (82% Probability)
    - *Potential Cash-out:* 12 Oct 2026 (10:00 AM – 2:00 PM)
    - *Live Intelligence Feed:* Real-time live tactical updates.
  - Bottom: 4 key performance metrics (10K+ Cases, 95% Accuracy, 500+ Officers, 24/7 Intel).

### 2. Dashboard (`/dashboard`)
- **Top Bar:** Page title, date range picker (`01 Oct 2026 - 12 Oct 2026`), "Last 7 Days" dropdown.
- **KPI Cards:** Total Cases (1,248), Active Investigations (342), High Risk Alerts (68), Prediction Accuracy (87%).
- **Left Threat Map:** Interactive geospatial risk distribution with color-intensity heat zones and radial radar circles.
- **Right Column:** High Risk Zones ranked list (Ahmedabad 82%, Vadodara 64%, Surat 48%, Rajkot 36%, Mumbai 28%) + Recent Activity feed.

### 3. Complaints Registry (`/complaints`)
- **Top Actions:** "+ New Complaint" button launching dynamic complaint submission dialog.
- **Stat Cards:** Total Complaints, Active Investigations, Closed Cases, High Risk Cases.
- **Toolbar:** Global text search, Fraud Type filter, Status filter, Export CSV.
- **Table:** Real case records (`CT-3026-001` through `CT-3026-008`), pill status badges, risk levels, and direct inspection trigger.

### 4. Prediction Center (`/predictions`)
- **Navigation Tabs:** New Prediction, Historical Predictions, Model Performance.
- **Case Information Card:** Dynamic case selection, fraud type, transaction amount, and "Run Prediction" trigger.
- **Prediction Result Card:** Circular SVG gauge displaying 82% cash-out probability with "HIGH RISK" alert.
- **Time & Location Card:** Calendar window (10:00 AM – 2:00 PM) and top 4 predicted cities.
- **Model Explanation:** Feature importance weighting bars (Transaction Amount 35%, Location History 28%, Account Linkage 18%, etc.).

### 5. Intelligence Map (`/map`)
- **Left Panel:** Filters for State, District, Date Range, Risk Level, and Layer toggles (Predicted Locations, Historical Hotspots, ATMs, Active Cases).
- **Interactive Map:** Street grid vector map, Sabarmati river path, danger rings, and interactive popup card for *Ahmedabad - Satellite* (82% risk).
- **View Switcher:** Heatmap View, Cluster View, Satellite View, 3D View.

### 6. Transaction Network (`/network`)
- **Top Bar:** Case selector (`CT-3026-002`) and "Expand Network" button.
- **Interactive Canvas:** SVG topology graph featuring a central high-risk hub (`A/c 112233`) connected via directional lines to Linked Accounts (blue), Beneficiaries (green), Suspected Mules (orange), and Related Cases (purple).
- **Right Panel:** Selected account details, transaction count, total amount, and action controls (Freeze Account, Flag for Audit).

### 7. Alerts & Investigation (`/alerts`)
- **Filter Tabs:** All Alerts (58), High Risk (24), Under Review (18), Resolved (16).
- **Two-Column Master-Detail:** Left list of alert cards (`AL-001` through `AL-005`) with right-side investigative dossier, spatial radar preview, supporting evidence checklist, and officer assignment controls.

### 8. Security Center (`/security`)
- **KPI Metrics:** Total Logins (1,024), Failed Attempts (18), Suspicious Activity (6), Data Exports (58).
- **Visual Analytics:** Stacked role activity bar chart (Admin, Investigator, Officer) and 98% "System Secure" donut chart.
- **Audit Table:** Immutable event logs with timestamps, investigator IDs, IP addresses, and verification statuses.

### 9. Case Details Modal (`CT-3026-002`)
- Universal modal accessible from Complaints, Dashboard, Map, and Alerts.
- 3-column layout: Case Information & notes editor, Location Prediction radar preview, Model Insights feature breakdown, and quick actions (Generate Report, Assign Officer, Mark as Resolved).
