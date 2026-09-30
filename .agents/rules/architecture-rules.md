# CyberTrace AI - Architecture & Component Non-Conflict Rules

These rules are enforced across the entire repository to prevent file collisions, circular dependencies, God-node coupling, and architectural drift.

---

## 1. Backend Layered Isolation Rules

The backend follows a strict one-way dependency flow:
```
Transport (API Routers) ──> Application (Services) ──> Data Access (Repositories) ──> Storage (Models/DB)
```

### Rule 1.1: Strict Layer Discipline (No Layer Skipping)
- **Routers (`backend/app/api/routers/`)**:
  - **MAY** import: Pydantic schemas, application services, and FastAPI dependency injectors.
  - **MUST NEVER** import: SQLAlchemy `Session`, raw DB models, or execute SQL queries directly.
  - Role: Validate HTTP requests, invoke the appropriate service method, and serialize HTTP responses.
- **Services (`backend/app/services/`)**:
  - **MAY** import: Repositories, domain entities, ML models, and helper algorithms.
  - **MUST NEVER** import: FastAPI `Request`, `Response`, `APIRouter`, or HTTP-specific exceptions.
  - Role: Contain pure business logic (NetworkX graph traversal, Random Forest risk scoring, DBSCAN clustering, SHA-256 evidence sealing).
- **Repositories (`backend/app/repositories/`)**:
  - **MAY** import: SQLAlchemy models, DB sessions, and domain entities.
  - **MUST NEVER** import: Application services or API routers.
  - Role: Encapsulate all database queries, joins, filters, and persistence operations.
- **Models (`backend/app/models/`)**:
  - Pure SQLAlchemy table definitions. No business logic or external service imports.

### Rule 1.2: God-Node Decoupling (`User` & `AuditLog`)
- Do **NOT** pass the full SQLAlchemy `User` ORM instance across service layers.
- Use a lightweight, immutable value object:
  ```python
  class UserPrincipal(BaseModel):
      id: int
      username: str
      role: str
      police_station_id: str | None = None
  ```
- **Audit Logging** must be invoked via `AuditService.record_event()` or middleware, never by manually instantiating and inserting `AuditLog` rows inside functional routers.

---

## 2. Frontend Feature-Sliced Isolation Rules

The frontend follows Feature-Sliced Architecture:
```
App / Routes ──> Pages (Compositions) ──> Feature Slices ──> Common Components / Services
```

### Rule 2.1: No Cross-Feature Imports
- Features live in `src/features/<feature_name>/`:
  - `features/auth/`
  - `features/complaints/`
  - `features/network/`
  - `features/predictions/`
  - `features/map/`
  - `features/alerts/`
- **FORBIDDEN**: `features/map/` must **NEVER** import directly from `features/network/` or `features/alerts/`.
- **ALLOWED**: If two features share UI widgets or data logic, extract the shared component to `src/components/common/` or `src/context/`.

### Rule 2.2: Pages Are Pure Compositions
- Files in `src/pages/` (e.g. `IntelligenceMap.jsx`, `TransactionNetwork.jsx`) are composition shells only.
- Pages **MUST NOT**:
  - Make raw `api.get()` / `api.post()` Axios calls directly.
  - Maintain massive internal state machines.
- Pages **MUST**:
  - Consume feature hooks (e.g. `useMuleNetwork()`, `useHotspots()`, `useAlerts()`).
  - Assemble feature components (`<GoogleMapView />`, `<MuleGraphCanvas />`).

### Rule 2.3: Single Source of Truth for API Contracts
- Every feature slice must define its API calls in `src/features/<feature>/api.js`.
- React components must never contain inline API URLs or query strings.

---

## 3. File Naming & Export Conventions

To eliminate file collision and import confusion:
| Asset Type | Convention | Example |
| :--- | :--- | :--- |
| React Components | `PascalCase.jsx` | `GoogleMapView.jsx`, `AlertReviewModal.jsx` |
| React Custom Hooks | `camelCase.js` (prefixed with `use`) | `useMuleNetwork.js`, `useForecast.js` |
| Frontend Services & Utils | `camelCase.js` | `api.js`, `formatCurrency.js` |
| Python Modules & Services | `snake_case.py` | `graph_service.py`, `prediction_engine.py` |
| Python Classes & Models | `PascalCase` | `ComplaintRepository`, `PredictionEngine` |
| Pydantic Schemas | `snake_case.py` with `Schema` suffix | `ComplaintCreate`, `MuleChainResponse` |

---

## 4. Graphify & Knowledge Graph Integrity

- Every architectural refactoring must maintain AST extractability.
- Avoid circular imports (`A -> B -> A`).
- Run `python scripts/run_graphify_pipeline.py` after structural updates to verify edge health and ensure no dangling endpoints or edge collapses occur.

---

## 5. Ralph Loop & GSD Integration

- Multi-step tasks must be tracked in `.planning/ROADMAP.md` and `.planning/STATE.md`.
- Autonomous loops (`scripts/ralph-loop.ps1`) must check verification tests and build passes (`npm run build`, `pytest`) before marking any milestone phase as complete.
