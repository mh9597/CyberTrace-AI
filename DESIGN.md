# CyberTrace AI — Secure Predictive Cybercrime Intelligence Platform

## Overview

**Product:** CyberTrace AI — Secure Predictive Cybercrime Intelligence & Cash-out Forecasting Platform (SIH 2026, SIH26184)
**Surface type:** authenticated internal web application (React + Tailwind CSS)
**Audience:** Authorized investigators, senior officers and administrators
**Brand character:** Calm, high-contrast and evidence-first. Black, white and one orange accent, with a small semantic set for risk. Every screen shows a role only what it needs.
**Design source:** Visual language adapted from Humble (https://humblefactory.ai/): the black/white/orange palette, Bricolage Grotesque + Inter + Kode Mono + Geist type stack, generous radii, soft shadow, one primary action per view, and role-specific screens. Humble is a confident marketing site. CyberTrace is a cautious investigation tool. Only Humble's clarity is borrowed, never its certainty.

### Design Principles

- **Leads, not proof.** Predictions are investigative leads. The interface never implies certainty, guilt or a guaranteed location.
- **Uncertainty is always visible.** Any risk estimate is shown with uncertainty, data freshness and model version, or it is not shown.
- **Humans decide.** The UI suggests next steps. It never freezes accounts, accuses individuals or triggers enforcement. Every consequential action needs an explicit human control and is written to the audit log.
- **Demo data is always labelled.** Synthetic data carries a persistent "Demo data" marker on every screen that shows it.
- **Provenance on every finding.** Each derived finding links to its source records and shows where it came from.
- **One clear next step.** Each view has at most one primary action (orange). Everything else is secondary.
- **Never colour alone.** Status, risk and map layers pair colour with an icon, a label or a pattern.
- **Consistency over novelty.** Reuse existing patterns before inventing new ones.
- **Token-driven.** Every visual decision references a token, not a magic number.
- **Accessible by default.** Compliance is a baseline, not a feature.

## Colors

### Core palette (from Humble)

| Token | Value | Role | Contrast on `color-5` |
|-------|-------|------|------------------------|
| color-1 | `#000000` | Text primary, icons, focus ring | 21:1 |
| color-2 | `#0000EE` | Links, info, candidate-zone layer | 8.6:1 |
| color-3 | `#FF4000` | Accent. Primary action fill and brand only | 3.5:1 (large text and graphics only) |
| color-4 | `#999999` | Borders, dividers, disabled outlines. Never readable text | 2.8:1 |
| color-5 | `#FFFFFF` | Surface, text on dark | n/a |

### CyberTrace extensions (documented exceptions)

Humble's palette has no way to express risk, so this system adds a deliberate, minimal semantic set. Do not add further colours.

| Token | Value | Role | Contrast on `color-5` |
|-------|-------|------|------------------------|
| color-6 | `#595959` | Text secondary, metadata, labels | 7:1 |
| color-7 | `#F5F5F5` | Page background, table header, subtle surface | n/a |
| color-8 | `#1A7F37` | Risk low, success | 5.1:1 |
| color-9 | `#8A5A00` | Risk medium, warning | 5.9:1 |
| color-10 | `#B42318` | Risk high, error, destructive | 6.6:1 |

### Colour usage rules

- **Primary button:** `color-3` fill with `color-1` label (6:1). White on `color-3` fails for body-size text.
- **Orange is never a risk colour.** Orange means "the main action". High risk uses `color-10`, so the two never compete.
- **Chips and badges:** `color-5` background, 1px border and icon in the semantic colour, label in `color-1`. No tinted fills, so no extra tokens.
- **`color-4`** is for borders and dividers only. Readable secondary text uses `color-6`.
- **Focus ring:** 2px `color-1` with a 2px `color-5` offset, visible on every surface including orange.

### Semantic mapping

| Concept | Value | Colour | Icon | Extra cue |
|---------|-------|--------|------|-----------|
| Risk band | Low | `color-8` | circle-check | Label "Low" |
| Risk band | Medium | `color-9` | triangle-alert | Label "Medium" |
| Risk band | High | `color-10` | octagon-alert | Label "High" |
| Risk band | Insufficient data | `color-4` border, `color-6` text | circle-dashed | Label "Insufficient data", dashed border |
| Case status | New | `color-2` | circle-dot | Label |
| Case status | Under Analysis | `color-2` | loader | Label |
| Case status | Alert Generated | `color-9` | bell | Label |
| Case status | Under Investigation | `color-1` | search | Label |
| Case status | Resolved | `color-8` | circle-check | Label |
| Case status | Dismissed | `color-6` | circle-x | Label |
| Map layer | Historical hotspot | `color-1` | filled circle marker | Solid fill, solid outline |
| Map layer | Predicted candidate zone | `color-2` | dashed-circle marker | Diagonal hatch fill, dashed outline |
| Data origin | Demo (synthetic) | `color-9` | flask | "Demo data" label, always visible |
| Data origin | Authorized real data | `color-1` | database | "Authorized data" label |

## Typography

**Font stack:** Bricolage Grotesque, Inter, Kode Mono, Geist, sans-serif

| Family | Role |
|--------|------|
| Bricolage Grotesque | Page titles and section headings |
| Inter | Body text, forms, buttons, tables (default) |
| Kode Mono | Identifiers and machine values: complaint IDs, transaction references, SHA-256 hashes, coordinates, timestamps |
| Geist | Large numerals: dashboard counts, metric values, evaluation scores |

Do not use Times New Roman. Fallback is the generic `sans-serif`, or `monospace` for Kode Mono.

| Level | Size | Usage |
|-------|------|-------|
| text-xs | 12px | Captions, metadata, model version, data freshness, table footers |
| text-sm | 14px | Labels, table cells, secondary text, chips |
| text-base | 16px | Body text (default), form inputs |
| text-lg | 24px | Panel titles, subheadings, emphasis |
| text-xl | 36px | Page titles, dashboard metric values |

**Weight scale:** 400 · 500 · 600 (400 body, 500 labels and buttons, 600 headings)
**Line heights:** 28.8px · 19.6px · 43.2px · 20.8px · 18.2px (use the value paired with each size, never a custom one)

Rules:
- Body text minimum is `text-sm`. `text-xs` is for metadata only and must use `color-1` or `color-6`.
- Numbers in tables use tabular figures and right alignment.
- Identifiers use Kode Mono and never wrap mid-token. Truncate with a middle ellipsis and expose the full value on focus and via copy control.

## Spacing

**Base unit:** 8px

`space-1: 8px` · `space-2: 10px` · `space-3: 11px` · `space-4: 16px` · `space-5: 20px` · `space-6: 24px` · `space-7: 32px` · `space-8: 38px` · `space-9: 64px` · `space-10: 160px` · `space-11: 450px`

Usage in the app:

| Token | Use |
|-------|-----|
| space-1 | Icon-to-label gap, chip padding, tight table cell padding |
| space-4 | Gap between list items and form fields, table cell padding |
| space-5 | Gap between related groups |
| space-6 | Panel and card padding |
| space-7 | Gap between panels, page gutters |
| space-9 | Page top and bottom padding on large screens |
| space-11 | Minimum height of the map and graph canvases |

`space-2`, `space-3` and `space-8` are inherited from the Humble scale. Prefer the values above and use these only where alignment needs them. `space-10` is for marketing or login layouts only and is not used inside the authenticated app.

## Shapes

**Border radius:** `radius-sm: 10px` · `radius-md: 28px` · `radius-lg: 34px` · `radius-xl: 38px`

| Token | Use |
|-------|-----|
| radius-sm | Buttons, inputs, chips, badges, table rows, step chips, map popups |
| radius-md | Panels and cards |
| radius-lg | Side drawers and modals |
| radius-xl | Login card and full-page empty states |

Do not mix radius values within one component. Data tables have square inner cells. Only the outer container is rounded.

## Elevation

- **shadow-sm:** `rgba(0, 0, 0, 0.03) 0px 0.706592px 0.706592px -0.416667px, rgba(0, 0, 0, 0.03) 0px 1.80656px 1.80656px -0.833333px, rgba(0, 0, 0, 0.03) 0px 3.62176px 3.62176px -1.25px, rgba(0, 0, 0, 0.03) 0px 6.8656px 6.8656px -1.66667px, rgba(0, 0, 0, 0.03) 0px 13.6468px 13.6468px -2.08333px, rgba(0, 0, 0, 0.03) 0px 30px 30px -2.5px`

Panels, drawers and popovers use `shadow-sm` plus a 1px `color-4` border. The shadow is soft, so the border carries the edge. There is no other elevation level.

## Motion

Humble's extracted motion values were incomplete, so CyberTrace defines its own minimal set.

- **duration-fast:** `150ms` (hover, focus, chip and button transitions)
- **duration-base:** `250ms` (drawer open and close, step-complete transition)
- **duration-none:** `0ms` (used when reduced motion is requested)

Rules:
- Respect `prefers-reduced-motion`. Replace all transitions with `duration-none`.
- Animate only opacity and transform. Never animate layout on data tables.
- No autoplay video, no looping decoration, no scroll-jacking. Motion only confirms an action.

## Layout and Breakpoints

| Breakpoint | Width | Behaviour |
|------------|-------|-----------|
| Smallest supported | 360px | Single column. Review and decide only. Map and graph open full-screen with a list fallback |
| md | 768px | Two columns. Collapsible left navigation |
| lg | 1280px | Persistent left navigation, main content plus optional right detail drawer |
| Largest supported | 1920px | Content capped in width and centred. Map and graph fill the available space |

Application shell (all pages):
1. **Top bar:** product name, global search, current role label, user menu. The persistent "Demo data" banner sits directly beneath it whenever synthetic data is in view.
2. **Left navigation:** Dashboard, Complaints, Prediction Center, Intelligence Map, Transaction Network, Alerts & Investigation, Security Center. Items the role cannot open are hidden, not disabled.
3. **Main content:** page title, a single primary action, then panels.
4. **Detail drawer:** evidence, provenance and audit metadata for the selected record.

## Components

### Component inventory by page

| Page | Components |
|------|------------|
| Dashboard | Metric tile, status summary, recent alerts list, model evaluation summary, data freshness indicator, **Next steps panel** |
| Complaints | Complaint form, upload dropzone (CSV/JSON), search and filter bar, complaints data table, status chip, transaction table |
| Prediction Center | Case selector, run-analysis action, prediction card, uncertainty range, supporting factors list, insufficient-data notice, model version footer |
| Intelligence Map | Leaflet map, layer toggle (hotspots vs candidate zones), filter bar (date, case, fraud type, risk band), marker popup, legend |
| Transaction Network | Graph canvas, node and edge detail drawer, connected-record highlight, cross-complaint link marker |
| Alerts & Investigation | Alert queue, assignment control, notes thread, decision dialog (verify, dismiss, resolve), change history |
| Security Center | User roles table, access log table, evidence hash row with integrity check, audit history table |
| Global | App shell, demo data banner, role label, toast, empty state, error state, skeleton loader |

Known page component density: navigation items 7, primary actions per view 1, tables per view up to 2.

### Domain patterns

**Risk estimate display.** A risk estimate is always rendered as one unit: risk badge, uncertainty range, data freshness, model version and prediction timestamp. Never render the badge alone. Use the word "risk estimate". Use "probability" only where calibration has been tested and the calibration result is shown.

**Insufficient data.** When labelled historical outcomes are missing, replace the forecast with the insufficient-data notice: "Data is too limited for a valid forecast. Showing historical hotspots only." Label the output "Historical hotspot analysis, not validated forecasting".

**Map layers.** Historical hotspots and candidate zones are separate layers with separate toggles. They differ by fill pattern and outline as well as colour. ATM or withdrawal points appear only if present in authorized data.

**Provenance.** Every derived finding, transaction edge and prediction links to its source record, source name and import timestamp.

**Human decision.** Decision controls (verify, escalate, dismiss, resolve) are explicit buttons that open a confirmation with a required note. They record user, time and outcome in the audit log. There are no one-click enforcement actions anywhere in the product.

**Role views.**

| Role | Sees | Cannot |
|------|------|--------|
| Investigator | Own and assigned complaints, predictions, map, network, alert review | View other users' audit history, manage roles |
| Senior Officer | All investigator views plus assignment, approval of decisions, evaluation summary | Manage roles, change security settings |
| Admin | User roles, access logs, security events, evidence integrity, audit history | Record investigation decisions |

Authorization is enforced on the backend. The UI hides what a role cannot use, and it is never the only control.

## Do's and Don'ts

### Do

- Reference tokens by name, not raw values. Use `color-10`, not `#B42318`.
- Define all interactive states: default, hover, focus-visible, active, disabled, loading, error.
- Use the spacing scale for all padding, margin and gap values.
- Write content in sentence case. Reserve ALL CAPS for acronyms only (SHA-256, UPI, ATM).
- Show uncertainty, data freshness and model version beside every risk estimate.
- Keep "Demo data" visible on every screen that shows synthetic data.
- Pair every colour signal with an icon and a label.
- Keep one primary (orange) action per view.
- Show each role only what it needs.
- Test every component at the smallest (360px) and largest (1920px) breakpoint before shipping.

### Don't

- Do not introduce colours outside the palette and the documented extensions.
- Do not use orange for risk, error or status.
- Do not use `color-4` for readable text.
- Do not use white text on `color-3` at body sizes.
- Do not use arbitrary spacing values. Stick to the scale.
- Do not mix border-radius values. Pin to the set (10px, 28px, 34px, 38px).
- Do not use full-uppercase text for body or paragraph content.
- Do not nest interactive elements (for example, buttons inside links or inside clickable rows).
- Do not ship components without hover, focus-visible and disabled states.
- Do not show a risk percentage without uncertainty and model version.
- Do not add one-click freeze, flag or accuse actions.
- Do not present demo predictions, accuracy figures or recovered-money amounts as real findings.
- Do not use the words "suspect location", "confirmed", "guaranteed" or "tracking".

## Writing Tone

Concise, calm and evidence-first. Plain, direct sentences. Avoid filler preambles. Never sound certain about a prediction.

### Vocabulary

| Use | Avoid |
|-----|-------|
| Candidate zone | Suspect location, target |
| Lead | Proof, evidence of guilt |
| Historical hotspot | Crime hotspot, confirmed location |
| Risk estimate | Probability (unless calibrated) |
| Possible link for review | Connected criminals, confirmed link |
| Review, verify, dismiss | Catch, arrest, freeze |
| Model version, prediction timestamp | (never omit) |
| Demo data | Test data, fake data |

Rules:
- Start action labels with a verb, at 8 words or fewer.
- Errors say what happened and what to do next, with no internal details.
- Empty states say what is missing and offer one action.
- Required footer wherever a prediction appears: "Prediction is a lead, not proof."

## Authoring Workflow

When creating or updating a component guideline for this system, follow this sequence:

1. **State the intent** — one sentence on what the component does and why it exists.
2. **Map tokens** — list every color, spacing, typography, radius and motion token the component uses. No raw values.
3. **Define anatomy** — break the component into named parts (container, label, icon, etc.) with their token assignments.
4. **Specify states** — document every state: default, hover, focus-visible, active, disabled, loading, error, empty, insufficient data (where prediction is involved).
5. **Describe interactions** — keyboard, pointer and touch behaviour, including edge cases (long content, overflow, truncation).
6. **Add accessibility criteria** — write testable pass/fail checks (for example "focus ring must be visible at 3:1 contrast").
7. **State the responsible-use rule** — say how the component avoids implying certainty, and which human control it requires.
8. **List anti-patterns** — concrete examples of misuse with a brief explanation of why each is wrong.
9. **Close with a QA checklist** — a mechanical list of verifiable items (see Definition of Done below).

## Required Output Structure

Every component guideline produced from this system must contain these sections, in order:

1. Overview — purpose, when to use, when not to use.
2. Tokens and foundations — all referenced tokens from the tables above.
3. Anatomy and variants — named parts, variant matrix (including role variants), responsive behavior.
4. States and interactions — full state table, keyboard, pointer and touch behavior.
5. Accessibility — ARIA attributes, contrast requirements, focus management, screen reader behavior.
6. Content guidelines — copy length, tone, capitalisation, vocabulary, placeholder text rules.
7. Anti-patterns — explicit examples of what not to build, with reasoning.

## Component Requirements

Every component built against this system must:

- Reference only tokens defined in the tables above. No hardcoded hex, px or font values.
- Define all interactive states: default, hover, focus-visible, active, disabled, loading, error.
- Specify responsive behavior at the smallest (360px) and largest (1920px) supported breakpoint.
- Handle edge cases: empty state, overflow and truncation, maximum content length, malformed or missing data.
- Include keyboard navigation (Tab, Enter, Escape, Arrow keys where applicable).
- Document ARIA roles, labels and live-region behavior where relevant.
- Never rely on colour alone to convey meaning.
- Show provenance, uncertainty and the demo-data label wherever it displays derived or predicted data.
- Never trigger an enforcement or account action, and require an explicit human control for any decision.
- Respect role-based visibility, with authorization enforced server-side.
- Respect `prefers-reduced-motion`.

## Definition of Done

A component is not complete until every item below is checked:

- Renders correctly in its default state (smoke test).
- All states documented and visually verified (hover, focus, disabled, loading, error, empty, insufficient data).
- All visual values use design tokens, with zero hardcoded values.
- Keyboard navigation works without a pointer.
- No critical accessibility violations (contrast, ARIA, focus order).
- Text contrast is at least 4.5:1, and non-text contrast (icons, focus ring, borders that convey state) is at least 3:1.
- Tested at 360px and 1920px.
- Risk and status are conveyed by icon and label as well as colour.
- Any prediction shows uncertainty, data freshness, model version and the "Prediction is a lead, not proof" line.
- Demo data is labelled.
- Anti-patterns section lists at least one concrete misuse example.
- Documentation covers purpose, usage, props/API and limitations.

---

# Reference guideline: Next steps panel

The first component to build against this system. It adapts Humble's "Just tell me what's next" pattern: one clear task list instead of several systems, shown per role.

## 1. Overview

**Intent:** Give an officer a short, ordered list of suggested next actions for a case, so evidence on the Alerts & Investigation page and the Prediction Center leads to a human decision.

**Use it for:** Cases in Under Analysis, Alert Generated or Under Investigation status. Place it at the top of a case view and on the Dashboard as a per-role queue.

**Do not use it for:** Automated actions. It suggests steps only. It never freezes accounts, flags suspects or triggers enforcement.

**Example (CT-2026-001, Investigator, demo data):**
1. Verify the transaction chain for `TXN-DEMO-001`.
2. Review the candidate zone and time window.
3. Record a decision: verify, escalate or dismiss.

## 2. Tokens and foundations

| Aspect | Tokens |
|--------|--------|
| Container | `color-5` surface, `color-4` 1px border, `radius-md`, `shadow-sm`, `space-6` padding |
| Panel title | `text-lg`, weight 600, Bricolage Grotesque, `color-1` |
| Step text | `text-base`, weight 400, Inter, `color-1` |
| Metadata (model version, freshness, provenance) | `text-xs`, `color-6`, Kode Mono for IDs |
| Step chip (number) | `radius-sm`, `color-4` border, `text-sm` |
| Step gap | `space-4` |
| Primary action | `color-3` fill, `color-1` label, `radius-sm` |
| Secondary actions | `color-5` fill, `color-4` border, `color-1` label |
| Status chip | Semantic mapping table, `text-sm`, `radius-sm` |
| Focus ring | 2px `color-1`, 2px `color-5` offset |
| Transitions | `duration-fast`, `duration-base` for step completion |

## 3. Anatomy and variants

**Parts:** container · title with role label · data-origin label ("Demo data") · step list · step (chip, action text, evidence link, status chip) · primary action · secondary actions · footer ("Prediction is a lead, not proof." with model version and freshness).

| Variant | Steps it may show | Primary action |
|---------|------------------|----------------|
| Investigator | Verify chain, review candidate zone, record decision | Record decision |
| Senior officer | Review investigator decision, approve or return, assign | Approve decision |
| Admin | Review access anomalies, check evidence integrity | Check integrity |

**Responsive:** at 360px the panel shows one step at a time with previous and next controls. At 1920px all steps are visible, capped at 5 with "View all".

## 4. States and interactions

| State | Behaviour |
|-------|-----------|
| Default | Steps listed, first incomplete step highlighted |
| Hover | Step row background `color-7` |
| Focus-visible | Focus ring on the step row |
| Active | Step marked "In progress" with icon and label |
| Disabled | Step locked until the previous one is done, or the role lacks permission, with the reason as text |
| Loading | Skeleton rows while the analysis runs |
| Error | Message and a retry action, with no partial steps |
| Empty | "No open actions for this case." |
| Insufficient data | Prediction steps replaced by "Data is too limited for a valid forecast. Showing historical hotspots only." |

- **Keyboard:** Tab moves to the list, Arrow Up and Down move between steps, Enter opens the step's evidence, Escape closes the evidence drawer and returns focus to the step.
- **Pointer and touch:** the whole step row opens evidence. The evidence link and action buttons are separate sibling controls, never nested inside the row's own control.
- **Long content:** step text truncates after two lines, with full text on focus and in the drawer.

## 5. Accessibility

- Container is a `section` labelled by its title. The step list uses `role="list"`, with `aria-current="step"` on the active step.
- Step completion is announced through an `aria-live="polite"` region.
- Focus ring meets 3:1 contrast against every surface, including the orange button.
- Status is conveyed by icon and text as well as colour.
- Disabled steps keep the reason available to screen readers via `aria-describedby`.
- After completing a step, focus moves to the next incomplete step.
- Pass/fail check: every control is reachable and operable by keyboard only, in DOM order matching visual order.

## 6. Content guidelines

- Start each step with a verb, in sentence case, at 8 words or fewer.
- Say "candidate zone", "lead" and "risk estimate". Never "suspect location" or "confirmed".
- Any confirming action needs an explicit human control and a required note.
- Placeholder and demo text must say "Demo data" and never look like a real case.

## 7. Anti-patterns

- **A one-click "Freeze account" or "Flag suspect" button.** It is out of scope and bypasses human review.
- **A risk percentage with no uncertainty or model version.** It implies false precision.
- **Nesting buttons inside a clickable row.** It breaks keyboard use and the rule against nested interactive elements.
- **Showing the same steps to every role.** It defeats the purpose of role-specific screens.
- **Orange used for high risk.** Orange is reserved for the primary action.
- **Auto-completing a step without a human action.** Decisions must be recorded by a person.

## QA checklist

- [ ] Default state renders with the "Demo data" label on synthetic cases.
- [ ] Hover, focus-visible, active, disabled, loading, error, empty and insufficient-data states verified.
- [ ] No hardcoded hex, px or font values.
- [ ] Works with keyboard only (Tab, Arrow keys, Enter, Escape).
- [ ] Focus ring at least 3:1 contrast; text at least 4.5:1.
- [ ] Verified at 360px and 1920px.
- [ ] Footer shows "Prediction is a lead, not proof.", model version and freshness.
- [ ] Each role variant shows only permitted steps, and the backend enforces the same.
- [ ] Decision action opens a confirmation, requires a note and writes an audit log entry.
- [ ] Reduced-motion setting removes transitions.
