# CyberTrace AI - Development Roadmap

## Milestone 1: Modular Reconstruction & Clean Layering (Completed)

- [x] **Phase 1: Architecture Non-Conflict Contract & Tooling**
  - [x] Run Graphify Knowledge Graph to detect God Nodes and edge collapse.
  - [x] Create `.agents/rules/architecture-rules.md` and root `ARCHITECTURE_RULES.md`.
  - [x] Scaffold GSD planning suite (`PROJECT.md`, `ROADMAP.md`, `STATE.md`).

- [x] **Phase 2: Backend Repository Layer & God-Node Decoupling**
  - [x] Implement `backend/app/repositories/` (Base, Complaint, Transaction, Alert, Audit).
  - [x] Extract `UserPrincipal` value object in `backend/app/domain/entities.py` to decouple `User` ORM model.
  - [x] Refactor `backend/app/api/routes/` to inject `UserPrincipal` and repositories via dependency injection.

- [x] **Phase 3: Frontend Feature-Sliced Extraction & Custom Hooks**
  - [x] Create feature API clients and hooks (`features/map/api.js`, `features/map/useHotspots.js`).
  - [x] Decouple pages (`IntelligenceMap.jsx`) from direct Axios requests.
  - [x] Verify Google Maps functional API and Leaflet fallback under modular imports.

- [x] **Phase 4: Verification, AST Graph Update & Ralph Loop Integration**
  - [x] Run backend endpoints verification (`/api/complaints`, `/api/alerts`, `/api/security/audit-logs`).
  - [x] Execute `npm run build` production check (clean exit code 0).
  - [x] Re-run `python scripts/run_graphify_pipeline.py` (indexed 449 nodes, 1069 edges, 60 communities).
  - [x] Validate Ralph Loop runner (`scripts/ralph-loop.ps1`).

---

## Milestone 2: Golden Hour Intercept, Tactical Field Patrol & Court Dossier (Pillars 1, 3, 4 - Completed)

- [x] **Phase 1: Pillar 1 - Golden Hour SLA Countdown & Statutory Freeze Notice Engine**
  - [x] Implement `NoticeService` (`calculate_golden_hour_status`, `generate_bank_freeze_notice`, `BANK_NODAL_DIRECTORY`).
  - [x] Mount FastAPI routes `/api/complaints/{id}/golden-hour` and `/api/complaints/{id}/freeze-notice`.
  - [x] Build frontend `GoldenHourTimer.jsx` with real-time pulsing progress bar and tiered SLA windows.
  - [x] Build frontend `BankFreezeModal.jsx` with Section 94 BNSS / Section 91 CrPC advisory generation, bank nodal directory routing, and SHA-256 seal.

- [x] **Phase 2: Pillar 3 - Tactical Patrol GPS Routing & Intercept Dispatch**
  - [x] Implement `PatrolService` (`TACTICAL_POLICE_UNITS`, `haversine_distance_km`, `get_nearby_patrol_units`, `dispatch_patrol_unit`).
  - [x] Mount FastAPI routes `/api/map/patrol/units` and `/api/map/patrol/dispatch`.
  - [x] Extend `features/map/GoogleMapView.jsx` to render tactical patrol markers, directional intercept polylines to candidate cash-out perimeters, and `FieldInterceptCard.jsx`.
  - [x] Update `IntelligenceMap.jsx` to pass `patrolUnits` to Google Maps Engine.

- [x] **Phase 3: Pillar 4 - Court-Admissible Electronic Dossier & BSA 63 Certificate**
  - [x] Implement `DossierService` (`generate_forensic_dossier` with Section 63 BSA / Section 65B IEA sworn certificate and Master SHA-256 fingerprint).
  - [x] Mount FastAPI route `/api/complaints/{id}/dossier`.
  - [x] Build frontend `ForensicDossierModal.jsx` with sworn certificate, multi-hop laundering timeline, and printable court dossier layout.
  - [x] Mount quick action buttons and modals in `ComplaintDetails.jsx`.

- [x] **Phase 4: Automated Testing & Ralph Loop Verification**
  - [x] Implement `backend/tests/test_pillars_integration.py`.
  - [x] Execute autonomous verification under `scripts/ralph-loop.ps1` (100% pass on iteration 1).
  - [x] Validate production build via `npm run build` (clean exit code 0).
  - [x] Re-run `python scripts/run_graphify_pipeline.py` (indexed 522 nodes, 1317 edges, 61 communities).
