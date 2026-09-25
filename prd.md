# MediAssist — Product Requirements Document (PRD)

## 1. Executive Summary
**MediAssist** is an AI-powered healthcare information and clinical decision-support platform designed to centralize and demystify medical information. It allows users to assess symptoms through Machine Learning-based disease prediction, explore structured medical knowledge for 41+ conditions, and inspect verified drug labels, generic compositions, precautions, diets, and lifestyle workouts.

> **Crucial Medical Disclaimer**: MediAssist is an educational and informational decision-support tool. It is **NOT** a certified diagnostic medical device, does not provide clinical prescriptions, and does not replace professional consultation with licensed healthcare providers.

---

## 2. Problem Statement
Patients, caregivers, and curious users typically face a fragmented healthcare information landscape:
1. **Search Query Overwhelm**: Searching vague symptoms leads to panic-inducing search engine results without structured triage.
2. **Disconnected Drug Data**: Medicine details, active ingredients, warnings, and precautions are scattered across disparate portals.
3. **Black-box Predictions**: Symptom checkers often output a single opaque result without displaying top differential probabilities or actionable, non-pharmacological care (precautions, diet, physical activity).

---

## 3. Product Vision & Goals
- **Unified Health Intelligence**: Bridge symptoms, predicted health conditions, and verified medicine catalogs through normalized data schemas.
- **Explainable Symptom Triage**: Predict Top 3 differential conditions with confidence percentages and safety guardrails.
- **Patient Safety First**: Hardcoded red-flag emergency detection that halts AI analysis for life-threatening symptoms and directs users to emergency services.
- **Clean, Responsive UI/UX**: Deliver a modern, accessible healthcare interface optimized for patients and administrators.

---

## 4. Target Personas
1. **General Patient / User**: Needs to understand mild or sudden symptoms, explore home precautions, and check drug compositions and safety.
2. **Caregiver / Family Member**: Verifies medication details, generic names, and dietary restrictions for family members.
3. **Medical Student / Researcher**: Studies symptom-disease relationships, multi-label classifications, and pharmaceutical data mappings.
4. **Platform Administrator**: Monitors analytics, user prediction trends, system health, and database catalogs.

---

## 5. Scope & Feature Specifications

### 5.1 Dataset Scope (Dual-Dataset Strategy)
To ensure optimal performance and avoid noisy merges:
- **Dataset 1 (Symptom-Disease Knowledgebase)**: 41 diseases, 132 binary symptom indicators, descriptions, precautions (4 tiers), dietary plans, and recommended physical activities.
- **Dataset 2 (Pharmaceutical Catalog)**: Filtered curated medicine records with brand names, generic formulations, manufacturers, prescription mandates, pricing, and drug content descriptions linked directly to canonical disease IDs.

### 5.2 Core Feature Modules

#### Module 1: Home & Discovery Hub
- Hero section with quick-action shortcuts (Symptom Checker, Medicine Explorer, Disease Explorer).
- Featured popular diseases and verified medicine search bar.
- Permanent persistent safety disclaimers.

#### Module 2: AI Symptom Checker
- Dynamic category-based symptom selector (General, Respiratory, Digestive, Neurological, Skin, etc.) covering 132 standardized symptoms.
- Multi-factor metadata collection: Patient Age, Weight, Duration, and Severity level.
- **Red-Flag Emergency Interceptor**: Immediate override modal for critical emergency symptoms (e.g., severe chest pain, loss of consciousness, severe respiratory distress).
- **ML Differential Output**: Top 3 ranked disease predictions with confidence percentages (XGBoost classifier).
- **Holistic Care Plan Display**:
  - Detailed disease description.
  - Multi-step precautions.
  - Tailored nutritional guidelines (diets).
  - Recommended workout & lifestyle adjustments.
  - Linked verified medications with prescription flags.

#### Module 3: Medicine Explorer
- Searchable directory supporting fuzzy lookup by Brand Name or Generic Ingredient.
- Categorical and disease-mapped filtering.
- Detailed Medicine View: Brand name, generic composition, manufacturer, pricing, prescription status, and complete drug composition details.

#### Module 4: Disease Explorer
- 41 standard conditions with categorical tags.
- Detailed view presenting etiology, characteristic symptom signatures, precautions, diets, and linked medications.

#### Module 5: User History & Profiles (Phase 6+)
- Personal symptom assessment log with timestamps, selected symptoms, and top predictions.
- Privacy-compliant record deletion.

#### Module 6: Admin Dashboard (Phase 8)
- Real-time prediction analytics, most frequently reported symptoms, and disease query heatmaps.
- Database catalog management.

---

## 6. Non-Functional Requirements
- **Performance**: ML prediction API response time $< 250\text{ms}$; MongoDB indexed queries $< 50\text{ms}$.
- **Accuracy**: Weighted F1-score $> 95\%$ on 41-class disease prediction benchmark with synthetic noise robustness.
- **Reliability & Availability**: 99.9% uptime with stateless FastAPI service.
- **Compliance & Safety**: Prominent disclaimer on all prediction and drug detail views. No AI-hallucinated dosages or treatment lengths.
