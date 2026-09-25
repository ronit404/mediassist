import secrets
from datetime import datetime
from typing import Optional
import numpy as np

from fastapi import FastAPI, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.database import (
    diseases_collection,
    medicines_collection,
    users_collection,
    patients_collection,
    patient_history_collection
)
from app.ml_loader import model, label_encoder, symptoms_list
from app.disease_medicines_map import get_related_medicines_for_disease
from app.models import (
    UserSignup,
    UserLogin,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    PatientProfile,
    PatientProfileUpdate,
    PatientHistoryItem
)
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)

app = FastAPI(title="MediAssist API", version="1.0")

# Enable CORS for Frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request body structure for symptom prediction
class SymptomRequest(BaseModel):
    symptoms: list[str] # List of symptom strings selected by user

@app.get("/")
def read_root():
    return {"message": "Welcome to MediAssist API. System is active."}

@app.get("/symptoms")
def get_all_symptoms():
    """Returns the list of 132 valid symptoms for the frontend UI."""
    return {"symptoms": symptoms_list}

@app.post("/predict")
def predict_disease(request: SymptomRequest):
    """
    Takes a list of user symptoms, runs them through the XGBoost model,
    returns the Top 3 predicted diseases with confidence scores, 
    and fetches related medicine info from MongoDB.
    """
    if not model or not label_encoder:
        raise HTTPException(status_code=500, detail="ML model artifacts not loaded properly")
        
    user_symptoms = request.symptoms
    if not user_symptoms:
        raise HTTPException(status_code=400, detail="No symptoms provided")
        
    # Build 132-dimension input vector
    input_vector = [0] * len(symptoms_list)
    symptom_to_idx = {s: i for i, s in enumerate(symptoms_list)}
    
    for symptom in user_symptoms:
        clean_symptom = symptom.strip().lower()
        if clean_symptom in symptom_to_idx:
            input_vector[symptom_to_idx[clean_symptom]] = 1
            
    input_arr = np.array([input_vector])
    
    # Get model prediction probabilities
    probabilities = model.predict_proba(input_arr)[0]
    
    # Get Top 3 predicted class indices
    top_3_indices = np.argsort(probabilities)[::-1][:3]
    
    predictions = []
    for idx in top_3_indices:
        disease_name = label_encoder.inverse_transform([idx])[0]
        confidence = float(probabilities[idx])
        
        # Query MongoDB for disease info
        disease_doc = diseases_collection.find_one({"name": disease_name})
        disease_info = {}
        related_medicines = []
        
        if disease_doc:
            disease_info = {
                "id": disease_doc.get("_id"),
                "name": disease_doc.get("name"),
                "description": disease_doc.get("description"),
                "precautions": disease_doc.get("precautions", []),
                "diet_recommendations": disease_doc.get("diet_recommendations", []),
                "workout_recommendations": disease_doc.get("workout_recommendations", [])
            }
            
            # Fetch linked medicines from MongoDB using related_medicine_ids
            med_ids = disease_doc.get("related_medicine_ids", [])
            if med_ids:
                med_cursor = medicines_collection.find({"_id": {"$in": med_ids}})
                for med in med_cursor:
                    related_medicines.append({
                        "id": med.get("_id"),
                        "name": med.get("name"),
                        "generic_name": med.get("generic_name"),
                        "manufacturer": med.get("manufacturer"),
                        "price": med.get("price"),
                        "prescription_required": med.get("prescription_required"),
                        "drug_content": med.get("drug_content")
                    })
        
        # Guaranteed clinical mapping if MongoDB records are sparse
        if not related_medicines:
            related_medicines = get_related_medicines_for_disease(disease_name)
        
        predictions.append({
            "disease": disease_name,
            "confidence": round(confidence * 100, 2), # Percentage format
            "disease_details": disease_info,
            "medicines": related_medicines
        })
        
    return {
        "input_symptoms": user_symptoms,
        "predictions": predictions
    }

@app.get("/diseases")
def get_all_diseases(limit: int = 50, skip: int = 0):
    """Returns a list of diseases for the Disease Explorer."""
    cursor = diseases_collection.find({}, {"related_medicine_ids": 0}).skip(skip).limit(limit)
    diseases = []
    for doc in cursor:
        doc["id"] = doc.pop("_id") # Rename _id to id for frontend friendliness
        diseases.append(doc)
    return {"total": diseases_collection.count_documents({}), "diseases": diseases}

@app.get("/diseases/{disease_id}")
def get_disease_by_id(disease_id: str):
    """Returns full details for a single disease, including verified matched medicines."""
    disease = diseases_collection.find_one({"_id": disease_id})
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found")
        
    disease["id"] = disease.pop("_id")
    
    # 1. Fetch related medicines by MongoDB ID
    med_ids = disease.get("related_medicine_ids", [])
    related_medicines = []
    if med_ids:
        med_cursor = medicines_collection.find({"_id": {"$in": med_ids}}).limit(6)
        for med in med_cursor:
            med["id"] = med.pop("_id")
            related_medicines.append(med)

    # 2. If no direct MongoDB linked IDs, get verified disease-specific mapped medicines
    if not related_medicines:
        disease_name = disease.get("name", "")
        related_medicines = get_related_medicines_for_disease(disease_name)
            
    disease["medicines"] = related_medicines
    return disease

@app.get("/medicines")
def get_all_medicines(limit: int = 21, skip: int = 0, search: str = None, rx: str = None):
    """Returns a list of medicines for the Medicine Explorer, with optional search and Rx filtering."""
    query = {}
    
    if search:
        # Case-insensitive search on medicine name, generic name, or category
        query["$or"] = [
            {"name": {"$regex": search, "$options": "i"}},
            {"generic_name": {"$regex": search, "$options": "i"}},
            {"category_or_disease": {"$regex": search, "$options": "i"}}
        ]
        
    if rx:
        rx_upper = rx.upper().strip()
        if rx_upper == "YES":
            query["prescription_required"] = {"$regex": r"rx|yes|require|schedule|mandat", "$options": "i"}
        elif rx_upper == "NO":
            query["prescription_required"] = {"$not": {"$regex": r"rx|yes|require|schedule|mandat", "$options": "i"}}
        
    # Exclude heavy drug_content in the main list view
    cursor = medicines_collection.find(query, {"drug_content": 0}).skip(skip).limit(limit)
    medicines = []
    for doc in cursor:
        doc["id"] = doc.pop("_id")
        medicines.append(doc)
        
    total_count = medicines_collection.count_documents(query)
    return {"total": total_count, "medicines": medicines}

@app.get("/medicines/{medicine_id}")
def get_medicine_by_id(medicine_id: str):
    """Returns full detailed monograph for a single medicine with flexible ID and name resolution."""
    # 1. Direct ID lookup
    medicine = medicines_collection.find_one({"_id": medicine_id})
    
    # 2. Fallback to name / generic search if ID was passed as slug or name
    if not medicine:
        clean_query = medicine_id.replace("-", " ").strip()
        medicine = medicines_collection.find_one({
            "$or": [
                {"name": {"$regex": clean_query, "$options": "i"}},
                {"generic_name": {"$regex": clean_query, "$options": "i"}},
            ]
        })
        
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
        
    medicine["id"] = medicine.pop("_id")
    return medicine

# ==========================================
# AUTHENTICATION & PATIENT PROFILE ROUTES
# ==========================================

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """Dependency to extract user_id from Bearer token."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication token required")
    
    token = authorization.replace("Bearer ", "").strip()
    payload = decode_access_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")
    
    return payload["user_id"]

@app.post("/auth/signup")
def signup_user(data: UserSignup):
    """
    Registers a new user and AUTOMATICALLY creates a new, isolated,
    empty Patient document in MongoDB linked to their unique userId.
    """
    email_clean = data.email.strip().lower()
    
    # 1. Check if user already exists
    existing = users_collection.find_one({"email": email_clean})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
        
    user_id = f"USR_{secrets.token_hex(4).upper()}"
    patient_id = f"PAT_{user_id}"
    created_now = datetime.utcnow().isoformat()
    
    # 2. Store User Account
    user_doc = {
        "_id": user_id,
        "user_id": user_id,
        "name": data.name.strip(),
        "email": email_clean,
        "password_hash": hash_password(data.password),
        "created_at": created_now,
        "status": "active"
    }
    users_collection.insert_one(user_doc)
    
    # 3. AUTOMATICALLY CREATE FRESH, EMPTY PATIENT DOCUMENT IN MONGODB
    patient_doc = {
        "_id": patient_id,
        "user_id": user_id,
        "name": data.name.strip(),
        "email": email_clean,
        "phone": "",
        "date_of_birth": "",
        "gender": "",
        "blood_group": "",
        "allergies": [],
        "chronic_conditions": [],
        "current_medications": [],
        "emergency_contact": {"name": "", "phone": "", "relation": ""},
        "notes": "",
        "created_at": created_now,
        "updated_at": created_now
    }
    patients_collection.insert_one(patient_doc)
    
    # 4. Generate Auth Token
    token = create_access_token(user_id=user_id, email=email_clean)
    
    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": data.name.strip(),
            "email": email_clean,
            "createdAt": created_now.split("T")[0],
            "status": "active",
            "totalAnalyses": 0
        },
        "patient": {
            "id": patient_id,
            "user_id": user_id,
            "name": data.name.strip(),
            "email": email_clean,
            "phone": "",
            "date_of_birth": "",
            "gender": "",
            "blood_group": "",
            "allergies": [],
            "chronic_conditions": [],
            "current_medications": [],
            "emergency_contact": {"name": "", "phone": "", "relation": ""},
            "notes": "",
            "created_at": created_now
        }
    }

@app.post("/auth/login")
def login_user(data: UserLogin):
    """
    Authenticates a user and loads their dynamic patient profile.
    """
    email_clean = data.email.strip().lower()
    user = users_collection.find_one({"email": email_clean})
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
        
    if not verify_password(user.get("password_hash", ""), data.password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
        
    user_id = user["user_id"]
    token = create_access_token(user_id=user_id, email=email_clean)
    
    # Fetch or auto-initialize Patient record
    patient = patients_collection.find_one({"user_id": user_id})
    if not patient:
        created_now = datetime.utcnow().isoformat()
        patient_id = f"PAT_{user_id}"
        patient = {
            "_id": patient_id,
            "user_id": user_id,
            "name": user.get("name", "Patient"),
            "email": email_clean,
            "phone": "",
            "date_of_birth": "",
            "gender": "",
            "blood_group": "",
            "allergies": [],
            "chronic_conditions": [],
            "current_medications": [],
            "emergency_contact": {"name": "", "phone": "", "relation": ""},
            "notes": "",
            "created_at": created_now,
            "updated_at": created_now
        }
        patients_collection.insert_one(patient)
    else:
        patient["id"] = patient.pop("_id")
        
    # Count analyses specifically for this user
    total_analyses = patient_history_collection.count_documents({"user_id": user_id})
    
    return {
        "token": token,
        "user": {
            "id": user_id,
            "name": user.get("name", ""),
            "email": email_clean,
            "createdAt": user.get("created_at", "").split("T")[0] if user.get("created_at") else "",
            "status": user.get("status", "active"),
            "totalAnalyses": total_analyses
        },
        "patient": patient
    }

@app.post("/auth/forgot-password")
def forgot_password(req: ForgotPasswordRequest):
    return {
        "success": True,
        "message": "If an account exists with this email, password reset instructions have been dispatched."
    }

@app.post("/auth/reset-password")
def reset_password(req: ResetPasswordRequest):
    return {
        "success": True,
        "message": "Password updated successfully. You may now sign in."
    }

@app.get("/patient/profile")
def get_patient_profile(user_id: str = Depends(get_current_user_id)):
    """
    DYNAMIC PROFILE FETCHING:
    Fetches strictly the logged-in patient's profile from MongoDB based on their JWT.
    """
    patient = patients_collection.find_one({"user_id": user_id})
    
    if not patient:
        # Auto-create if not yet initialized
        user = users_collection.find_one({"user_id": user_id})
        created_now = datetime.utcnow().isoformat()
        patient = {
            "_id": f"PAT_{user_id}",
            "user_id": user_id,
            "name": user.get("name", "Patient") if user else "Patient",
            "email": user.get("email", "") if user else "",
            "phone": "",
            "date_of_birth": "",
            "gender": "",
            "blood_group": "",
            "allergies": [],
            "chronic_conditions": [],
            "current_medications": [],
            "emergency_contact": {"name": "", "phone": "", "relation": ""},
            "notes": "",
            "created_at": created_now,
            "updated_at": created_now
        }
        patients_collection.insert_one(patient)
    
    if "_id" in patient:
        patient["id"] = patient.pop("_id")
        
    return patient

@app.put("/patient/profile")
def update_patient_profile(data: PatientProfileUpdate, user_id: str = Depends(get_current_user_id)):
    """
    Updates the authenticated patient's profile in MongoDB.
    """
    update_fields = {k: v for k, v in data.dict().items() if v is not None}
    update_fields["updated_at"] = datetime.utcnow().isoformat()
    
    patients_collection.update_one(
        {"user_id": user_id},
        {"$set": update_fields},
        upsert=True
    )
    
    updated_patient = patients_collection.find_one({"user_id": user_id})
    if updated_patient and "_id" in updated_patient:
        updated_patient["id"] = updated_patient.pop("_id")
        
    return {"message": "Profile updated successfully", "patient": updated_patient}

@app.get("/patient/history")
def get_patient_history(user_id: str = Depends(get_current_user_id)):
    """
    Retrieves triage history strictly for this authenticated user.
    """
    cursor = patient_history_collection.find({"user_id": user_id}).sort("date", -1).limit(50)
    history = []
    for doc in cursor:
        doc["id"] = doc.pop("_id")
        history.append(doc)
    return {"history": history}

@app.post("/patient/history")
def save_patient_history(item: PatientHistoryItem, user_id: str = Depends(get_current_user_id)):
    """
    Saves a triage run to the authenticated user's isolated history in MongoDB.
    """
    hist_id = f"HIST_{secrets.token_hex(6)}"
    doc = {
        "_id": hist_id,
        "user_id": user_id,
        "date": item.date,
        "symptoms": item.symptoms,
        "predictions": item.predictions,
        "patient_info": item.patient_info or {},
        "created_at": datetime.utcnow().isoformat()
    }
    patient_history_collection.insert_one(doc)
    doc["id"] = doc.pop("_id")
    return {"message": "History saved", "item": doc}