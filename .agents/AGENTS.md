# CyberTrace AI - Subagent Orchestration & Collaboration Standard

This file mirrors the workspace agent manifesto at [AGENTS.md](file:///c:/Users/manan/OneDrive/Documents/SIH_PROJECT/CyberTrace-AI/AGENTS.md) and defines how autonomous subagents coordinate inside Antigravity.

## Core Rules for All Subagents
1. **Context Isolation:** Focus exclusively on the single task defined in your prompt.
2. **Architecture Compliance:** Follow [ARCHITECTURE_RULES.md](file:///c:/Users/manan/OneDrive/Documents/SIH_PROJECT/CyberTrace-AI/ARCHITECTURE_RULES.md) strictly.
   - Backend: `Routers -> Services -> Repositories -> Models`.
   - Frontend: Feature-sliced design; no cross-feature imports; pages are pure compositions.
3. **Evidence Before Assertions:** Always run the verification command (`npm run build`, `pytest`, etc.) before reporting success.
4. **Non-Blocking Rulings:** If an ambiguity arises, make the most reasonable architectural decision, log it as a ruling, and continue.
