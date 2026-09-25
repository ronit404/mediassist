from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class UserSignup(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: str
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

class EmergencyContact(BaseModel):
    name: Optional[str] = ""
    phone: Optional[str] = ""
    relation: Optional[str] = ""

class PatientProfile(BaseModel):
    user_id: str
    name: str
    email: str
    phone: Optional[str] = ""
    date_of_birth: Optional[str] = ""
    gender: Optional[str] = ""
    blood_group: Optional[str] = ""
    allergies: List[str] = []
    chronic_conditions: List[str] = []
    current_medications: List[str] = []
    emergency_contact: Optional[EmergencyContact] = None
    notes: Optional[str] = ""
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class PatientProfileUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    allergies: Optional[List[str]] = None
    chronic_conditions: Optional[List[str]] = None
    current_medications: Optional[List[str]] = None
    emergency_contact: Optional[EmergencyContact] = None
    notes: Optional[str] = None

class PatientHistoryItem(BaseModel):
    user_id: str
    date: str
    symptoms: List[str]
    predictions: List[Dict[str, Any]]
    patient_info: Optional[Dict[str, Any]] = None
