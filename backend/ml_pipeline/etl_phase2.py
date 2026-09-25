import pandas as pd
import json
import os

RAW_DIR = "../data/raw"
PROCESSED_DIR = "../data/processed"

print("Starting ETL Phase 2 (Filtered): Mapping Medicines to our 41 Diseases...")

# 1. Load the 41 diseases from Phase 1
try:
    with open(f"{PROCESSED_DIR}/processed_diseases.json", 'r') as f:
        diseases = json.load(f)
except FileNotFoundError:
    print("Error: processed_diseases.json not found. Run etl_phase1.py first.")
    exit()

# Extract target keywords for matching (lowercase for easier comparison)
target_diseases = [d['name'].lower() for d in diseases]
target_meds = set()
for d in diseases:
    for med in d.get('basic_medications_temp', []):
        target_meds.add(med.lower())

# 2. Load Medicines Dataset
df_meds = pd.read_csv(f"{RAW_DIR}/medicines_raw.csv")
df_unique_meds = df_meds.drop_duplicates(subset=['med_name'])

processed_medicines = []
medicine_mapping = {} # To link Med IDs back to Disease Names

print("Filtering 23,939 medicines down to only the highly relevant ones...")

for idx, row in df_unique_meds.iterrows():
    med_disease = str(row.get('disease_name', '')).lower()
    med_name_lower = str(row.get('med_name', '')).lower()
    generic_name_lower = str(row.get('generic_name', '')).lower()
    
    if pd.isna(row.get('med_name')): continue
    
    # Check if this medicine is related to our 41 diseases or known medications
    matched_disease = None
    
    # Condition A: Does the dataset's disease match our disease list?
    for t_disease in target_diseases:
        if len(t_disease) > 3 and (t_disease in med_disease or med_disease in t_disease):
            matched_disease = t_disease
            break
            
    # Condition B: Does the medicine name match our recommended medications?
    if not matched_disease:
        for t_med in target_meds:
            if len(t_med) > 3 and (t_med in med_name_lower or t_med in generic_name_lower):
                # If we match by medication name, we don't have a direct disease mapping from this loop,
                # but we still want to keep the medicine in the DB.
                matched_disease = "matched_by_med_name" 
                break
                
    # If it matched either condition, keep it!
    if matched_disease:
        med_id = f"M{str(len(processed_medicines) + 1).zfill(4)}"
        
        med_doc = {
            "_id": med_id,
            "name": str(row.get('med_name', '')).strip(),
            "generic_name": str(row.get('generic_name', '')).strip() if pd.notna(row.get('generic_name')) else "",
            "category_or_disease": str(row.get('disease_name', '')).strip() if pd.notna(row.get('disease_name')) else "",
            "manufacturer": str(row.get('drug_manufacturer', '')).strip() if pd.notna(row.get('drug_manufacturer')) else "",
            "prescription_required": str(row.get('prescription_required', '')).strip() if pd.notna(row.get('prescription_required')) else "",
            "price": str(row.get('final_price', '')).strip() if pd.notna(row.get('final_price')) else "",
            "drug_content": str(row.get('drug_content', '')).strip() if pd.notna(row.get('drug_content')) else "",
            "image_urls": str(row.get('img_urls', '')).strip() if pd.notna(row.get('img_urls')) else ""
        }
        processed_medicines.append(med_doc)
        
        # Link back to disease if we matched via Condition A
        if matched_disease != "matched_by_med_name":
            if matched_disease not in medicine_mapping:
                medicine_mapping[matched_disease] = []
            medicine_mapping[matched_disease].append(med_id)

# 3. Save the filtered medicines
with open(f"{PROCESSED_DIR}/processed_medicines.json", 'w', encoding='utf-8') as f:
    json.dump(processed_medicines, f, indent=4)

print(f"Success! Reduced dataset to {len(processed_medicines)} highly relevant medicines.")

# 4. Update the diseases JSON with the related medicine IDs
print("Linking Medicine IDs back to Diseases for MongoDB...")
for d in diseases:
    d_name_lower = d['name'].lower()
    if d_name_lower in medicine_mapping:
        # Take up to 5 related medicines so we don't overload the frontend UI
        d['related_medicine_ids'] = medicine_mapping[d_name_lower][:5]
        
    # Clean up the temporary field since we don't need it anymore
    if 'basic_medications_temp' in d:
        del d['basic_medications_temp']

with open(f"{PROCESSED_DIR}/processed_diseases.json", 'w', encoding='utf-8') as f:
    json.dump(diseases, f, indent=4)

print("ETL Phase 2 Complete! Both datasets are cleaned, filtered, and mapped together.")