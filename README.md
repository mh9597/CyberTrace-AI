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

---

## 🔐 Google OAuth 2.0 & SMTP Email Verification

CyberTrace AI supports native Google Sign-In with device account selection and 2FA SMTP email verification for newly onboarding law enforcement personnel.

### 1. Google OAuth Setup
1. Create OAuth credentials in the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Set application type to **Web application**.
3. Add `http://localhost:5173` under **Authorized JavaScript origins**.
4. Set in [`frontend/.env`](file:///d:/CyberTrace-AI-main/frontend/.env):
   ```env
   VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   ```

### 2. SMTP Verification Setup (Gmail App Password)
1. Enable 2-Step Verification on your Google Account.
2. Generate a 16-character App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
3. Set in [`.env`](file:///d:/CyberTrace-AI-main/.env):
   ```env
   SMTP_ENABLED=True
   SMTP_SERVER=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_16_char_app_password
   SMTP_FROM_EMAIL=your_email@gmail.com
   ```
4. New officers signing in with Google receive a 6-digit OTP in their Gmail inbox to verify their identity before activating their badge credentials.

