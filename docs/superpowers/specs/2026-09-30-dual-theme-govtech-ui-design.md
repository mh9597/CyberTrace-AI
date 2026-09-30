# Design Specification: High-Trust Law-Enforcement Console with Dual Light/Dark Theme

- **Date:** 2026-09-30
- **Status:** Approved Baseline (Ready for Implementation Planning)
- **Target:** `frontend/` (React 18 + Tailwind CSS + Vite)
- **References:** [design.md](file:///c:/Users/manan/OneDrive/Documents/SIH_PROJECT/CyberTrace-AI/design.md) Section 8, VoltAgent `awesome-design-md`

---

## 1. Executive Summary & Design Concept

This specification defines the complete overhaul of **CyberTrace AI** into a **High-Trust Law Enforcement & Gov-Tech Intelligence Console** equipped with full **Dual Light & Dark Theme** support.

The concept moves away from decorative neon sci-fi styling towards a restrained, authoritative, evidence-oriented operational platform:
1. **Light Mode (Default Work Surface):** Clean crisp off-white (`#F8FAFC`, `#F1F5F9`), pure white card surfaces (`#FFFFFF`), subtle slate dividers (`#E2E8F0`), deep navy typography (`#0F172A`), and accessible institutional blue/teal accents.
2. **Dark Mode (Night Operations Console):** Deep void canvas (`#030712`), obsidian surface panels (`#0B1120`, `#0F172A`), precision slate borders (`#1E293B`), and high-contrast glowing indicators.
3. **Dual Theme Engine:** A dedicated `ThemeContext` providing dynamic toggle between `light`, `dark`, and `system` modes, with `localStorage` persistence, zero flash-of-unstyled-theme, and reactive adaptation of maps and charts.

---

## 2. Theme Architecture & Tokens

### 2.1 Tailwind Configuration (`tailwind.config.js`)
Enable class-based dark mode:
```javascript
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        gov: {
          navy: '#0f172a',
          slate: '#334155',
          lightBg: '#f8fafc',
          lightCard: '#ffffff',
          lightBorder: '#e2e8f0',
          darkBg: '#030712',
          darkCard: '#0f172a',
          darkBorder: '#1e293b',
          accent: '#0284c7', // Accessible institutional blue
          teal: '#0d9488',   // Accessible teal for verified
          amber: '#d97706',  // Alert warning
          rose: '#dc2626',   // High priority risk
        },
      },
    },
  },
}
```

### 2.2 Global CSS Variables (`src/index.css`)
```css
:root {
  /* Light Mode Variables */
  --bg-app: #f8fafc;
  --bg-surface: #ffffff;
  --bg-card: #ffffff;
  --bg-card-subtle: #f1f5f9;
  --border-app: #e2e8f0;
  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --accent-primary: #0284c7;
}

.dark {
  /* Dark Mode Variables */
  --bg-app: #030712;
  --bg-surface: #0b1120;
  --bg-card: #0f172a;
  --bg-card-subtle: #1e293b;
  --border-app: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  --accent-primary: #38bdf8;
}
```

---

## 3. Theme Engine (`src/context/ThemeContext.jsx`)

- **State:** `theme` (`'light' | 'dark' | 'system'`), `isDark` boolean.
- **Persistence:** Stored in `localStorage.getItem('cybertrace_theme')`.
- **System Synchronization:** Listens to `window.matchMedia('(prefers-color-scheme: dark)')` change events.
- **DOM Integration:** Sets or removes the `.dark` class on `document.documentElement`.
- **UI Component:** `ThemeToggle.jsx` in the top navbar with Sun and Moon iconography and active mode indicator.

---

## 4. Component Adaptation (Light & Dark)

| Component | Light Mode Styling | Dark Mode Styling |
| :--- | :--- | :--- |
| `GlassCard.jsx` | Pure white background, border `#E2E8F0`, subtle drop-shadow `shadow-sm` | Obsidian background `#0F172A`, border `#1E293B`, subtle glow `border-slate-800` |
| `StatusBadge.jsx` | Solid pastel tints: Emerald (`bg-emerald-50 text-emerald-800 border-emerald-300`), Rose (`bg-rose-50 text-rose-800 border-rose-300`) | Dark saturated tints: Emerald (`bg-emerald-950/80 text-emerald-300`), Rose (`bg-rose-950/80 text-rose-300`) |
| `MetricCard.jsx` | White card, crisp slate titles, strong bold primary counter, subtle icon badge | Dark card, glowing border highlight, vibrant counter |
| `DataSufficiencyBanner.jsx`| Crisp bordered callout with light tint and formal institutional badge | Dark gradient banner with glowing status beacon |
| `ConfidenceBar.jsx` | Clean blue/teal gradient with clear uncertainty bracket | Glowing gradient with translucent uncertainty band |
| `Navbar.jsx` | Crisp white header with border-b, dark text, and official emblem | Deep obsidian header with border-b and glowing emblem |
| `Sidebar.jsx` | Clean off-white navigation rail with high-contrast active item pills | Deep obsidian navigation rail with glowing active pills |
| `Leaflet Map` | Standard clean OpenStreetMap tiles (no invert filter) | High-contrast dark inverted filter tiles |
| `Recharts Analytics`| White tooltip card with border `#E2E8F0` and dark text `#0F172A` | Obsidian tooltip card with border `#334155` and white text |

---

## 5. Scope & Rollout Plan

1. **Step 1:** Add `ThemeContext.jsx` and `ThemeToggle.jsx`.
2. **Step 2:** Configure `tailwind.config.js` with `darkMode: 'class'` and semantic color extensions.
3. **Step 3:** Update `index.css` with light and dark root variables and dual-mode Leaflet rules.
4. **Step 4:** Adapt `Navbar.jsx`, `Sidebar.jsx`, and `Layout.jsx` to render seamlessly in both modes.
5. **Step 5:** Adapt common components (`GlassCard`, `StatusBadge`, `MetricCard`, `EvidenceBadge`, `ConfidenceBar`, `DataSufficiencyBanner`, `ModalDialog`).
6. **Step 6:** Adapt all pages: `Dashboard.jsx`, `Complaints.jsx`, `ComplaintDetails.jsx`, `PredictionCenter.jsx`, `IntelligenceMap.jsx`, `TransactionNetwork.jsx`, `Alerts.jsx`, `SecurityCenter.jsx`, and `Login.jsx`.
7. **Step 7:** Verify compilation with `npm.cmd run build` (Exit Code 0) and test switching between light and dark modes.
