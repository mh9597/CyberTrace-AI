# CyberTrace AI - Architecture & Component Isolation Rules

> **Status:** Active & Enforced  
> **Source:** Generated from Graphify Knowledge Graph Insights & Superpowers Brainstorming

This document establishes the architectural non-conflict guidelines for the CyberTrace AI platform. All modules, backend layers, frontend components, and automated agents must adhere to these rules.

---

## 1. System Communication Architecture

```
                    ┌───────────────────────────────────────────────┐
                    │            Frontend (React 18 + Vite)         │
                    │   Pages  ──>  Feature Slices  ──>  Hooks/API  │
                    └──────────────────────┬────────────────────────┘
                                           │ HTTP / JSON REST
                                           ▼
                    ┌───────────────────────────────────────────────┐
                    │               Backend (FastAPI)               │
                    │   API Routers                                 │
                    │       │                                       │
                    │       ▼ (Dependency Injection)                │
                    │   Application Services (Graph / RF / DBSCAN)  │
                    │       │                                       │
                    │       ▼                                       │
                    │   Repositories (Data Access Layer)            │
                    │       │                                       │
                    │       ▼                                       │
                    │   Database Models (SQLAlchemy ORM)            │
                    └───────────────────────────────────────────────┘
```

---

## 2. Non-Conflict Rules by Layer

### Layer 1: Backend API Routers (`backend/app/api/routers/`)
- **Rule 1.1:** Routers MUST be thin transport adapters.
- **Rule 1.2:** Routers MUST NOT import SQLAlchemy `Session`, raw database models, or execute raw database queries.
- **Rule 1.3:** Routers MUST NOT execute business logic. All calculations, graph traversals, and ML scoring calls must be delegated to the Service layer.

### Layer 2: Backend Application Services (`backend/app/services/`)
- **Rule 2.1:** Services contain pure business domain logic.
- **Rule 2.2:** Services MUST NOT import FastAPI constructs (`Request`, `Response`, `APIRouter`, `HTTPException`). They raise domain exceptions which routers translate into HTTP status codes.
- **Rule 2.3:** Services access database persistence solely via Repositories (`backend/app/repositories/`).
- **Rule 2.4:** Decouple `User` and `AuditLog` God Nodes:
  - Do NOT pass the raw SQLAlchemy `User` ORM model into business services. Use a lightweight `UserPrincipal` value object.
  - Audit logs must be dispatched via `AuditService.record_event()` rather than manual DB insertions in routers.

### Layer 3: Backend Repositories (`backend/app/repositories/`)
- **Rule 3.1:** Encapsulate all database interaction and queries.
- **Rule 3.2:** Repositories MUST NOT import Services or Routers.
- **Rule 3.3:** All repository methods must be atomic or participate in an injected transaction unit of work.

### Layer 4: Frontend Feature Slices (`frontend/src/features/`)
- **Rule 4.1 (No Cross-Feature Coupling):**
  - Features (`map`, `network`, `predictions`, `complaints`, `alerts`, `auth`) are self-contained boundaries.
  - `features/map/` MUST NOT directly import internal components or internal state from `features/network/` or `features/alerts/`.
  - Shared UI widgets (badges, modals, spinners, buttons) MUST live in `src/components/common/`.
- **Rule 4.2 (Pages are Compositions Only):**
  - Files in `src/pages/` MUST NOT make direct Axios `api.get()` calls.
  - Pages compose feature slices and consume feature custom hooks (`useMuleNetwork()`, `useHotspots()`, `useForecast()`).
- **Rule 4.3 (Single Source of Truth for Network Calls):**
  - Each feature defines its network endpoints in `src/features/<feature>/api.js`.

---

## 3. Directory Layout Non-Conflict Map

| Directory | Allowed Imports | Forbidden Imports |
| :--- | :--- | :--- |
| `backend/app/api/routers/` | Services, Schemas, Dependencies | Models, Database Session, Raw SQL |
| `backend/app/services/` | Repositories, Domain Entities, Utils, Schemas | FastAPI Request/Response, Routers |
| `backend/app/repositories/` | Models, Database Engine/Session | Services, Routers, Frontend |
| `backend/app/models/` | SQLAlchemy Base, Column Types | Services, Routers, Repositories |
| `frontend/src/pages/` | Feature components, Feature hooks, Layout | Raw Axios calls, Internal sub-feature files |
| `frontend/src/features/<F>/` | Own components/hooks/api, Common UI components | Other features (`features/<Other>/...`) |

---

## 4. Verification & Continuous Validation

1. **AST & Edge Health**: After modifying or adding files, execute `python scripts/run_graphify_pipeline.py` to confirm no circular imports or dangling endpoints exist.
2. **Autonomous Build Gate**: The Ralph Loop runner (`scripts/ralph-loop.ps1`) verifies `npm run build` and backend test suites before committing or declaring phases complete.
