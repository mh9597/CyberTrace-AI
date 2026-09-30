# CyberTrace AI - Project Definition

## 1. Problem Statement
- **Id & Title:** SIH 2026 Problem Statement SIH26184: Predictive Cybercrime Intelligence & Cash-out Forecasting Platform.
- **Objective:** Proactive detection of mule account networks and predictive forecasting of physical/digital cash-out locations (ATMs, branch counters, crypto rails) to empower law enforcement agencies (LEAs) before defrauded funds are dissipated.

## 2. Core Architectural Principles
- **Clean Layered Architecture (Backend):**
  - Routers (`backend/app/api/routers/`) ➔ Services (`backend/app/services/`) ➔ Repositories (`backend/app/repositories/`) ➔ Database Models (`backend/app/models/`).
  - Decoupled `User` and `AuditLog` God Nodes via domain value objects.
- **Feature-Sliced Architecture (Frontend):**
  - Autonomous feature packages: `features/map/`, `features/network/`, `features/predictions/`, `features/complaints/`, `features/alerts/`.
  - Zero raw HTTP calls in `pages/`; all communication encapsulated in custom hooks and feature API clients.
- **Dual Map Engine:**
  - Google Maps JavaScript API (dark tactical vector rendering) with instant fallback to OpenStreetMap (Leaflet).
- **Security & Integrity:**
  - Role-Based Access Control (Analyst, Investigator, Admin).
  - SHA-256 evidence chain verification with tamper-evident audit logging.
- **Synthetic Data Compliance:**
  - Strictly synthetic demo data (CT-2026-001 demo case) with no live PII or banking credentials.

## 3. Technology Stack
- **Backend:** FastAPI, Python 3.12, SQLAlchemy, SQLite/PostgreSQL, NetworkX, Scikit-learn (RandomForest, DBSCAN).
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons, Vis-Network, Google Maps JS API Loader, React-Leaflet.
- **Intelligence Tools:** Graphify, Ralph Loop (`scripts/ralph-loop.ps1`), GSD Core.
