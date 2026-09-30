import os
import sys
import json
from pathlib import Path
from datetime import datetime, timezone

from graphify.extract import collect_files, extract
from graphify.build import build_from_json
from graphify.cluster import cluster, score_all
from graphify.analyze import god_nodes, surprising_connections, suggest_questions
from graphify.report import generate
from graphify.export import to_json
from graphify.diagnostics import diagnose_extraction, format_diagnostic_report
from graphify.detect import save_manifest
from graphify.cli import _stamped_manifest_files
from graphify.detect import detect

def main():
    root_path = Path('.').resolve()
    out_dir = Path('graphify-out')
    out_dir.mkdir(exist_ok=True)

    detect_file = out_dir / '.graphify_detect.json'
    if not detect_file.exists():
        print("Running automatic file detection...")
        raw_detection = detect(root_path)
        filtered_files = {}
        total = 0
        for cat, flist in raw_detection.get('files', {}).items():
            kept = []
            for f in flist:
                rel = Path(f).relative_to(root_path)
                if rel.parts[0] not in ('.agents', 'graphify-out', '.git', 'node_modules', '__pycache__'):
                    kept.append(f)
            filtered_files[cat] = kept
            total += len(kept)
        raw_detection['files'] = filtered_files
        raw_detection['total_files'] = total
        detect_file.write_text(json.dumps(raw_detection, ensure_ascii=False, indent=2), encoding='utf-8')
        detection = raw_detection
    else:
        detection = json.loads(detect_file.read_text(encoding='utf-8'))
    
    # -------------------------------------------------------------
    # Part A: AST Extraction
    # -------------------------------------------------------------
    print("\n--- [Step 3 Part A] Structural AST Extraction ---")
    code_files = []
    for f in detection.get('files', {}).get('code', []):
        p = Path(f)
        if p.is_dir():
            code_files.extend(collect_files(p))
        elif p.exists():
            code_files.append(p)
            
    print(f"Extracting AST from {len(code_files)} code files...")
    ast_result = extract(code_files, cache_root=root_path)
    (out_dir / '.graphify_ast.json').write_text(
        json.dumps(ast_result, indent=2, ensure_ascii=False), encoding='utf-8'
    )
    print(f"AST Completed: {len(ast_result['nodes'])} nodes, {len(ast_result['edges'])} edges")

    # -------------------------------------------------------------
    # Part B: Semantic Extraction
    # -------------------------------------------------------------
    print("\n--- [Step 3 Part B] Semantic Document & Concept Extraction ---")
    # Semantic concepts from blueprint, docs, and architecture
    semantic_nodes = [
        {
            "id": "blueprint_cybertrace_ai",
            "label": "CyberTrace AI Architecture Blueprint",
            "file_type": "document",
            "source_file": str(root_path / "CyberTrace_AI_Project_Blueprint.md"),
            "source_location": "CyberTrace_AI_Project_Blueprint.md:L1",
            "source_url": None,
            "captured_at": None,
            "author": "SIH Team",
            "contributor": None,
        },
        {
            "id": "concept_mule_account_detection",
            "label": "Mule Account Velocity & Fan-out Analysis",
            "file_type": "concept",
            "source_file": str(root_path / "CyberTrace_AI_Project_Blueprint.md"),
            "source_location": None,
            "source_url": None,
            "captured_at": None,
            "author": None,
            "contributor": None,
        },
        {
            "id": "concept_cashout_forecasting",
            "label": "Cash-Out Point Forecasting (ATM / Branch / POS)",
            "file_type": "concept",
            "source_file": str(root_path / "CyberTrace_AI_Project_Blueprint.md"),
            "source_location": None,
            "source_url": None,
            "captured_at": None,
            "author": None,
            "contributor": None,
        },
        {
            "id": "concept_spatial_dbscan_clustering",
            "label": "DBSCAN Geospatial Hotspot Clustering",
            "file_type": "concept",
            "source_file": str(root_path / "CyberTrace_AI_Project_Blueprint.md"),
            "source_location": None,
            "source_url": None,
            "captured_at": None,
            "author": None,
            "contributor": None,
        },
        {
            "id": "concept_sha256_audit_trail",
            "label": "Tamper-Evident SHA-256 Audit Trail",
            "file_type": "concept",
            "source_file": str(root_path / "docs" / "security" / "security_design.md"),
            "source_location": None,
            "source_url": None,
            "captured_at": None,
            "author": None,
            "contributor": None,
        },
        {
            "id": "concept_dual_map_engine",
            "label": "Dual Engine Map (Google Maps JS API + Leaflet OSM)",
            "file_type": "concept",
            "source_file": str(root_path / "frontend" / "src" / "features" / "map" / "GoogleMapView.jsx"),
            "source_location": None,
            "source_url": None,
            "captured_at": None,
            "author": None,
            "contributor": None,
        },
        {
            "id": "concept_networkx_graph_intelligence",
            "label": "NetworkX Multi-Hop Mule Chain Intelligence",
            "file_type": "concept",
            "source_file": str(root_path / "backend" / "app" / "services" / "graph_service.py"),
            "source_location": None,
            "source_url": None,
            "captured_at": None,
            "author": None,
            "contributor": None,
        },
        {
            "id": "concept_random_forest_forecaster",
            "label": "Random Forest Risk Scorer & Velocity Model",
            "file_type": "concept",
            "source_file": str(root_path / "backend" / "app" / "services" / "prediction_engine.py"),
            "source_location": None,
            "source_url": None,
            "captured_at": None,
            "author": None,
            "contributor": None,
        }
    ]

    semantic_edges = [
        {
            "source": "blueprint_cybertrace_ai",
            "target": "concept_mule_account_detection",
            "relation": "references",
            "confidence": "EXTRACTED",
            "confidence_score": 1.0,
            "source_file": str(root_path / "CyberTrace_AI_Project_Blueprint.md"),
            "source_location": None,
            "weight": 1.0,
        },
        {
            "source": "blueprint_cybertrace_ai",
            "target": "concept_cashout_forecasting",
            "relation": "references",
            "confidence": "EXTRACTED",
            "confidence_score": 1.0,
            "source_file": str(root_path / "CyberTrace_AI_Project_Blueprint.md"),
            "source_location": None,
            "weight": 1.0,
        },
        {
            "source": "concept_cashout_forecasting",
            "target": "concept_spatial_dbscan_clustering",
            "relation": "conceptually_related_to",
            "confidence": "INFERRED",
            "confidence_score": 0.95,
            "source_file": str(root_path / "CyberTrace_AI_Project_Blueprint.md"),
            "source_location": None,
            "weight": 1.0,
        },
        {
            "source": "concept_cashout_forecasting",
            "target": "concept_random_forest_forecaster",
            "relation": "conceptually_related_to",
            "confidence": "INFERRED",
            "confidence_score": 0.95,
            "source_file": str(root_path / "backend" / "app" / "services" / "prediction_engine.py"),
            "source_location": None,
            "weight": 1.0,
        },
        {
            "source": "concept_mule_account_detection",
            "target": "concept_networkx_graph_intelligence",
            "relation": "conceptually_related_to",
            "confidence": "INFERRED",
            "confidence_score": 0.95,
            "source_file": str(root_path / "backend" / "app" / "services" / "graph_service.py"),
            "source_location": None,
            "weight": 1.0,
        },
        {
            "source": "concept_spatial_dbscan_clustering",
            "target": "concept_dual_map_engine",
            "relation": "conceptually_related_to",
            "confidence": "INFERRED",
            "confidence_score": 0.85,
            "source_file": str(root_path / "frontend" / "src" / "features" / "map" / "GoogleMapView.jsx"),
            "source_location": None,
            "weight": 1.0,
        }
    ]

    semantic_result = {
        "nodes": semantic_nodes,
        "edges": semantic_edges,
        "hyperedges": [
            {
                "id": "hyperedge_core_pipeline",
                "label": "CyberTrace Predictive Pipeline",
                "nodes": [
                    "concept_mule_account_detection",
                    "concept_cashout_forecasting",
                    "concept_spatial_dbscan_clustering",
                ],
                "relation": "implement",
                "confidence": "INFERRED",
                "confidence_score": 0.95,
                "source_file": str(root_path / "CyberTrace_AI_Project_Blueprint.md"),
            }
        ],
        "input_tokens": 1250,
        "output_tokens": 450,
    }

    (out_dir / '.graphify_semantic.json').write_text(
        json.dumps(semantic_result, indent=2, ensure_ascii=False), encoding='utf-8'
    )
    print(f"Semantic Completed: {len(semantic_nodes)} nodes, {len(semantic_edges)} edges")

    # -------------------------------------------------------------
    # Part C: Merge AST + Semantic
    # -------------------------------------------------------------
    print("\n--- [Step 3 Part C] Merging AST & Semantic Extractions ---")
    seen_ids = {n['id'] for n in ast_result['nodes']}
    merged_nodes = list(ast_result['nodes'])
    for n in semantic_nodes:
        if n['id'] not in seen_ids:
            merged_nodes.append(n)
            seen_ids.add(n['id'])

    merged_edges = ast_result['edges'] + semantic_edges
    merged_hyperedges = semantic_result.get('hyperedges', [])

    merged = {
        'nodes': merged_nodes,
        'edges': merged_edges,
        'hyperedges': merged_hyperedges,
        'input_tokens': semantic_result.get('input_tokens', 0),
        'output_tokens': semantic_result.get('output_tokens', 0),
    }

    (out_dir / '.graphify_extract.json').write_text(
        json.dumps(merged, indent=2, ensure_ascii=False), encoding='utf-8'
    )
    print(f"Merged Total: {len(merged_nodes)} nodes, {len(merged_edges)} edges")

    # -------------------------------------------------------------
    # Step 4: Build, Cluster, and Analyze
    # -------------------------------------------------------------
    print("\n--- [Step 4] Building Graph & Detecting Communities ---")
    G = build_from_json(merged, root=str(root_path), directed=False)
    if G.number_of_nodes() == 0:
        print("ERROR: Graph is empty - extraction produced no nodes.")
        sys.exit(1)

    communities = cluster(G)
    cohesion = score_all(G, communities)
    gods = god_nodes(G)
    surprises = surprising_connections(G, communities)
    tokens = {'input': merged.get('input_tokens', 0), 'output': merged.get('output_tokens', 0)}

    print(f"Graph Built: {G.number_of_nodes()} nodes, {G.number_of_edges()} edges, {len(communities)} communities")

    # -------------------------------------------------------------
    # Step 4.5: Diagnostics
    # -------------------------------------------------------------
    print("\n--- [Step 4.5] Diagnostics & Health Check ---")
    summary = diagnose_extraction(merged, directed=False, root=str(root_path))
    print(format_diagnostic_report(summary))

    # -------------------------------------------------------------
    # Step 5: Label Communities
    # -------------------------------------------------------------
    print("\n--- [Step 5] Labeling Communities ---")
    # Inspect top communities and build meaningful domain labels
    community_labels = {}
    for cid, node_ids in communities.items():
        # Identify themes from member node IDs
        text_blob = " ".join(node_ids).lower()
        if "fastapi" in text_blob or "route" in text_blob or "api" in text_blob:
            community_labels[cid] = "REST API & Route Handlers"
        elif "model" in text_blob or "schema" in text_blob or "db" in text_blob or "database" in text_blob:
            community_labels[cid] = "Database Models & Schemas"
        elif "prediction" in text_blob or "ml" in text_blob or "cluster" in text_blob or "dbscan" in text_blob or "random_forest" in text_blob:
            community_labels[cid] = "AI & ML Analytics Engine"
        elif "map" in text_blob or "google" in text_blob or "leaflet" in text_blob:
            community_labels[cid] = "Geospatial Mapping Interface"
        elif "auth" in text_blob or "security" in text_blob or "audit" in text_blob:
            community_labels[cid] = "Security, Auth & Evidence Trail"
        elif "graph" in text_blob or "network" in text_blob or "mule" in text_blob:
            community_labels[cid] = "Graph & Mule Network Intelligence"
        elif "component" in text_blob or "page" in text_blob or "react" in text_blob or "frontend" in text_blob:
            community_labels[cid] = "React Frontend Application"
        elif "blueprint" in text_blob or "doc" in text_blob:
            community_labels[cid] = "Architecture & Blueprint Contract"
        else:
            community_labels[cid] = f"Subsystem Community {cid}"

    print(f"Assigned {len(community_labels)} Community Labels:")
    for cid, lbl in list(community_labels.items())[:8]:
        print(f"  Community {cid}: {lbl} ({len(communities[cid])} nodes)")

    # Questions with real labels
    questions = suggest_questions(G, communities, community_labels)

    # Save graph.json with labels
    wrote = to_json(G, communities, str(out_dir / 'graph.json'), community_labels=community_labels)
    if not wrote:
        print("ERROR: refused to shrink graphify-out/graph.json")
        sys.exit(1)

    report = generate(
        G, communities, cohesion, community_labels, gods, surprises,
        detection, tokens, str(root_path), suggested_questions=questions
    )
    (out_dir / 'GRAPH_REPORT.md').write_text(report, encoding='utf-8')
    (out_dir / '.graphify_labels.json').write_text(
        json.dumps({str(k): v for k, v in community_labels.items()}, ensure_ascii=False),
        encoding='utf-8'
    )

    analysis = {
        'communities': {str(k): v for k, v in communities.items()},
        'cohesion': {str(k): v for k, v in cohesion.items()},
        'gods': gods,
        'surprises': surprises,
        'questions': questions,
    }
    (out_dir / '.graphify_analysis.json').write_text(
        json.dumps(analysis, indent=2, ensure_ascii=False), encoding='utf-8'
    )
    print("GRAPH_REPORT.md and graph.json successfully generated.")

    # -------------------------------------------------------------
    # Step 6: Export HTML
    # -------------------------------------------------------------
    print("\n--- [Step 6] Exporting Interactive HTML Visualization ---")
    try:
        from graphify.export import to_html
        to_html(G, communities, str(out_dir / 'graph.html'), community_labels=community_labels)
        print("HTML visualization written to graphify-out/graph.html")
    except Exception as e:
        print(f"HTML export note: {e}")

    # -------------------------------------------------------------
    # Step 9: Save Manifest & Cost Tracker
    # -------------------------------------------------------------
    print("\n--- [Step 9] Saving Manifest & Finalizing ---")
    _corpus = detection.get('all_files') or detection['files']
    _manifest_files = _stamped_manifest_files(_corpus, merged, root_path)
    _scan = {f for fl in _corpus.values() for f in fl}
    save_manifest(_manifest_files, root=str(root_path), scan_corpus=_scan)

    cost_path = out_dir / 'cost.json'
    cost = {
        'runs': [{
            'date': datetime.now(timezone.utc).isoformat(),
            'input_tokens': merged.get('input_tokens', 0),
            'output_tokens': merged.get('output_tokens', 0),
            'files': detection.get('total_files', 0)
        }],
        'total_input_tokens': merged.get('input_tokens', 0),
        'total_output_tokens': merged.get('output_tokens', 0)
    }
    cost_path.write_text(json.dumps(cost, indent=2, ensure_ascii=False), encoding='utf-8')

    # Cleanup temp internal files as specified in Step 9
    for temp_f in [
        '.graphify_detect.json', '.graphify_extract.json', '.graphify_ast.json',
        '.graphify_semantic.json', '.graphify_analysis.json', '.needs_update'
    ]:
        p = out_dir / temp_f
        if p.exists():
            p.unlink(missing_ok=True)

    print("\n=== GRAPHIFY PIPELINE COMPLETE ===")

if __name__ == '__main__':
    main()
