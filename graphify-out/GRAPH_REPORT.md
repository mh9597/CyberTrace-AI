# Graph Report - CyberTrace-AI  (2026-09-30)

## Corpus Check
- Large corpus: 999 files · ~1,716,956 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 575 nodes · 1534 edges · 59 communities (12 shown, 47 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 93 edges (avg confidence: 0.95)
- Token cost: 1,250 input · 450 output

## Community Hubs (Navigation)
- REST API & Route Handlers
- REST API & Route Handlers
- REST API & Route Handlers
- REST API & Route Handlers
- REST API & Route Handlers
- REST API & Route Handlers
- REST API & Route Handlers
- Database Models & Schemas
- AI & ML Analytics Engine
- REST API & Route Handlers
- React Frontend Application
- Database Models & Schemas
- React Frontend Application
- Security, Auth & Evidence Trail

## God Nodes (most connected - your core abstractions)
1. `react` - 46 edges
2. `UserPrincipal` - 37 edges
3. `lucide-react` - 34 edges
4. `Complaint` - 23 edges
5. `log_audit_event()` - 23 edges
6. `User` - 20 edges
7. `Transaction` - 19 edges
8. `BaseRepository` - 17 edges
9. `GlassCard()` - 16 edges
10. `Alert` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Mule Account Velocity & Fan-out Analysis` --conceptually_related_to--> `NetworkX Multi-Hop Mule Chain Intelligence`  [INFERRED]
  CyberTrace_AI_Project_Blueprint.md → backend/app/services/graph_service.py
- `Cash-Out Point Forecasting (ATM / Branch / POS)` --conceptually_related_to--> `Random Forest Risk Scorer & Velocity Model`  [INFERRED]
  CyberTrace_AI_Project_Blueprint.md → backend/app/services/prediction_engine.py
- `DBSCAN Geospatial Hotspot Clustering` --conceptually_related_to--> `Dual Engine Map (Google Maps JS API + Leaflet OSM)`  [INFERRED]
  CyberTrace_AI_Project_Blueprint.md → frontend/src/features/map/GoogleMapView.jsx
- `list_alerts()` --uses--> `UserPrincipal`  [INFERRED]
  backend/app/api/routes/alerts.py → backend/app/domain/entities.py
- `update_alert_review()` --uses--> `UserPrincipal`  [INFERRED]
  backend/app/api/routes/alerts.py → backend/app/domain/entities.py

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CyberTrace Predictive Pipeline** — concept_mule_account_detection, concept_cashout_forecasting, concept_spatial_dbscan_clustering [INFERRED 0.95]

## Communities (59 total, 47 thin omitted)

### Community 0 - "REST API & Route Handlers"
Cohesion: 0.06
Nodes (57): App(), ConfidenceBar(), DataSufficiencyBanner(), EvidenceBadge(), GlassCard(), MetricCard(), ModalDialog(), RISK_CONFIG (+49 more)

### Community 1 - "REST API & Route Handlers"
Cohesion: 0.08
Nodes (54): get_current_principal(), get_current_user(), Returns decoupled immutable UserPrincipal domain entity., require_role(), generate_prediction(), get_candidate_forecast_zones(), get_case_predictions(), get_hotspot_clusters() (+46 more)

### Community 2 - "REST API & Route Handlers"
Cohesion: 0.09
Nodes (50): get_complaint(), import_transactions_file(), list_complaints(), modify_complaint(), get, patch, post, Session (+42 more)

### Community 3 - "REST API & Route Handlers"
Cohesion: 0.05
Nodes (34): get_alert_repo(), get_audit_repo(), get_complaint_repo(), get_transaction_repo(), Session, init_database_tables(), Session, Create all tables in the database. (+26 more)

### Community 4 - "REST API & Route Handlers"
Cohesion: 0.06
Nodes (45): get_complaint_forensic_dossier(), Any, get, Session, create_statutory_freeze_notice(), get_case_golden_hour(), Any, get (+37 more)

### Community 5 - "REST API & Route Handlers"
Cohesion: 0.05
Nodes (42): dependencies, axios, clsx, @googlemaps/js-api-loader, leaflet, lucide-react, react, react-dom (+34 more)

### Community 6 - "REST API & Route Handlers"
Cohesion: 0.12
Nodes (31): add_note_to_alert(), list_alerts(), get, patch, post, Session, update_alert_review(), check_evidence_integrity() (+23 more)

### Community 7 - "Database Models & Schemas"
Cohesion: 0.14
Nodes (17): CaseSummary, EvidenceSeal, MuleNode, MuleTraceResult, BaseModel, Domain projection of an active cybercrime case., A single node in a multi-hop mule account network., Results from NetworkX mule graph traversal. (+9 more)

### Community 8 - "AI & ML Analytics Engine"
Cohesion: 0.11
Nodes (16): get_all_hotspots(), CyberTrace AI - Automated Test Suite: Accuracy & Architecture Verification…, test_1_ml_accuracy_and_hotspot_density(), graphify_analyze, graphify_build, graphify_cli, graphify_cluster, graphify_detect (+8 more)

### Community 9 - "REST API & Route Handlers"
Cohesion: 0.18
Nodes (14): get_current_officer(), login(), logout(), get, post, Session, create_access_token(), Any (+6 more)

### Community 10 - "React Frontend Application"
Cohesion: 0.35
Nodes (8): Button(), DataTable(), KodeIdentifier(), EmptyState(), Skeleton(), STATUS_CONFIG, StatusChip(), NextStepsPanel()

### Community 11 - "Database Models & Schemas"
Cohesion: 0.29
Nodes (7): CyberTrace AI Architecture Blueprint, Cash-Out Point Forecasting (ATM / Branch / POS), Dual Engine Map (Google Maps JS API + Leaflet OSM), Mule Account Velocity & Fan-out Analysis, NetworkX Multi-Hop Mule Chain Intelligence, Random Forest Risk Scorer & Velocity Model, DBSCAN Geospatial Hotspot Clustering

## Knowledge Gaps
- **52 isolated node(s):** `Config`, `Config`, `Config`, `Config`, `Config` (+47 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 217 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **47 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `UserPrincipal` connect `REST API & Route Handlers` to `REST API & Route Handlers`, `REST API & Route Handlers`, `REST API & Route Handlers`, `Database Models & Schemas`, `AI & ML Analytics Engine`?**
  _High betweenness centrality (0.056) - this node is a cross-community bridge._
- **Why does `react` connect `REST API & Route Handlers` to `React Frontend Application`, `REST API & Route Handlers`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `log_audit_event()` connect `REST API & Route Handlers` to `REST API & Route Handlers`, `REST API & Route Handlers`, `REST API & Route Handlers`, `REST API & Route Handlers`, `REST API & Route Handlers`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Are the 18 inferred relationships involving `UserPrincipal` (e.g. with `add_note_to_alert()` and `list_alerts()`) actually correct?**
  _`UserPrincipal` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Config`, `Config`, `Config` to the rest of the system?**
  _52 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `REST API & Route Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.05847029077117573 - nodes in this community are weakly interconnected._
- **Should `REST API & Route Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.07601880877742946 - nodes in this community are weakly interconnected._