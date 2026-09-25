import pandas as pd
import json
import os
import ast

# 1. Setup Paths
RAW_DIR = "../data/raw"
PROCESSED_DIR = "../data/processed"

# Ensure processed directory exists
os.makedirs(PROCESSED_DIR, exist_ok=True)

print("Starting ETL Phase 1: Processing Disease & Symptom Data...")

# 2. Load the Datasets
# Assuming the files are exactly as you named them
try:
    df_desc = pd.read_csv(f"{RAW_DIR}/description.csv")
    df_prec = pd.read_csv(f"{RAW_DIR}/precautions_df.csv")
    df_med = pd.read_csv(f"{RAW_DIR}/medications.csv")
    df_diet = pd.read_csv(f"{RAW_DIR}/diets.csv")
    df_workout = pd.read_csv(f"{RAW_DIR}/workout_df.csv")
    
    # We will use Training.csv to extract unique diseases and their symptoms
    df_train = pd.read_csv(f"{RAW_DIR}/Training.csv")
except FileNotFoundError as e:
    print(f"Error loading file: {e}")
    print("Please make sure all files are placed exactly in backend/data/raw/")
    exit()

# 3. Clean and Normalize Data
def clean_text(text):
    if pd.isna(text): return ""
    return str(text).strip()

def safe_literal_eval(val):
    # Some datasets store lists as strings e.g., "['item1', 'item2']"
    try:
        return ast.literal_eval(val)
    except (ValueError, SyntaxError):
        return [clean_text(val)] if pd.notna(val) else []

print("Normalizing and merging datasets...")

# Extract unique diseases from the master training dataset
diseases_list = df_train['prognosis'].unique()
processed_diseases = []

# Loop through each disease to build the unified MongoDB document
for idx, disease_name in enumerate(diseases_list):
    # Generate canonical ID (D001, D002, etc.)
    disease_id = f"D{str(idx + 1).zfill(3)}"
    
    # Get Description
    desc_row = df_desc[df_desc['Disease'].str.strip() == disease_name]
    description = clean_text(desc_row.iloc[0]['Description']) if not desc_row.empty else ""
    
    # Get Precautions
    prec_row = df_prec[df_prec['Disease'].str.strip() == disease_name]
    precautions = []
    if not prec_row.empty:
        # Assuming columns are Precaution_1, Precaution_2, etc.
        for col in ['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']:
            if col in prec_row.columns and pd.notna(prec_row.iloc[0][col]):
                precautions.append(clean_text(prec_row.iloc[0][col]))
                
    # Get Medications (Dataset 1 basic meds, to be linked to Dataset 2 later)
    med_row = df_med[df_med['Disease'].str.strip() == disease_name]
    basic_meds = []
    if not med_row.empty and 'Medication' in med_row.columns:
        basic_meds = safe_literal_eval(med_row.iloc[0]['Medication'])
        
    # Get Diets
    diet_row = df_diet[df_diet['Disease'].str.strip() == disease_name]
    diets = []
    if not diet_row.empty and 'Diet' in diet_row.columns:
        diets = safe_literal_eval(diet_row.iloc[0]['Diet'])
        
    # Get Workouts
    workout_row = df_workout[df_workout['disease'].str.strip() == disease_name]
    workouts = []
    if not workout_row.empty and 'workout' in workout_row.columns:
        # Workouts might be multiple rows for the same disease in this dataset
        workouts = workout_row['workout'].dropna().tolist()

    # Extract symptoms from Training.csv for this disease
    # We find a row with this disease and see which symptom columns have a '1'
    sample_row = df_train[df_train['prognosis'] == disease_name].iloc[0]
    symptoms = [col for col in df_train.columns if col != 'prognosis' and sample_row[col] == 1]
    
    # Build the MongoDB compatible dictionary
    disease_doc = {
        "_id": disease_id,
        "name": disease_name,
        "aliases": [], # To be populated if needed
        "description": description,
        "symptoms": symptoms,
        "precautions": precautions,
        "diet_recommendations": diets,
        "workout_recommendations": workouts,
        "basic_medications_temp": basic_meds, # Temp field until we map Dataset 2
        "related_medicine_ids": [] # Will be mapped in Phase 2
    }
    
    processed_diseases.append(disease_doc)

# 4. Save to JSON for MongoDB Import
output_file = f"{PROCESSED_DIR}/processed_diseases.json"
with open(output_file, 'w') as f:
    json.dump(processed_diseases, f, indent=4)

print(f"ETL Phase 1 Complete! Successfully processed {len(processed_diseases)} diseases.")
print(f"File saved to: {output_file}")