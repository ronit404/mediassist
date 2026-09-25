# 🏥 MediAssist — AI Clinical Triage & Pharmaceutical Intelligence

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

> An intelligent, clinical decision-support platform delivering symptom triage, verified pharmaceutical monographs, condition-to-medication mapping, and personalized patient health history.

---

## 🌟 Overview

**MediAssist** bridges the gap between machine learning diagnostics and everyday patient health literacy. It empowers users to analyze symptoms using trained differential models, explore verified pharmaceutical monographs, discover related treatments for clinical conditions, and maintain an encrypted record of past triage assessments.

---

## ✨ Core Features

### 🤖 1. AI Symptom Checker & Clinical Triage
- **Machine Learning Differential Diagnosis:** Evaluates multi-symptom clusters to compute probability-weighted disease predictions.
- **Red-Flag Emergency Interception:** Automatically identifies high-risk clinical symptoms (e.g. severe chest pain, breathlessness) and triggers emergency safety guardrails with direct dial links (`108` / `911`).
- **Comprehensive Guidance:** Delivers lifestyle recommendations, precautions, dietary advice, and verified workout guidelines.

### 💊 2. Verified Pharmaceutical Catalog
- **Detailed Monographs:** Search across comprehensive drug profiles containing generic names, therapeutic classifications, dosage formats, prices, and prescribing requirements.
- **Dynamic Cross-Linking:** Real-time search filters by category, drug content, and manufacturer.

### 🩺 3. Disease Directory & Medication Linkage
- **Clinical Condition Profiles:** Deep-dive directory covering etiology, precautions, and verified treatment protocols.
- **Integrated Medication Mapping:** Direct database foreign key linkage connecting clinical conditions to approved pharmaceutical therapies.

### 📋 4. Patient Health Record & History
- **Persistent Assessment Logs:** Triage evaluations are automatically synced with MongoDB and isolated per verified patient profile.
- **Actionable Timeline:** View past symptoms, diagnostic outcomes, confidence percentages, and timestamps.

### 🔐 5. Secure Authentication & Modern UX
- **Route Guard Protection:** Sensitive medical routes (`/symptom-checker`, `/history`, `/profile`) are protected with token-based session checks.
- **Glassmorphic Auth Modals:** Zero-friction login and registration directly from any page without losing navigation state.
- **🌓 Adaptive Theme Engine:** Seamless switching between Dark and Light modes with tailored contrast ratios.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** [Next.js 16 (Turbopack, App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Vanilla CSS & Tailwind CSS v4
- **Icons:** [Lucide React](https://lucide.dev/)
- **State & Theme:** React Context API & `next-themes`

### Backend
- **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous Python Web Framework)
- **Database:** [MongoDB](https://www.mongodb.com/) (via PyMongo)
- **Authentication:** JWT (JSON Web Tokens), Passlib (BCrypt password hashing)
- **Machine Learning:** Scikit-Learn (Random Forest & Multi-layer Decision Classifiers), NumPy, Pandas

---

## 🚀 Getting Started

Follow these steps to set up and run MediAssist locally.

### Prerequisites
- **Node.js** (v18.0 or higher) & **npm**
- **Python** (v3.10 or higher)
- **MongoDB Community Server** running on `mongodb://localhost:27017`

---

### 1. Clone the Repository
```bash
git clone https://github.com/ronit404/mediassist.git
cd mediassist
```

---

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create and activate a Python virtual environment
python -m venv venv

# On Windows:
.\venv\Scripts\activate

# On macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn app.main:app --reload --port 8000
```
> The backend API will be running at `http://localhost:8000` (API Docs: `http://localhost:8000/docs`).

---

### 3. Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start the Next.js development server
npm run dev
```
> Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## ⚙️ Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `MONGO_URI` | `mongodb://localhost:27017/` | MongoDB connection URI |
| `DATABASE_NAME` | `mediassist_db` | Main application database name |
| `JWT_SECRET` | `your-secure-random-secret-key` | Secret key used for signing JWT tokens |
| `JWT_ALGORITHM` | `HS256` | JWT cryptographic algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Auth token validity duration (in minutes) |

### Frontend Configuration (`frontend/.env.local`)

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | URL of the FastAPI backend service |

---

## 📁 Project Structure

```text
mediassist/
├── backend/
│   ├── app/
│   │   ├── auth.py                  # JWT authentication & password hashing
│   │   ├── database.py              # MongoDB connection & collections
│   │   ├── disease_medicines_map.py # Verified disease-to-medication mapping
│   │   ├── main.py                  # FastAPI route handlers & endpoints
│   │   ├── ml_loader.py             # Scikit-learn model inference loader
│   │   └── models.py                # Pydantic data schemas
│   ├── ml_pipeline/
│   │   ├── models/                  # Serialized .pkl models & symptom list
│   │   └── train_model.py           # ML training script
│   └── requirements.txt             # Python dependencies
│
├── frontend/
│   ├── public/                      # Static assets & favicons
│   ├── src/
│   │   ├── app/                     # Next.js App Router pages
│   │   ├── components/
│   │   │   ├── auth/                # Modal dialogs & login/signup forms
│   │   │   ├── layout/              # Navbar, Sidebar, Header, Footer
│   │   │   ├── theme/               # Theme toggle component
│   │   │   └── ui/                  # Cards, Emergency modal, Skeletons
│   │   ├── context/                 # AuthContext & Session management
│   │   ├── lib/                     # API client & helper utilities
│   │   ├── providers/               # Next-themes provider wrapper
│   │   └── types/                   # TypeScript interfaces
│   └── package.json                 # Frontend dependencies
│
├── .gitignore                       # Root Git ignore rules
└── README.md                        # Documentation
```

---

## ⚠️ Important Medical Disclaimer

> **MediAssist is developed strictly for educational, informational, and triage support purposes.**
>
> It does **not** provide confirmed medical diagnoses, clinical prescriptions, or emergency healthcare services. Always consult a qualified physician or healthcare provider for medical evaluations.
>
> If you are experiencing a life-threatening emergency, acute chest pain, trauma, or severe shortness of breath, please **dial emergency services immediately (`108` / `112` / `911`)** or proceed to your nearest emergency department.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
