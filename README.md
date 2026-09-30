# CyberTrace AI — Predictive Cybercrime Intelligence Platform
> **SIH 2026 | Problem Statement SIH26184**  
> *Development of a Predictive Analytics Framework for Cybercrime Complaints to Forecast Likely Cash Withdrawal Locations in Advance, Enabling Generation of Actionable Intelligence for Timely and Proactive Cybercrime Intervention.*

---

## 🛡️ Executive Summary & Legal Notice
**CyberTrace AI** transforms authorized cybercrime complaints and transaction trails into explainable, location-based investigative leads.
- **Demo Mode:** All demo data is strictly **synthetic**.
- **Human-in-the-Loop:** Predictions are probabilistic investigative leads, not automated convictions or account freezes. Consequential decisions must be made by authorized officers.

---

## 🏛️ System Architecture

```text
Investigator / Admin
        │
        ▼
React + Tailwind CSS Frontend (Vite)
        │ (REST API / JWT)
        ▼
FastAPI Backend (Python 3.14)
        ├── Authentication & RBAC (Admin, Investigator, Senior Officer)
        ├── Complaint Management & Case Ingestion
        ├── Multi-Hop Transaction Pipeline (NetworkX)
        ├── AI Cash-out Prediction Engine (Random Forest + DBSCAN)
        ├── Alert Review & Investigation Workflow
        └── Cryptographic Evidence Hashing (SHA-256) & Audit Vault
        │
        ▼
PostgreSQL / PostGIS (with automatic SQLite development fallback)
```

---

## 🚀 Quick Start Guide

### 1. Backend (FastAPI)
```powershell
# Navigate to backend and install requirements
cd backend
python -m pip install -r requirements.txt

# Start the API server
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
* **Swagger API Documentation:** `http://localhost:8000/api/docs`
* **Alternative ReDoc:** `http://localhost:8000/api/redoc`

### 2. Frontend (React + Vite)
```powershell
cd frontend
cmd.exe /c "npm install"
cmd.exe /c "npm run dev"
```
* **Application URL:** `http://localhost:5173`

---

## 🔑 Demo Access Roles & Credentials

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Investigator** | `investigator@cybertrace.gov.in` | `Investigator@123` | Case registration, transaction import, prediction execution, alert review |
| **Senior Officer**| `senior.officer@cybertrace.gov.in`| `Officer@123` | High-priority alert authorizations, cross-hub intelligence |
| **Admin** | `admin@cybertrace.gov.in` | `Admin@123` | Full administrative controls, audit log inspection |

---

## 📁 Project Structure

```text
CyberTrace-AI/
├── backend/
│   ├── app/
│   │   ├── api/routes/          # Auth, Complaints, Transactions, Predictions, Alerts, Security
│   │   ├── core/                # Configuration & JWT/password security
│   │   ├── db/                  # Database engine & synthetic seed data
│   │   ├── models/              # SQLAlchemy entities (Complaints, Transactions, etc.)
│   │   ├── schemas/             # Pydantic v2 validation contracts
│   │   └── services/            # Random Forest scoring, DBSCAN hotspots, NetworkX graph
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/layout/   # Navbar, Sidebar, Layout
│   │   ├── context/             # AuthContext with role detection
│   │   ├── pages/               # Dashboard, Complaints, Predictions, Map, Network, Alerts, Security
│   │   ├── routes/              # React Router v6 route configuration
│   │   └── services/            # Axios API interceptor
│   └── package.json
├── scripts/
│   └── ralph-loop.ps1           # Windows PowerShell Ralph Loop runner
├── docker-compose.yml           # Multi-container PostgreSQL PostGIS deployment
└── CyberTrace_AI_Project_Blueprint.md
```
