import os
import joblib
import json

# Paths relative to backend/app/
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "ml_pipeline", "models")

model_path = os.path.join(MODEL_DIR, "disease_prediction_model.pkl")
encoder_path = os.path.join(MODEL_DIR, "label_encoder.pkl")
symptoms_path = os.path.join(MODEL_DIR, "symptoms_list.json")

# Load assets safely
try:
    model = joblib.load(model_path)
    label_encoder = joblib.load(encoder_path)
    with open(symptoms_path, "r") as f:
        symptoms_list = json.load(f)
    print("ML Model, Encoder, and Symptoms list loaded successfully into FastAPI!")
except Exception as e:
    print(f"Error loading ML assets: {e}")
    model = None
    label_encoder = None
    symptoms_list = []