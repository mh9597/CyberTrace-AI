# CyberTrace AI - Multi-Agent & Subagent Collaboration Protocol (AGENTS.md)

> **Scope:** Multi-Agent Collaboration, Autonomous Workflows & Subagent Team Coordination  
> **Framework Integrations:** Google Antigravity, Obra Superpowers (SDD), OpenGSD Core, Ralph Loop

---

## 1. Multi-Agent Team Architecture

When executing complex tasks on CyberTrace AI, work is divided across specialized agents with isolated contexts. No single agent runs an entire milestone in one bloated context window.

```
                              ┌──────────────────────────────────────────────┐
                              │      Lead Controller Agent (Orchestrator)    │
                              │   - Reads GSD Roadmap & Phase Plans          │
                              │   - Maintains Progress Ledger                │
                              │   - Adjudicates Conflicts & Rules            │
                              └──────────────┬───────────────────────────────┘
                                             │ Dispatches with isolated prompt
                      ┌──────────────────────┼──────────────────────┐
                      ▼                      ▼                      ▼
        ┌───────────────────────────┐ ┌───────────────┐ ┌──────────────────────────┐
        │    Implementer Subagent   │ │ Task Reviewer │ │  Knowledge Agent         │
        │ - Scoped to 1 single task │ │ - Spec Audit  │ │ - Graphify AST Extraction│
        │ - TDD: Test ➔ Code ➔ Verify│ │ - Code Health │ │ - God-Node Surveillance  │
        └───────────────────────────┘ └───────────────┘ └──────────────────────────┘
                      │                      │                      │
                      └──────────────────────┼──────────────────────┘
                                             ▼
                              ┌──────────────────────────────────────────────┐
                              │        Shared Ledger & Artifact Engine       │
                              │  .planning/STATE.md  │  graphify-out/        │
                              └──────────────────────────────────────────────┘
```

---

## 2. Agent Roles & Responsibilities

### 2.1 The Lead Controller (Orchestrator)
- **Primary Mission:** Plan decomposition, subagent dispatching, ledger tracking, and final integration.
- **Rules of Engagement:**
  - Never performs long contiguous multi-file edits directly when subagents are available.
  - Constructs minimal, highly-scoped context packages for each subagent (never dumps whole conversation transcripts).
  - Maintains `Continuous Execution`: Does not pause between tasks unless an irreversible destructive change or severe plan defect occurs.
  - **Rulings, not stalls:** If an implementer encounters an ambiguity, the Controller settles it immediately and records:
    `Ruling: <what was decided> — <why> — <what it costs if wrong>`

### 2.2 The Implementer Subagent
- **Primary Mission:** Flawless execution of a single task block.
- **Workflow:**
  1. **Pre-flight:** Read target files and existing tests.
  2. **TDD:** Write unit/integration tests before writing implementation code.
  3. **Code:** Implement minimal, high-cohesion code respecting [ARCHITECTURE_RULES.md](file:///c:/Users/manan/OneDrive/Documents/SIH_PROJECT/CyberTrace-AI/ARCHITECTURE_RULES.md).
  4. **Self-Verification:** Run local verification commands (`pytest`, `npm run build`).
  5. **Report:** Return changed files, test output, and confidence score.

### 2.3 The Reviewer Subagent
- **Primary Mission:** Independent verification of spec compliance and code quality.
- **Rules:**
  - Must run in a **fresh context** (never the implementer's context).
  - Checks for layer violations:
    - Did a backend router import a database session directly? (FORBIDDEN)
    - Did a frontend page call `api.get` directly instead of a feature hook? (FORBIDDEN)
    - Did any `User` ORM model leak into service signatures? (FORBIDDEN)
  - Emits clear verdicts: `APPROVED` or `CHANGES_REQUESTED` with line-numbered findings.

### 2.4 The Knowledge Agent (Graphify Engine)
- **Primary Mission:** Architecture graph maintenance and structural drift detection.
- **Actions:**
  - Executes `python scripts/run_graphify_pipeline.py`.
  - Flags edge collapse, dangling endpoints, and newly introduced God Nodes.
  - Informs the Controller when community cohesion falls below `0.20`.

### 2.5 The Autonomous Loop Runner (Ralph Loop)
- **Primary Mission:** Unattended, continuous task execution via `scripts/ralph-loop.ps1`.
- **Guarantees:**
  - Re-evaluates criteria on every iteration.
  - Exits with clear status when milestone gates pass or breaker limits trip.

---

## 3. Inter-Agent Communication & Ledger Protocol

Agents do not rely on implicit conversational memory. Memory is persisted to disk in the **Progress Ledger**:

### 3.1 The Ledger (`.planning/STATE.md`)
Every task state transition is committed:
```markdown
## Task Execution Log
- [2026-09-30 01:30] Task 2.1 Dispatched -> Implementer: Complaint Repository
- [2026-09-30 01:32] Task 2.1 Verified -> Tests passing (100%), 0 layer violations
- [2026-09-30 01:33] Task 2.1 Complete -> Commit: feat(repo): add complaint repository
```

### 3.2 Context Hand-off Format
When the Controller dispatches an Implementer, it provides:
1. **Task Description:** Specific goal and expected output.
2. **Exact Files to Touch:** Target file paths.
3. **Reference Contracts:** Schemas or interfaces to adhere to.
4. **Verification Command:** The exact command the implementer must run to prove success.

---

## 4. Conflict Prevention & Architectural Guardrails

All subagents are bound by [ARCHITECTURE_RULES.md](file:///c:/Users/manan/OneDrive/Documents/SIH_PROJECT/CyberTrace-AI/ARCHITECTURE_RULES.md):
1. **Backend Layer Rule:** `Routers ➔ Services ➔ Repositories ➔ Models`. Never skip layers.
2. **Frontend Slice Rule:** `features/<feature>/` are autonomous. No cross-feature imports.
3. **Decoupled User Principal:** Do not pass SQLAlchemy ORM `User` instances across domain boundaries.
4. **Zero Broken Builds:** An implementer's turn is NOT complete until `npm run build` or `pytest` exits with code 0.

---

## 5. Breaker & Recovery System

- **5-Round Fix Breaker:** If a task reviewer rejects an implementation 3 times, switch to a fresh implementer with a more capable model. If rejected 5 times, trip the breaker: the Controller adjudicates the open findings or halts for human intervention.
- **Graphify Health Gate:** If a commit causes graph edge collapse or introduces circular dependencies, the Knowledge Agent triggers an immediate rollback or hotfix task.
