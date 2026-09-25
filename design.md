# MediAssist — Design System & UI/UX Specification (`design.md`)

## 1. Design Philosophy: "Clinical Precision Meets Modern Elegance"

MediAssist adheres to high-tier modern healthcare UI principles:
- **Trust & Clarity**: Clean typography, crisp contrast, and unmistakable visual hierarchy to prevent misinterpretation of health information.
- **Glassmorphic Depth & Micro-interactions**: Subtle frosted glass layers (`backdrop-filter: blur(12px)`), gentle ambient glow shadows, and spring micro-animations.
- **Calm & Reassuring Aesthetic**: Soothing slate, teal, and indigo hues paired with clear emergency red-amber accents.

---

## 2. Color Palette & Design Tokens

### 2.1 Color Tokens

```css
:root {
  /* Brand Primary - Clinical Indigo */
  --primary-50: #eef2ff;
  --primary-100: #e0e7ff;
  --primary-500: #6366f1;
  --primary-600: #4f46e5;
  --primary-700: #4338ca;

  /* Accent - Teal Health & Vitality */
  --accent-400: #2dd4bf;
  --accent-500: #14b8a6;
  --accent-600: #0d9488;

  /* Dark Theme Surfaces (Sleek Obsidian & Slate) */
  --bg-dark-900: #0b0f19;
  --bg-dark-800: #111827;
  --bg-dark-700: #1f2937;
  --card-bg: rgba(17, 24, 39, 0.75);
  --card-border: rgba(255, 255, 255, 0.08);

  /* Alert & Emergency */
  --emergency-bg: #450a0a;
  --emergency-border: #ef4444;
  --emergency-text: #fca5a5;
  --warning-500: #f59e0b;
  --success-500: #10b981;

  /* Typography Colors */
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
}
```

---

## 3. Typography Hierarchy

MediAssist leverages modern Google Fonts: **Plus Jakarta Sans** (Headings) and **Inter** (Body & Clinical Data).

- **Page Titles (H1)**: `text-3xl sm:text-4xl font-extrabold tracking-tight text-white`
- **Section Headers (H2)**: `text-2xl font-bold text-slate-100`
- **Card Titles (H3)**: `text-lg font-semibold text-white`
- **Body & Descriptions**: `text-sm sm:text-base text-slate-300 leading-relaxed`
- **Badges & Meta Labels**: `text-xs font-medium uppercase tracking-wider`

---

## 4. Component Design Specifications

### 4.1 Navigation Bar
- Fixed top sticky header with `backdrop-filter: blur(16px)` and subtle bottom border `rgba(255,255,255,0.06)`.
- Brand Logo with pulsating teal health cross icon.
- Quick navigation links: *Home*, *AI Symptom Checker*, *Medicines*, *Diseases*.
- Live System Status Pill: `● AI Engine Ready (v1.0)`.

### 4.2 Category-Based Symptom Selector
- **Category Tabs**: *All Symptoms*, *General & Systemic*, *Respiratory & Throat*, *Digestive & Abdominal*, *Skin & Hair*, *Neurological*.
- **Interactive Symptom Chips**:
  - Unselected: Dark slate pill with subtle hover glow.
  - Selected: Bright indigo/teal gradient background with checkmark icon and slight pop animation (`transform: scale(1.04)`).
- **Live Search Filter**: Instant auto-suggest with highlighted matching characters.

### 4.3 Prediction Results Card (Top 3 Differential)
- **Rank #1 (Primary Match)**:
  - Highlighted with a luminous glowing indigo border.
  - Circular or linear progress bar showing confidence (e.g. `84.5% Match`).
  - Quick action tab switcher: *Overview*, *Precautions*, *Diet & Nutrition*, *Lifestyle & Workout*, *Prescription Meds*.
- **Rank #2 & #3 (Alternative Differentials)**:
  - Compact collapsible cards showing secondary possibilities with confidence meters.

### 4.4 Medicine Cards & Detailed Drug Drawer
- **Prescription Status Pill**:
  - `Rx Required`: Amber badge with medical prescription icon.
  - `OTC / General`: Emerald green badge.
- **Price Tag**: Clean stylized currency display (`₹120.00`).
- **Manufacturer & Composition**: Structured two-column attribute grid.

### 4.5 Emergency Interceptor Modal
- Dark crimson backdrop with pulsing alert icon.
- Prominent message: **"URGENT MEDICAL ATTENTION ADVISED"**.
- Direct click-to-call links for emergency hotlines (108 / 911 / 112).

---

## 5. Responsive Layout & Breakpoints

- **Mobile ($< 640\text{px}$)**: Single column stack, sticky bottom action bar for running analysis.
- **Tablet ($640\text{px} - 1024\text{px}$)**: Two-column grid for symptom selection; side-by-side results view.
- **Desktop ($> 1024\text{px}$)**: 12-column layout with fixed filter sidebar, dynamic main content canvas, and real-time floating care-plan drawer.
