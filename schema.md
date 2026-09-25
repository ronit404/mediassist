# MediAssist — Database Schema & Data Models (`schema.md`)

## 1. Database Architecture & Design Principles

MediAssist utilizes **Local MongoDB** (`mongodb://localhost:27017`) as its centralized NoSQL document store (`mediassist_db`). The database schema balances high-speed read projections for the web application with normalized relational linking via Canonical IDs (`D001`–`D041` for Diseases, `M0001`+ for Medicines).

> **Token Optimization Rule**: When inspecting processed datasets or database documents, **never dump full JSON files**. Always limit checks to sample batches of **5 records** using slice/pagination parameters or targeted queries.

---

## 2. Collection Schemas

### 2.1 `diseases` Collection

Stores comprehensive medical intelligence for the 41 canonical health conditions.

#### Schema Definition & Field Types
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | String | Unique Canonical Disease ID (e.g., `"D001"`, `"D012"`) |
| `name` | String | Standard clinical name (e.g., `"Influenza"`, `"Malaria"`) |
| `aliases` | Array of Strings | Alternative names / synonyms (e.g., `["Flu", "Seasonal Influenza"]`) |
| `description` | String | Detailed clinical description of pathology and presentation |
| `symptoms` | Array of Strings | Standardized symptom features associated with this condition |
| `precautions` | Array of Strings | 4-tier immediate precautionary measures |
| `diet_recommendations` | Array of Strings | Evidence-backed dietary suggestions |
| `workout_recommendations` | Array of Strings | Physical activity guidelines & rest protocols |
| `related_medicine_ids` | Array of Strings | Foreign keys referencing `medicines._id` (Top 5 matched drugs) |

#### Sample Document
```json
{
  "_id": "D012",
  "name": "Influenza",
  "aliases": ["Flu", "Seasonal Flu"],
  "description": "Influenza is a viral infection that attacks your respiratory system — your nose, throat and lungs.",
  "symptoms": [
    "chills",
    "fever",
    "cough",
    "headache",
    "fatigue",
    "throat_irritation",
    "muscle_pain"
  ],
  "precautions": [
    "drink fluids and stay hydrated",
    "take adequate bed rest",
    "isolate to prevent spreading to others",
    "consult a doctor if difficulty breathing occurs"
  ],
  "diet_recommendations": [
    "Warm broths and soups",
    "Vitamin C rich fruits (oranges, kiwi)",
    "Ginger and honey tea",
    "Adequate water intake"
  ],
  "workout_recommendations": [
    "Strict bed rest during febrile phase",
    "Light walking only after fever subsides for 48 hours"
  ],
  "related_medicine_ids": [
    "M0012",
    "M0045",
    "M0108"
  ]
}
```

#### MongoDB Indexes
```javascript
db.diseases.createIndex({ "name": 1 }, { unique: true });
db.diseases.createIndex({ "symptoms": 1 });
```

---

### 2.2 `medicines` Collection

Stores curated verified pharmaceutical data linked to diseases.

#### Schema Definition & Field Types
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | String | Unique Canonical Medicine ID (e.g., `"M0001"`, `"M0045"`) |
| `name` | String | Commercial/Brand product name |
| `generic_name` | String | Active pharmaceutical ingredient (API) / Salt composition |
| `category_or_disease` | String | Primary therapeutic application / matching condition |
| `manufacturer` | String | Pharmaceutical manufacturing company |
| `prescription_required` | String | `"Yes"` / `"No"` / `"Rx Required"` flag |
| `price` | String | Indicative retail pricing |
| `drug_content` | String | Detailed clinical composition, strength, and mechanism |
| `image_urls` | String | Product packaging image URL (if available) |

#### Sample Document
```json
{
  "_id": "M0045",
  "name": "Antiflu 75mg Capsule",
  "generic_name": "Oseltamivir Phosphate (75mg)",
  "category_or_disease": "Influenza",
  "manufacturer": "Cipla Ltd",
  "prescription_required": "Yes",
  "price": "₹450.00",
  "drug_content": "Antiviral drug that blocks the actions of influenza virus types A and B in the body.",
  "image_urls": "https://assets.mediassist.local/meds/antiflu.png"
}
```

#### MongoDB Indexes
```javascript
db.medicines.createIndex({ "name": "text", "generic_name": "text" });
db.medicines.createIndex({ "category_or_disease": 1 });
db.medicines.createIndex({ "prescription_required": 1 });
```

---

### 2.3 `prediction_history` Collection *(Phase 6+)*

Tracks previous symptom analyses for user decision-support history.

#### Schema Definition & Field Types
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | MongoDB auto-generated document ID |
| `user_id` | String | Associated user identifier (or `"guest"`) |
| `age` | Integer | User-provided age at assessment time |
| `weight` | Float | User-provided body weight (kg) |
| `symptoms` | Array of Strings | Selected symptom tags |
| `predictions` | Array of Objects | Top-3 differentials with disease names and confidence scores |
| `created_at` | Timestamp | ISO 8601 creation datetime |

#### Sample Document
```json
{
  "_id": "66d6a2f8e12b4a0012345678",
  "user_id": "U001",
  "age": 28,
  "weight": 72.5,
  "symptoms": ["fever", "cough", "fatigue"],
  "predictions": [
    { "disease_id": "D012", "disease_name": "Influenza", "confidence": 84.52 },
    { "disease_id": "D003", "disease_name": "Common Cold", "confidence": 61.20 },
    { "disease_id": "D025", "disease_name": "Viral Fever", "confidence": 49.80 }
  ],
  "created_at": "2026-09-02T16:40:00Z"
}
```

---

## 3. Data Integrity & Verification Guidelines

1. **Relational Integrity**: Every ID inside `diseases.related_medicine_ids` must correspond to a valid `_id` inside `medicines`.
2. **Projections**: The API must exclude heavy text attributes (such as `drug_content` in medicine catalogs and full `symptoms` arrays in disease listings) unless accessing a specific item by ID.
3. **Safe Inspection Protocol**: Inspect processed files using limited queries:
   ```python
   # Example: Inspecting 5 sample items safely
   with open('data/processed/processed_diseases.json') as f:
       sample_5 = json.load(f)[:5]
   print(sample_5)
   ```
