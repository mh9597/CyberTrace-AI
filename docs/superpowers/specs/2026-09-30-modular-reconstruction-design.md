# Architectural Specification: Modular Reconstruction & Layer Decoupling

- **Date:** 2026-09-30
- **Status:** Approved
- **Scope:** Full End-to-End Modular Refactoring (Backend Layered + Frontend Feature-Sliced + GSD/Ralph Loop)

---

## 1. Problem Context & Graphify Findings

The initial Graphify knowledge graph (`graphify-out/GRAPH_REPORT.md`) identified:
- **God Nodes:** `User` (32 edges) and `log_audit_event()` (17 edges) created high cross-community coupling across route handlers, auth, and business logic.
- **Low Cohesion:** API route handlers directly imported SQLAlchemy sessions and performed manual ORM manipulations alongside HTTP responses.
- **Frontend Page Coupling:** React pages in `frontend/src/pages/` made direct Axios calls rather than utilizing isolated feature hooks.

---

## 2. Target Architecture

### 2.1 Backend: Clean Layered Architecture
```
FastAPI Transport Routers (backend/app/api/routers/)
        │
        ▼ (Dependency Injection)
Application Services (backend/app/services/)
        │
        ▼
Data Access Repositories (backend/app/repositories/)
        │
        ▼
Storage & DB Models (backend/app/models/)
```

1. **`backend/app/repositories/`**:
   - `BaseRepository[T]`: Generic CRUD primitives.
   - `ComplaintRepository`: Handles complaints, evidence files, and case status transitions.
   - `TransactionRepository`: Handles multi-hop transaction logs and mule account queries.
   - `AlertRepository`: Handles real-time investigator alerts and review status notes.
   - `AuditRepository`: Append-only, tamper-evident SHA-256 audit events.
2. **`backend/app/services/`**:
   - `GraphService`: NetworkX directed graph generation, cyclic flow detection, multi-hop fan-out tracing.
   - `PredictionEngine`: Random Forest probability scoring and DBSCAN spatial cash-out clustering.
   - `AlertService`: SLA tracking, freeze triggers, and notification feeds.
   - `AuditService`: SHA-256 verification and immutable chain recording.
3. **Decoupling Contracts**:
   - Introduce `UserPrincipal(user_id, username, role, police_station_id)` value object to replace raw SQLAlchemy `User` ORM passing in service signatures.

### 2.2 Frontend: Feature-Sliced Architecture
```
Route Pages (src/pages/)
        │
        ▼ (Compositions only)
Feature Slices (src/features/{map, network, predictions, complaints, alerts})
        │
        ▼
Dedicated Custom Hooks & Typed API Clients (useMuleNetwork, useForecast, useHotspots)
```

1. Each feature slice in `src/features/<feature>/` manages its own:
   - Components (e.g. `GoogleMapView.jsx`, `MuleGraphCanvas.jsx`, `AlertCard.jsx`).
   - Hooks (e.g. `useMuleNetwork.js`, `useHotspots.js`, `useAlerts.js`).
   - API endpoints (`api.js`).
2. `src/pages/` become clean compose-only views with zero raw Axios invocations.
3. Common shared widgets live in `src/components/common/`.

---

## 3. Non-Conflict Rules & Boundaries

Documented and enforced via:
- [`.agents/rules/architecture-rules.md`](file:///c:/Users/manan/OneDrive/Documents/SIH_PROJECT/CyberTrace-AI/.agents/rules/architecture-rules.md)
- [`ARCHITECTURE_RULES.md`](file:///c:/Users/manan/OneDrive/Documents/SIH_PROJECT/CyberTrace-AI/ARCHITECTURE_RULES.md)

Key constraints:
- **No Layer Skipping:** Routers never touch SQLAlchemy `Session` or raw models directly.
- **No Cross-Feature Imports:** `features/map/` never imports internal sub-components from `features/network/`.
- **Pure Compositions:** Pages compose feature hooks and feature widgets.

---

## 4. Verification & Testing Plan

1. **Backend Verification:**
   - Seed database using `init_db.py`.
   - Execute test queries via all updated router endpoints (`/api/v1/complaints`, `/api/v1/transactions`, `/api/v1/predictions`, `/api/v1/map`, `/api/v1/alerts`).
2. **Frontend Verification:**
   - Execute production bundle build: `npm run build` (confirm zero errors).
   - Verify dev server HMR at `http://localhost:5173`.
3. **Knowledge Graph Verification:**
   - Execute `python scripts/run_graphify_pipeline.py`.
   - Confirm reduced betweenness centrality for `User`, zero collapsed edges, and improved community cohesion scores.
4. **Ralph Loop Autonomous Verification:**
   - Verify that `scripts/ralph-loop.ps1` executes phase validation gates reliably.
