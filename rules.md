# MediAssist — Engineering & Safety Rules (`rules.md`)

## 1. Core Healthcare Safety & Ethical Guardrails

1. **Informational & Educational Position Only**:
   - MediAssist is an educational decision-support platform, **NOT** an autonomous physician or prescription generator.
   - Every user-facing prediction and medicine detail view must prominently feature a standard medical disclaimer.

2. **Zero Dosage Hallucination**:
   - The system must **NEVER** invent, generate, or extrapolate medicine dosages or treatment durations using generative AI.
   - All dosage, duration, and age guidance must strictly originate from verified structured database records.

3. **Emergency Symptom Interception**:
   - Critical life-threatening symptoms (e.g., severe chest pain, severe breathing difficulty, loss of consciousness, uncontrolled bleeding) must trigger an immediate safety override modal directing users to emergency healthcare services (108 / 911 / 112).
   - The normal recommendation flow must be halted during emergency detection.

4. **Multi-Class Differential Reporting**:
   - Never present a single condition as an absolute diagnosis. Always display the **Top 3 Differential Conditions** with explicit probability percentages.

---

## 2. Token Optimization & Inspection Rules

1. **Limited JSON File Inspection**:
   - When inspecting processed datasets (such as `processed_diseases.json` or `processed_medicines.json`), **never view or dump full files**.
   - Always limit inspection to a sample batch of **at most 5 records** using slicing, line ranges, or specific document queries.
2. **Lean Database Queries**:
   - All list-view MongoDB queries must use projection to exclude bulky fields (`drug_content`, full symptoms arrays) to keep payloads lean and fast.

---

## 3. Development Workflow & Execution Rules

1. **Direct Terminal Execution in Antigravity**:
   - All ML training, data pipelines, and backend servers must be executed directly via Python scripts inside Antigravity's integrated environment without relying on external Jupyter Notebooks.
2. **Sequential Step-by-Step Discipline**:
   - Work must proceed phase-by-phase.
   - A phase must be validated and tested before advancing to the subsequent phase.
3. **Reproducibility**:
   - All ML splits and synthetic noise injection scripts must use fixed random seeds (`random_state=42`) for consistent behavior.

---

## 4. Frontend & UI/UX Standards

1. **Rich Modern Aesthetics**:
   - Standard, unstyled, or basic UI is strictly prohibited.
   - Apply a cohesive color system (Clinical Indigo, Teal Accent, Slate Dark Mode, Frosted Glass glassmorphism with subtle borders and shadows).
2. **Typography**:
   - Use modern Google Fonts (**Plus Jakarta Sans** for headers, **Inter** for data). Avoid standard browser fonts.
3. **Dynamic Feedback & Micro-Animations**:
   - All interactive chips, buttons, and card accordions must feature responsive hover states, smooth transitions, and clear loading/empty states.
4. **Responsive & Accessible (WCAG AA)**:
   - Provide seamless UX across mobile ($<640\text{px}$), tablet, and desktop viewports with high color contrast.
