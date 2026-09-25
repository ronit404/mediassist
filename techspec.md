# MediAssist — Technical Specification (`techspec.md`)

## 1. System Architecture Overview

MediAssist is engineered as a decoupled full-stack platform utilizing modern asynchronous Python on the backend, Local MongoDB as the primary document store, an optimized XGBoost classifier for multi-class symptom prediction, and a modern React / Next.js single-page application on the frontend.

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND LAYER                         │
│   Next.js / React + Vanilla CSS / Tailwind Modern UI        │
│   • Symptom Selector & Triage Form                          │
│   • Medicine & Disease Explorers                            │
│   • Emergency Interceptor & Results Dashboard               │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                       BACKEND API                           │
│                FastAPI + Uvicorn Async Server                │
│   • /predict (Vector inference + MongoDB aggregation)       │
│   • /symptoms (132 standardized symptom registry)           │
│   • /diseases & /medicines (Pagination, Regex search)       │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│         ML INFERENCE         │ │       DATABASE LAYER       │
│  XGBoost Multi-Class Model   │ │  Local MongoDB (localhost) │
│  • 132-dim binary vector     │ │  • diseases collection     │
│  • Top-3 ranked confidence   │ │  • medicines collection    │
│  • LabelEncoder inverse map  │ │  • B-Tree compound indexes │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## 2. Dataset Strategy & Sourcing

### 2.1 Dataset Inventory & Sources

| Dataset | Primary Source / Download Link | Local Raw File Names | Key Columns / Data Attributes |
| :--- | :--- | :--- | :--- |
| **Dataset 1: Disease-Symptom Knowledgebase** | [Kaggle: Disease Symptom Description Dataset](https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset) & [Kaggle: Disease Prediction Dataset](https://www.kaggle.com/datasets/kaushil268/disease-prediction-using-machine-learning) | `Training.csv`<br>`description.csv`<br>`precautions_df.csv`<br>`medications.csv`<br>`diets.csv`<br>`workout_df.csv`<br>`Symptom-severity.csv` | `prognosis`, 132 symptom indicator columns (`itching`, `skin_rash`, etc.), `Description`, `Precaution_1`–`4`, `Medication`, `Diet`, `workout` |
| **Dataset 2: Medicine Information Catalog** | [Kaggle: Indian Medicines Dataset](https://www.kaggle.com/datasets/sharthz23/indian-medicines-dataset) / Curated Drug Label Subset | `medicines_raw.csv` | `med_name`, `generic_name`, `disease_name`, `drug_manufacturer`, `prescription_required`, `final_price`, `drug_content`, `img_urls` |

> **Note on Dataset 3 (Drug Reviews)**: Deferred for future NLP extensions to keep the core token budget and schema lean during initial phases.

---

## 3. Data Engineering & ETL Pipeline

The ETL pipeline runs locally inside Antigravity via standalone Python scripts without needing Jupyter Notebooks.

### Pipeline Stages:
1. **`backend/ml_pipeline/etl_phase1.py`**:
   - Ingests `Training.csv`, `description.csv`, `precautions_df.csv`, `medications.csv`, `diets.csv`, and `workout_df.csv`.
   - Normalizes text, sanitizes list literals via `ast.literal_eval`.
   - Generates canonical Disease IDs (`D001` to `D041`).
   - Exports `backend/data/processed/processed_diseases.json`.

2. **`backend/ml_pipeline/etl_phase2.py`**:
   - Ingests raw `medicines_raw.csv` (23,000+ entries).
   - Filters down to strictly relevant records matching the 41 canonical diseases and target medications.
   - Assigns unique canonical IDs (`M0001`, `M0002`, ...).
   - Generates bidirectional links: updates `related_medicine_ids` inside `processed_diseases.json` (capped at top 5 per disease for fast UI loads).
   - Exports `backend/data/processed/processed_medicines.json`.

3. **`backend/ml_pipeline/import_to_db.py`**:
   - Connects to local MongoDB instance using `MONGO_URI` (`mongodb://localhost:27017`) from `backend/.env`.
   - Drops existing collections and loads normalized JSON records with B-tree indexes.

---

## 4. Machine Learning Pipeline (`train_model.py`)

### 4.1 Feature Engineering & Realistic Noise Injection
- **Feature Space**: $N = 132$ binary symptom features ($x_i \in \{0, 1\}$).
- **Target Space**: 41 distinct categorical disease classes encoded with `LabelEncoder`.
- **Noise Injection ($8\%$)**: Synthetic clinical data often overfits with 100% accuracy. To simulate real-world patient reporting errors, 8% of random binary features are flipped before model fitting:
  $$X_{\text{noisy}} = \text{where}(M_{\text{rand}} < 0.08, 1 - X, X)$$
- **Train/Test Split**: 80% training / 20% validation split with stratified random seed.

### 4.2 Model Benchmark & Selection
Models evaluated across 4 core classification metrics:
- **Random Forest Classifier** (`n_estimators=100`, `max_depth=15`)
- **XGBoost Classifier** (`eval_metric='mlogloss'`) — **Selected Champion**
- **Decision Tree Classifier** (`max_depth=10`)
- **Gaussian Naive Bayes**

### 4.3 Saved Model Artifacts (`backend/ml_pipeline/models/`)
- `disease_prediction_model.pkl`: Serialized XGBoost booster.
- `label_encoder.pkl`: Scikit-learn target class encoder.
- `symptoms_list.json`: Serialized 132 symptom column names ordered identically to the feature matrix.

---

## 5. Backend Service Specification (FastAPI)

### 5.1 Environment Configuration (`backend/.env`)
```env
MONGO_URI="mongodb://localhost:27017"
PORT=8000
HOST=0.0.0.0
```

### 5.2 API Contracts

#### `GET /symptoms`
- **Output**: `{ "symptoms": ["itching", "skin_rash", ..., "yellow_crust_ooze"] }` (132 items)

#### `POST /predict`
- **Input**:
```json
{
  "symptoms": ["fever", "cough", "fatigue", "chills"]
}
```
- **Inference Process**:
  1. Map input symptoms to 132-element zero-vector. Set matching indices to `1.0`.
  2. Compute class probabilities: `model.predict_proba(X_input)[0]`.
  3. Extract top 3 indices by descending probability.
  4. Query MongoDB for disease details and linked `related_medicine_ids`.
- **Output**:
```json
{
  "input_symptoms": ["fever", "cough", "fatigue", "chills"],
  "predictions": [
    {
      "disease": "Influenza",
      "confidence": 84.52,
      "disease_details": {
        "id": "D012",
        "name": "Influenza",
        "description": "Influenza is a viral infection...",
        "precautions": ["drink liquids", "rest", "take antiviral medications"],
        "diet_recommendations": ["hot soups", "vitamin C foods"],
        "workout_recommendations": ["light walking after recovery"]
      },
      "medicines": [
        {
          "id": "M0045",
          "name": "Oseltamivir 75mg Capsule",
          "generic_name": "Oseltamivir",
          "manufacturer": "Cipla",
          "price": "₹450",
          "prescription_required": "Yes",
          "drug_content": "Antiviral neuraminidase inhibitor"
        }
      ]
    }
  ]
}
```

#### `GET /diseases` & `GET /diseases/{disease_id}`
- Paginated listing with projection (excluding heavy medicine references) and full ID lookup with resolved medications.

#### `GET /medicines` & `GET /medicines/{medicine_id}`
- Full-text regex search on `name` or `generic_name` with pagination (`limit`, `skip`).

---

## 6. Directory Structure

```
d:\mediassist\
├── backend/
│   ├── .env
│   ├── requirements.txt
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py       # MongoDB client & collection handles
│   │   ├── main.py           # FastAPI routes & prediction logic
│   │   └── ml_loader.py      # ML model, encoder, and symptom loader
│   ├── data/
│   │   ├── raw/              # Original CSV datasets
│   │   └── processed/        # Generated JSON files
│   └── ml_pipeline/
│       ├── etl_phase1.py     # Disease data extraction & formatting
│       ├── etl_phase2.py     # Medicine filtering & disease linking
│       ├── import_to_db.py   # Bulk upsert into local MongoDB
│       ├── train_model.py    # Noise injection & XGBoost training
│       └── models/           # Exported .pkl & .json artifacts
├── frontend/                 # Next.js / React Client Application
├── prd.md
├── techspec.md
├── appflow.md
├── design.md
├── schema.md
├── implementationPlan.md
├── tracker.md
└── rules.md
```
