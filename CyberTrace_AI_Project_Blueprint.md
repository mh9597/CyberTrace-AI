# CyberTrace AI — Complete Project Blueprint
## SIH 2026 | Problem Statement SIH26184

**Project Title:** CyberTrace AI — Secure Predictive Cybercrime Intelligence & Cash-out Forecasting Platform

**Purpose:** Build a web-based intelligence platform that analyzes cybercrime complaints and authorized transaction records, identifies suspicious transaction patterns, forecasts candidate cash-out locations/time windows, and presents actionable leads to authorized investigators.

> Important: All demo data must be synthetic. Real banking, telecom, ATM, or law-enforcement data must only be used through authorized access and approved data-sharing arrangements. Predictions are investigative leads, not proof. Human officers make all consequential decisions.

---

# 1. Problem Statement

Development of a Predictive Analytics Framework for Cybercrime Complaints to Forecast Likely Cash Withdrawal Locations in Advance, Enabling Generation of Actionable Intelligence for Timely and Proactive Cybercrime Intervention.

## Problem Overview

In online financial fraud, money may move through multiple accounts, mule accounts, wallets, or other transaction channels before being withdrawn or transferred. Investigators may need to review complaint details, transaction trails, account relationships, and geographical information under time pressure.

CyberTrace AI aims to convert available, authorized data into structured intelligence by identifying suspicious patterns and forecasting possible cash-out zones and time windows.

The system does not independently track live bank accounts or know a suspect's actual location. Its accuracy depends on reliable, sufficiently complete, and appropriately labeled historical data.

# 2. End-to-End Scenario

Use this fictional scenario for the prototype demo:

1. A victim reports a UPI/payment fraud of ₹50,000.
2. An investigator registers the complaint with a unique case ID and enters the available transaction reference, timestamp, amount, and fraud type.
3. The system validates the complaint and imports synthetic transaction records.
4. The transaction processor cleans records, detects duplicates/missing fields, sorts events by time, and links related transactions using authorized identifiers.
5. The analytics engine identifies patterns such as rapid transfers, repeated recipients, unusual transaction sequences, and historical withdrawal-pattern matches.
6. The prediction engine returns candidate cash-out zones, estimated time windows, risk estimates, uncertainty, and supporting factors when the required labeled data is available.
7. The GIS dashboard displays candidate zones separately from historical hotspots.
8. An authorized investigator reviews the evidence, verifies the lead through proper channels, and records a decision.
9. The outcome is captured for evaluation and future model improvement.

Example case (fictional):
- Complaint ID: CT-2026-001
- Fraud type: UPI/payment fraud
- Amount: ₹50,000
- Transaction time: 2026-09-29 10:15
- Reference: TXN-DEMO-001
- Status: New

Do not represent fictional locations, predictions, accounts, or performance numbers as real-world findings.

# 3. Product Scope

## Core features to build first

### A. Cybercrime Complaint Management
- Create a complaint with a unique complaint ID.
- Capture fraud type, amount, timestamp, transaction references, available account identifiers, and case notes.
- Import CSV/JSON transaction files.
- Search, sort, and filter complaints.
- Track case status: New, Under Analysis, Alert Generated, Under Investigation, Resolved, or Dismissed.
- Validate required fields and safely handle malformed uploads.

### B. Transaction Intelligence and Data Processing
- Validate schema and data types.
- Detect duplicate records and missing values.
- Normalize timestamps and transaction amounts.
- Sort transaction events chronologically.
- Link transactions by authorized account identifiers and transaction references.
- Detect patterns such as rapid fund movement, repeated recipients, multiple transfers, and unusual withdrawal sequences.
- Preserve source references and data provenance for each derived finding.

### C. AI Cash-out Prediction Engine
The prediction engine is the primary AI/ML component.

Recommended initial approach:
- Scikit-learn Random Forest as a baseline supervised model.
- DBSCAN for clustering historical geospatial withdrawal points and identifying hotspots.
- NetworkX for account/transaction relationship analysis.
- Pandas and NumPy for data preparation and feature engineering.

Potential model inputs, subject to data availability and authorization:
- Transaction amount and timestamps.
- Number and sequence of transfers.
- Historical withdrawal records.
- Historical ATM/withdrawal coordinates or zones.
- Account activity patterns and time intervals.
- Distance or relationship to previously observed transaction events.

Potential outputs:
- Candidate cash-out zones.
- Estimated time window.
- Calibrated risk/probability estimate where calibration is supported.
- Uncertainty and data freshness.
- Supporting features or evidence.
- Model version and prediction timestamp.

Do not call a raw model score a calibrated probability unless calibration has been tested. Do not promise a guaranteed location or withdrawal. If there are no labeled historical cash-out outcomes, present the output as historical hotspot/heuristic analysis and clearly label it as such, not validated forecasting.

### D. Geospatial Intelligence Map
- Use Leaflet with OpenStreetMap.
- Display historical hotspots and predicted candidate zones as separate layers.
- Show ATM/withdrawal points only if present in authorized data.
- Add filters for date, case, fraud type, and risk band.
- On marker click, show the related complaint, supporting records, time window, uncertainty, and data source.
- Clearly label synthetic/demo data in the interface.

### E. Transaction Network Visualization
- Nodes: complaints, accounts, transactions, and authorized entities.
- Edges: transfers or documented relationships.
- Show amount, timestamp, and source for each transaction edge.
- Highlight connected records and possible cross-complaint links for officer review.
- Use NetworkX for analysis and a React-compatible graph visualization library for display.
- Consider Neo4j only if graph scale later justifies it.

### F. Alerts and Investigation Workflow
- Create an alert only when configured criteria are met.
- Include alert ID, complaint ID, candidate zone, estimated time window, risk estimate, supporting evidence, uncertainty, model version, and timestamp.
- Allow authorized officers to assign, review, add notes, verify, dismiss, or resolve alerts.
- Keep a record of who changed a case and when.
- Do not automatically freeze accounts, accuse individuals, or initiate enforcement actions.

### G. Security Center
- Role-based access: Admin, Investigator, Senior Officer.
- Authentication with securely hashed passwords (Argon2 or bcrypt).
- JWT-based session/authentication approach with appropriate expiry and secure handling.
- Enforce authorization on the backend for every protected endpoint.
- Use HTTPS/TLS in deployment.
- Encrypt sensitive data at rest and manage keys securely.
- Validate and sanitize all inputs; enforce upload size/type limits.
- Add API rate limiting and safe error responses.
- Use SHA-256 hashes to check uploaded evidence integrity; a hash does not prove that the source evidence is truthful.
- Maintain protected audit logs for logins, access, exports, edits, and investigation decisions.
- Never put secrets or API keys in frontend code or commit them to Git.

# 4. Application Pages

1. **Dashboard**
   - Complaint counts and status summary.
   - Recent alerts and case activity.
   - Model evaluation summary and data freshness.
   - Clearly distinguish demo data from real data.

2. **Complaints**
   - Register, upload, search, filter, and view cases.
   - Complaint details, transaction records, notes, and status.

3. **Prediction Center**
   - Select a case and run analysis.
   - Display candidate zones, time windows, risk estimate, uncertainty, evidence, and model version.
   - Show a warning if data is insufficient for a valid forecast.

4. **Intelligence Map**
   - Historical hotspots and forecast candidates in separate layers.
   - Filters, map markers, and evidence details.

5. **Transaction Network**
   - Interactive graph of transaction chains and related accounts.
   - Click nodes/edges to view available record details.

6. **Alerts & Investigation**
   - Alert queue, assignment, review, decision, notes, and resolution.

7. **Security Center**
   - User roles, access logs, security events, evidence hashes, and audit history.

# 5. Recommended Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend/API | Python + FastAPI |
| Database | PostgreSQL |
| Geospatial database | PostGIS |
| Data processing | Pandas + NumPy |
| Machine learning | Scikit-learn Random Forest |
| Geospatial clustering | DBSCAN |
| Transaction graph analysis | NetworkX |
| Interactive map | Leaflet + OpenStreetMap |
| Charts | Recharts |
| Authentication | JWT + Argon2/bcrypt |
| Version control | Git + GitHub |

Avoid adding Kafka, Redis, Celery, Neo4j, deep learning, or an LLM chatbot to the first version unless the core system is already complete and the team has time.

# 6. High-Level Architecture

```text
Investigator / Admin
        |
        v
React + Tailwind Frontend
        |
        v
FastAPI Backend
        |
        +---- Authentication & RBAC
        |
        +---- Complaint Management
        |
        +---- Transaction Processing
        |           |
        |           v
        |     PostgreSQL + PostGIS
        |
        +---- Analytics / ML Engine
        |           |
        |           +---- Random Forest
        |           +---- DBSCAN hotspot analysis
        |           +---- NetworkX graph analysis
        |           |
        |           v
        |     Prediction / Intelligence Results
        |
        +---- Alerts & Investigation Workflow
        |
        +---- Audit Logs & Evidence Integrity
                    |
                    v
             PostgreSQL + PostGIS
```

# 7. Suggested Database Entities

Design the schema based on the minimum required data and privacy principles. Avoid storing unnecessary personal information.

Potential tables:
- `users`: user ID, name/display name, role, password hash, status, created timestamp.
- `complaints`: complaint ID, fraud type, amount, reported timestamp, status, assigned user, notes, created timestamp.
- `transactions`: transaction ID, complaint ID, source reference, pseudonymized account identifiers, amount, timestamp, transaction type, optional authorized location fields.
- `predictions`: prediction ID, complaint ID, model version, candidate zone, time window, risk estimate, uncertainty, supporting factors, created timestamp.
- `alerts`: alert ID, prediction ID, assigned officer, review status, decision notes, updated timestamp.
- `evidence_files`: evidence ID, complaint ID, file metadata, storage reference, SHA-256 hash, uploader, timestamp.
- `audit_logs`: user ID, action, target record, timestamp, outcome, and appropriate security metadata.

Use database constraints, indexes, parameterized queries/ORM, and least-privilege database credentials. Never use real bank/account data in a public demo.

# 8. API Endpoint Suggestions

Example API routes; adjust as implementation evolves:

```text
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

POST   /api/complaints
GET    /api/complaints
GET    /api/complaints/{complaint_id}
PATCH  /api/complaints/{complaint_id}
POST   /api/complaints/{complaint_id}/transactions/import

GET    /api/complaints/{complaint_id}/transactions
GET    /api/complaints/{complaint_id}/network
POST   /api/complaints/{complaint_id}/predict
GET    /api/complaints/{complaint_id}/predictions

GET    /api/map/hotspots
GET    /api/map/candidate-zones

GET    /api/alerts
PATCH  /api/alerts/{alert_id}
POST   /api/alerts/{alert_id}/notes

GET    /api/security/audit-logs
GET    /api/security/evidence/{evidence_id}/integrity
```

Every protected route must enforce authentication and server-side role authorization. Validate path parameters, request bodies, and uploaded files.

# 9. Model Evaluation and Responsible Use

Use a time-aware train/validation/test split to avoid leakage from future events into training data. Where possible, evaluate on cases or time periods not used during training.

Report:
- Precision and recall.
- PR-AUC for imbalanced fraud data.
- False-alert rate.
- Geographical distance/error between predicted and observed locations.
- Lead time between forecast and observed withdrawal, where timestamps exist.
- Calibration and uncertainty, if probabilities are shown.
- Performance by relevant data segment, where sample sizes permit.

Record model version, training data version, evaluation date, and limitations.

A successful demo should show the complete workflow and honest evaluation. Do not invent accuracy percentages, recovered-money amounts, live integrations, or confirmed predictions.

# 10. Advanced Features — Phase 2

Build only after the core application is working:

1. **Explainable AI (SHAP):** show which features contributed to a model output.
2. **Investigation Copilot (RAG/LLM):** summarize case records and answer investigator questions with evidence citations and human review.
3. **Cross-complaint intelligence:** identify potentially connected cases through shared, authorized identifiers and graph patterns.
4. **Model drift monitoring:** track changes in input distributions and model performance; flag the need for review/retraining.
5. **Intervention simulation:** analyze historical cases to compare hypothetical intervention timings; label results as simulations, not actual recovered funds.
6. **Dynamic re-prediction:** update candidate leads when new verified and authorized transaction events arrive.

# 11. Four-Week Development Plan

## Week 1 — Foundation
- Create React + Tailwind frontend and shared layout.
- Build dashboard and complaint form.
- Set up FastAPI and PostgreSQL.
- Define database schema and synthetic demo data.
- Implement complaint CRUD and CSV/JSON import.

## Week 2 — Data and ML
- Implement validation and data cleaning.
- Build transaction-chain analysis.
- Train and evaluate a Random Forest baseline if labeled data is available.
- Implement DBSCAN historical hotspot analysis.
- Create prediction result schema and insufficient-data handling.

## Week 3 — GIS, Graph, and Security
- Integrate Leaflet/OpenStreetMap.
- Build transaction network visualization.
- Implement alert review workflow.
- Add authentication, RBAC, input validation, audit logs, and evidence hashing.

## Week 4 — Integration and Demo
- Connect frontend and backend end-to-end.
- Test access controls, uploads, error handling, and core workflows.
- Evaluate the model honestly using held-out data.
- Prepare synthetic demo cases and presentation.
- Document limitations, deployment, and future scope.

# 12. Demo Walkthrough

1. Log in as an authorized investigator.
2. Register the fictional ₹50,000 complaint.
3. Import synthetic transaction records.
4. Show the linked transaction chain and suspicious patterns.
5. Run the prediction/hotspot analysis.
6. Show candidate zones, time window, uncertainty, and supporting factors.
7. Open the map and transaction graph.
8. Review and update an alert.
9. Open the Security Center to show role restrictions, audit history, and evidence integrity.
10. Show evaluation metrics from the available labeled synthetic/test dataset, clearly labeled as prototype results.

# 13. Out of Scope for the Initial Prototype

- Direct access to live bank, NPCI, telecom, ATM, or police systems without formal authorization.
- Real-time tracking of a person's location.
- Guaranteed prediction of an ATM, person, or withdrawal.
- Automatic account freezes, arrests, or accusations.
- Claims of actual recovery of funds without verified evidence.
- Training on personal or financial data without a lawful basis and approved safeguards.

# Final Project Summary

CyberTrace AI is a secure, AI-assisted cybercrime intelligence platform that transforms authorized complaint and transaction data into explainable, location-based investigative leads. It combines complaint management, transaction analysis, machine learning, geospatial visualization, transaction-network analysis, alerts, and evidence/security controls in one application.

The core value is earlier, better-informed human investigation—not autonomous law enforcement or guaranteed prediction.
