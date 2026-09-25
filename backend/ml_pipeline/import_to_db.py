import json
import os
from pymongo import MongoClient, ASCENDING
from dotenv import load_dotenv

# 1. Load Environment Variables
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    print("Error: MONGO_URI not found in .env file.")
    exit()

print("Connecting to Local MongoDB...")
try:
    client = MongoClient(MONGO_URI)
    # Check connection
    client.admin.command('ping')
    print("Successfully connected to Local MongoDB!")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    print("Make sure your local MongoDB service is running!")
    exit()

# 2. Database and Collections Setup
db = client["mediassist_db"]
diseases_col = db["diseases"]
medicines_col = db["medicines"]

PROCESSED_DIR = "../data/processed"

print("\nStarting Data Import...")

# 3. Load and Insert Diseases
try:
    with open(f"{PROCESSED_DIR}/processed_diseases.json", 'r') as f:
        diseases_data = json.load(f)
        
    print("Clearing old diseases data...")
    diseases_col.delete_many({}) 
    
    print(f"Inserting {len(diseases_data)} diseases...")
    diseases_col.insert_many(diseases_data)
    print("Diseases inserted successfully!")
except Exception as e:
    print(f"Error importing diseases: {e}")

# 4. Load and Insert Medicines
try:
    with open(f"{PROCESSED_DIR}/processed_medicines.json", 'r', encoding='utf-8') as f:
        medicines_data = json.load(f)
        
    print("Clearing old medicines data...")
    medicines_col.delete_many({})
    
    print(f"Inserting {len(medicines_data)} medicines...")
    medicines_col.insert_many(medicines_data)
    print("Medicines inserted successfully!")
except Exception as e:
    print(f"Error importing medicines: {e}")

# 5. Create Indexes
print("\nCreating Database Indexes...")
diseases_col.create_index([("name", ASCENDING)])
medicines_col.create_index([("name", ASCENDING)])
medicines_col.create_index([("generic_name", ASCENDING)])
medicines_col.create_index([("category_or_disease", ASCENDING)])

print("Indexes created successfully!")
print("\nPhase 4 Complete: All data is successfully loaded into MongoDB!")