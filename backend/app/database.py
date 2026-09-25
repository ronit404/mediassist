import os
from pymongo import MongoClient
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")

client = MongoClient(MONGO_URI)
db = client["mediassist_db"]

# Collections
diseases_collection = db["diseases"]
medicines_collection = db["medicines"]
users_collection = db["users"]
patients_collection = db["patients"]
patient_history_collection = db["patient_history"]