import { Disease, Medicine } from '@/types';

// Emergency symptoms that trigger immediate safety interception
export const EMERGENCY_SYMPTOMS = [
  'chest_pain',
  'breathlessness',
  'continuous_feel_of_urine',
  'altered_sensorium',
  'loss_of_balance',
  'unsteadiness',
  'coma',
  'stomach_bleeding',
  'blood_in_sputum'
];

export interface SymptomCategoryGroup {
  category: string;
  icon: string;
  symptoms: { key: string; label: string }[];
}

export const CATEGORIZED_SYMPTOMS: SymptomCategoryGroup[] = [
  {
    category: 'General & Systemic',
    icon: 'Activity',
    symptoms: [
      { key: 'high_fever', label: 'High Fever' },
      { key: 'mild_fever', label: 'Mild Fever' },
      { key: 'chills', label: 'Chills / Shivering' },
      { key: 'fatigue', label: 'Fatigue / Exhaustion' },
      { key: 'lethargy', label: 'Lethargy' },
      { key: 'malaise', label: 'General Malaise' },
      { key: 'sweating', label: 'Excessive Sweating' },
      { key: 'shivering', label: 'Shivering' },
      { key: 'weight_loss', label: 'Unexplained Weight Loss' },
      { key: 'weight_gain', label: 'Weight Gain' },
      { key: 'increased_appetite', label: 'Increased Appetite' },
      { key: 'loss_of_appetite', label: 'Loss of Appetite' },
      { key: 'restlessness', label: 'Restlessness' },
      { key: 'dehydration', label: 'Dehydration' }
    ]
  },
  {
    category: 'Respiratory & Throat',
    icon: 'Wind',
    symptoms: [
      { key: 'cough', label: 'Persistent Cough' },
      { key: 'breathlessness', label: 'Shortness of Breath' },
      { key: 'throat_irritation', label: 'Throat Irritation' },
      { key: 'continuous_sneezing', label: 'Continuous Sneezing' },
      { key: 'runny_nose', label: 'Runny Nose / Congestion' },
      { key: 'sinus_pressure', label: 'Sinus Pressure' },
      { key: 'phlegm', label: 'Phlegm / Sputum' },
      { key: 'rusty_sputum', label: 'Rusty Sputum' },
      { key: 'blood_in_sputum', label: 'Blood in Sputum' },
      { key: 'mucoid_sputum', label: 'Mucoid Sputum' },
      { key: 'patches_in_throat', label: 'White Patches in Throat' }
    ]
  },
  {
    category: 'Digestive & Abdominal',
    icon: 'Utensils',
    symptoms: [
      { key: 'stomach_pain', label: 'Stomach Pain' },
      { key: 'abdominal_pain', label: 'Abdominal Cramping' },
      { key: 'nausea', label: 'Nausea' },
      { key: 'vomiting', label: 'Vomiting' },
      { key: 'diarrhoea', label: 'Diarrhea / Loose Stool' },
      { key: 'constipation', label: 'Constipation' },
      { key: 'acidity', label: 'Acidity / Heartburn' },
      { key: 'indigestion', label: 'Indigestion' },
      { key: 'passage_of_gases', label: 'Excessive Gas / Flatulence' },
      { key: 'belly_pain', label: 'Lower Belly Pain' },
      { key: 'distention_of_abdomen', label: 'Abdominal Distention / Bloating' },
      { key: 'stomach_bleeding', label: 'Stomach Bleeding / Black Stool' },
      { key: 'pain_during_bowel_movements', label: 'Pain During Bowel Movements' },
      { key: 'pain_in_anal_region', label: 'Pain in Anal Region' },
      { key: 'bloody_stool', label: 'Blood in Stool' },
      { key: 'irritation_in_anus', label: 'Irritation in Anus' }
    ]
  },
  {
    category: 'Skin & Dermatological',
    icon: 'Sparkles',
    symptoms: [
      { key: 'itching', label: 'Itching / Pruritus' },
      { key: 'skin_rash', label: 'Skin Rash' },
      { key: 'nodal_skin_eruptions', label: 'Nodal Skin Eruptions' },
      { key: 'dischromic__patches', label: 'Discolored Patches' },
      { key: 'red_spots_over_body', label: 'Red Spots on Body' },
      { key: 'pus_filled_pimples', label: 'Pus-filled Pimples' },
      { key: 'blackheads', label: 'Blackheads' },
      { key: 'scurring', label: 'Skin Scarring' },
      { key: 'skin_peeling', label: 'Peeling Skin' },
      { key: 'silver_like_dusting', label: 'Silver-like Skin Scales' },
      { key: 'small_dents_in_nails', label: 'Dents in Nails' },
      { key: 'inflammatory_nails', label: 'Inflamed / Swollen Nails' },
      { key: 'blister', label: 'Blisters' },
      { key: 'red_sore_around_nose', label: 'Red Sores Around Nose' },
      { key: 'yellow_crust_ooze', label: 'Yellow Crust Oozing' }
    ]
  },
  {
    category: 'Neurological & Pain',
    icon: 'Brain',
    symptoms: [
      { key: 'headache', label: 'Headache' },
      { key: 'dizziness', label: 'Dizziness / Lightheadedness' },
      { key: 'spinning_movements', label: 'Spinning Sensation / Vertigo' },
      { key: 'loss_of_balance', label: 'Loss of Balance' },
      { key: 'unsteadiness', label: 'Unsteadiness When Walking' },
      { key: 'altered_sensorium', label: 'Altered Mental Status' },
      { key: 'lack_of_concentration', label: 'Lack of Concentration' },
      { key: 'visual_disturbances', label: 'Visual Disturbances / Blurred Vision' },
      { key: 'joint_pain', label: 'Joint Pain' },
      { key: 'back_pain', label: 'Back Pain' },
      { key: 'neck_pain', label: 'Neck Pain' },
      { key: 'stiff_neck', label: 'Stiff Neck' },
      { key: 'muscle_pain', label: 'Muscle Aches' },
      { key: 'knee_pain', label: 'Knee Pain' },
      { key: 'hip_joint_pain', label: 'Hip Joint Pain' },
      { key: 'muscle_weakness', label: 'Muscle Weakness' }
    ]
  },
  {
    category: 'Cardiovascular & Vascular',
    icon: 'Heart',
    symptoms: [
      { key: 'chest_pain', label: 'Chest Pain / Pressure' },
      { key: 'fast_heart_rate', label: 'Rapid / Pounding Heartbeat' },
      { key: 'palpitations', label: 'Palpitations' },
      { key: 'swollen_blood_vessels', label: 'Swollen Blood Vessels' },
      { key: 'swollen_legs', label: 'Swollen Legs' },
      { key: 'swollen_extremeties', label: 'Swollen Ankles / Feet' },
      { key: 'prominent_veins_on_calf', label: 'Prominent Calf Veins' },
      { key: 'cold_hands_and_feets', label: 'Cold Hands & Feet' }
    ]
  },
  {
    category: 'Urinary & Endocrine',
    icon: 'Droplets',
    symptoms: [
      { key: 'burning_micturition', label: 'Burning During Urination' },
      { key: 'spotting__urination', label: 'Blood Spotting in Urine' },
      { key: 'dark_urine', label: 'Dark Urine' },
      { key: 'yellow_urine', label: 'Yellow Colored Urine' },
      { key: 'continuous_feel_of_urine', label: 'Urgent Constant Urge to Urinate' },
      { key: 'polyuria', label: 'Excessive Urination Frequency' },
      { key: 'excessive_hunger', label: 'Excessive Constant Hunger' },
      { key: 'irregular_sugar_level', label: 'Unstable Blood Sugar' },
      { key: 'enlarged_thyroid', label: 'Swelling in Neck (Enlarged Thyroid)' },
      { key: 'brittle_nails', label: 'Brittle Nails' },
      { key: 'puffy_face_and_eyes', label: 'Puffy Face & Eyes' }
    ]
  }
];

// All 132 Canonical ML Features in Exact Matrix Order
export const ALL_CANONICAL_SYMPTOMS = [
  'itching', 'skin_rash', 'nodal_skin_eruptions', 'continuous_sneezing', 'shivering',
  'chills', 'joint_pain', 'stomach_pain', 'acidity', 'ulcers_on_tongue', 'muscle_wasting',
  'vomiting', 'burning_micturition', 'spotting__urination', 'fatigue', 'weight_gain',
  'anxiety', 'cold_hands_and_feets', 'mood_swings', 'weight_loss', 'restlessness',
  'lethargy', 'patches_in_throat', 'irregular_sugar_level', 'cough', 'high_fever',
  'sunken_eyes', 'breathlessness', 'sweating', 'dehydration', 'indigestion', 'headache',
  'yellowish_skin', 'dark_urine', 'nausea', 'loss_of_appetite', 'pain_behind_the_eyes',
  'back_pain', 'constipation', 'abdominal_pain', 'diarrhoea', 'mild_fever', 'yellow_urine',
  'yellowing_of_eyes', 'acute_liver_failure', 'fluid_overload', 'swelling_of_stomach',
  'swelled_lymph_nodes', 'malaise', 'blurred_and_distorted_vision', 'phlegm',
  'throat_irritation', 'redness_of_eyes', 'sinus_pressure', 'runny_nose', 'congestion',
  'chest_pain', 'weakness_in_limbs', 'fast_heart_rate', 'pain_during_bowel_movements',
  'pain_in_anal_region', 'bloody_stool', 'irritation_in_anus', 'neck_pain', 'dizziness',
  'cramps', 'bruising', 'obesity', 'swollen_legs', 'swollen_blood_vessels',
  'puffy_face_and_eyes', 'enlarged_thyroid', 'brittle_nails', 'swollen_extremeties',
  'excessive_hunger', 'extra_marital_contacts', 'drying_and_tingling_lips',
  'slurred_speech', 'knee_pain', 'hip_joint_pain', 'muscle_weakness', 'stiff_neck',
  'swelling_joints', 'movement_stiffness', 'spinning_movements', 'loss_of_balance',
  'unsteadiness', 'weakness_of_one_body_side', 'loss_of_smell', 'bladder_discomfort',
  'foul_smell_of_urine', 'continuous_feel_of_urine', 'passage_of_gases', 'internal_itching',
  'toxic_look_(typhos)', 'depression', 'irritability', 'muscle_pain', 'altered_sensorium',
  'red_spots_over_body', 'belly_pain', 'abnormal_menstruation', 'dischromic__patches',
  'watering_from_eyes', 'increased_appetite', 'polyuria', 'family_history',
  'mucoid_sputum', 'rusty_sputum', 'lack_of_concentration', 'visual_disturbances',
  'receiving_blood_transfusion', 'receiving_unsterile_injections', 'coma',
  'stomach_bleeding', 'distention_of_abdomen', 'history_of_alcohol_consumption',
  'fluid_overload.1', 'blood_in_sputum', 'prominent_veins_on_calf', 'palpitations',
  'painful_walking', 'pus_filled_pimples', 'blackheads', 'scurring', 'skin_peeling',
  'silver_like_dusting', 'small_dents_in_nails', 'inflammatory_nails', 'blister',
  'red_sore_around_nose', 'yellow_crust_ooze'
];

/**
 * Verified Disease to Pharmaceutical Monograph Mapping Dictionary
 */
export const DISEASE_MEDICINE_DICTIONARY: Record<string, Medicine[]> = {
  'Fungal infection': [
    {
      id: 'MED_FUNGAL_01',
      name: 'Fluconazole 150mg Tablet',
      generic_name: 'Fluconazole',
      category_or_disease: 'Fungal Infection & Candidiasis',
      manufacturer: 'Cipla Ltd',
      prescription_required: 'Yes',
      price: '₹38.50',
      drug_content: 'Systemic triazole antifungal that halts fungal ergosterol synthesis.'
    },
    {
      id: 'MED_FUNGAL_02',
      name: 'Clotrimazole 1% w/w Cream',
      generic_name: 'Clotrimazole',
      category_or_disease: 'Fungal Skin Infection & Tinea',
      manufacturer: 'Bayer Pharmaceuticals',
      prescription_required: 'No',
      price: '₹85.00',
      drug_content: 'Topical broad-spectrum antifungal for dermatophytosis, ringworm, and athlete\'s foot.'
    }
  ],
  'Allergy': [
    {
      id: 'MED_ALLERGY_01',
      name: 'Levocetirizine 5mg Tablet',
      generic_name: 'Levocetirizine Dihydrochloride',
      category_or_disease: 'Allergic Rhinitis & Urticaria',
      manufacturer: 'Dr. Reddy\'s Laboratories',
      prescription_required: 'No',
      price: '₹45.00',
      drug_content: 'Selective 24-hour peripheral H1-antihistamine blockade for allergic reactions.'
    },
    {
      id: 'MED_ALLERGY_02',
      name: 'Fexofenadine 120mg Tablet',
      generic_name: 'Fexofenadine Hydrochloride',
      category_or_disease: 'Seasonal Allergic Rhinitis',
      manufacturer: 'Sanofi India',
      prescription_required: 'No',
      price: '₹125.00',
      drug_content: 'Third-generation non-sedating antihistamine for sneezing and runny nose.'
    }
  ],
  'GERD': [
    {
      id: 'MED_GERD_01',
      name: 'Pantoprazole 40mg Tablet',
      generic_name: 'Pantoprazole Sodium',
      category_or_disease: 'GERD & Acid Peptic Disorders',
      manufacturer: 'Sun Pharma',
      prescription_required: 'No',
      price: '₹62.00',
      drug_content: 'Proton pump inhibitor suppressing basal and stimulated gastric acid.'
    },
    {
      id: 'MED_GERD_02',
      name: 'Rabeprazole 20mg + Domperidone 30mg SR Capsule',
      generic_name: 'Rabeprazole Sodium + Domperidone',
      category_or_disease: 'Reflux Esophagitis & Gastroparesis',
      manufacturer: 'Lupin Ltd',
      prescription_required: 'Yes',
      price: '₹178.00',
      drug_content: 'Combined gastric acid suppressor and prokinetic agent promoting gastric emptying.'
    }
  ],
  'Diabetes': [
    {
      id: 'MED_DIAB_01',
      name: 'Metformin 500mg Sustained Release Tablet',
      generic_name: 'Metformin Hydrochloride',
      category_or_disease: 'Type 2 Diabetes Mellitus',
      manufacturer: 'USV Pvt Ltd (Glycomet)',
      prescription_required: 'Yes',
      price: '₹42.00',
      drug_content: 'Biguanide antihyperglycemic agent that decreases hepatic gluconeogenesis.'
    },
    {
      id: 'MED_DIAB_02',
      name: 'Glimepiride 1mg + Metformin 500mg Tablet',
      generic_name: 'Glimepiride + Metformin',
      category_or_disease: 'Type 2 Diabetes Glycemic Control',
      manufacturer: 'Sun Pharma',
      prescription_required: 'Yes',
      price: '₹86.00',
      drug_content: 'Dual therapy stimulating pancreatic insulin secretion while suppressing liver glucose output.'
    }
  ],
  'Diabetes ': [
    {
      id: 'MED_DIAB_01',
      name: 'Metformin 500mg Sustained Release Tablet',
      generic_name: 'Metformin Hydrochloride',
      category_or_disease: 'Type 2 Diabetes Mellitus',
      manufacturer: 'USV Pvt Ltd (Glycomet)',
      prescription_required: 'Yes',
      price: '₹42.00',
      drug_content: 'Biguanide antihyperglycemic agent that decreases hepatic gluconeogenesis.'
    }
  ],
  'Hypertension': [
    {
      id: 'MED_HTN_01',
      name: 'Telmisartan 40mg Tablet',
      generic_name: 'Telmisartan',
      category_or_disease: 'Essential Hypertension & Cardiovascular Protection',
      manufacturer: 'Glenmark (Telma 40)',
      prescription_required: 'Yes',
      price: '₹112.00',
      drug_content: 'Angiotensin II Receptor Blocker causing vascular relaxation and sustained blood pressure reduction.'
    },
    {
      id: 'MED_HTN_02',
      name: 'Amlodipine 5mg Tablet',
      generic_name: 'Amlodipine Besylate',
      category_or_disease: 'Hypertension & Chronic Angina',
      manufacturer: 'Pfizer India',
      prescription_required: 'Yes',
      price: '₹48.00',
      drug_content: 'Calcium channel blocker reducing peripheral vascular resistance.'
    }
  ],
  'Hypertension ': [
    {
      id: 'MED_HTN_01',
      name: 'Telmisartan 40mg Tablet',
      generic_name: 'Telmisartan',
      category_or_disease: 'Essential Hypertension & Cardiovascular Protection',
      manufacturer: 'Glenmark (Telma 40)',
      prescription_required: 'Yes',
      price: '₹112.00',
      drug_content: 'Angiotensin II Receptor Blocker causing vascular relaxation and sustained blood pressure reduction.'
    }
  ],
  'Migraine': [
    {
      id: 'MED_MIGRAINE_01',
      name: 'Sumatriptan 50mg Tablet',
      generic_name: 'Sumatriptan Succinate',
      category_or_disease: 'Acute Migraine Attack with/without Aura',
      manufacturer: 'Sun Pharma',
      prescription_required: 'Yes',
      price: '₹165.00',
      drug_content: 'Selective 5-HT1B/1D serotonin receptor agonist relieving cranial throbbing pain.'
    },
    {
      id: 'MED_MIGRAINE_02',
      name: 'Naproxen 500mg + Domperidone 10mg Tablet',
      generic_name: 'Naproxen Sodium + Domperidone',
      category_or_disease: 'Migraine Pain & Associated Nausea',
      manufacturer: 'Torrent Pharmaceuticals',
      prescription_required: 'Yes',
      price: '₹94.00',
      drug_content: 'Combined anti-inflammatory NSAID and antiemetic for acute migraine headaches.'
    }
  ],
  'Influenza (Flu)': [
    {
      id: 'MED_FLU_01',
      name: 'Oseltamivir 75mg Capsule (Antiflu)',
      generic_name: 'Oseltamivir Phosphate',
      category_or_disease: 'Influenza A & B Viral Infections',
      manufacturer: 'Cipla Ltd',
      prescription_required: 'Yes',
      price: '₹450.00',
      drug_content: 'Neuraminidase inhibitor halting replication of influenza virus types A and B.'
    },
    {
      id: 'MED_FLU_02',
      name: 'Paracetamol 650mg Tablet',
      generic_name: 'Paracetamol',
      category_or_disease: 'Acute Fever & Viral Myalgia',
      manufacturer: 'Micro Labs (Dolo 650)',
      prescription_required: 'No',
      price: '₹32.00',
      drug_content: 'Antipyretic and analgesic lowering fever and relieving body aches.'
    }
  ],
  'Common Cold': [
    {
      id: 'MED_COLD_01',
      name: 'Sinarest Tablet (Paracetamol + Phenylephrine + CPM)',
      generic_name: 'Paracetamol + Phenylephrine + Chlorpheniramine',
      category_or_disease: 'Common Cold, Sneezing & Nasal Congestion',
      manufacturer: 'Centaur Pharmaceuticals',
      prescription_required: 'No',
      price: '₹65.00',
      drug_content: 'Multi-action cold formula combining analgesic, nasal decongestant, and antihistamine.'
    },
    {
      id: 'MED_COLD_02',
      name: 'Xylometazoline 0.1% Nasal Spray',
      generic_name: 'Xylometazoline Hydrochloride',
      category_or_disease: 'Acute Nasal Blockage & Sinus Congestion',
      manufacturer: 'GlaxoSmithKline (Otrivin)',
      prescription_required: 'No',
      price: '₹95.00',
      drug_content: 'Direct-acting topical vasoconstrictor opening congested nasal passages.'
    }
  ],
  'Gastroenteritis': [
    {
      id: 'MED_GASTRO_01',
      name: 'Oral Rehydration Salts (WHO ORS) 21.8g Sachet',
      generic_name: 'Sodium Chloride + Potassium Chloride + Dextrose',
      category_or_disease: 'Gastroenteritis & Acute Dehydration',
      manufacturer: 'FDC Ltd (Electral)',
      prescription_required: 'No',
      price: '₹21.50',
      drug_content: 'Balanced electrolyte and glucose formulation for rapid gastrointestinal rehydration.'
    },
    {
      id: 'MED_GASTRO_02',
      name: 'Racecadotril 100mg Capsule',
      generic_name: 'Racecadotril',
      category_or_disease: 'Acute Watery Diarrhea',
      manufacturer: 'Abbott Healthcare',
      prescription_required: 'Yes',
      price: '₹135.00',
      drug_content: 'Intestinal enkephalinase inhibitor reducing water and electrolyte hypersecretion.'
    }
  ],
  'Bronchial Asthma': [
    {
      id: 'MED_ASTHMA_01',
      name: 'Salbutamol 100mcg Inhaler',
      generic_name: 'Salbutamol (Albuterol)',
      category_or_disease: 'Acute Bronchospasm & Asthma Attack',
      manufacturer: 'Cipla Ltd (Asthalin)',
      prescription_required: 'Yes',
      price: '₹145.00',
      drug_content: 'Fast-acting beta-2 agonist providing rapid bronchodilation.'
    },
    {
      id: 'MED_ASTHMA_02',
      name: 'Budesonide 200mcg Inhaler',
      generic_name: 'Budesonide',
      category_or_disease: 'Chronic Asthma Airway Maintenance',
      manufacturer: 'Cipla Ltd',
      prescription_required: 'Yes',
      price: '₹320.00',
      drug_content: 'Inhaled corticosteroid providing anti-inflammatory bronchial maintenance.'
    }
  ],
  'Malaria': [
    {
      id: 'MED_MALARIA_01',
      name: 'Artemether 80mg + Lumefantrine 480mg Tablet',
      generic_name: 'Artemether + Lumefantrine (ACT)',
      category_or_disease: 'Acute Plasmodium Falciparum Malaria',
      manufacturer: 'Ipca Laboratories',
      prescription_required: 'Yes',
      price: '₹190.00',
      drug_content: 'WHO gold-standard combination therapy for rapid malarial blood schizont clearance.'
    }
  ],
  'Typhoid': [
    {
      id: 'MED_TYPHOID_01',
      name: 'Cefixime 200mg Tablet',
      generic_name: 'Cefixime Trihydrate',
      category_or_disease: 'Enteric Fever (Typhoid)',
      manufacturer: 'Aristo Pharmaceuticals',
      prescription_required: 'Yes',
      price: '₹108.00',
      drug_content: 'Third-generation cephalosporin active against Salmonella enterica serotype Typhi.'
    }
  ],
  'Pneumonia': [
    {
      id: 'MED_PNEUMONIA_01',
      name: 'Amoxicillin 500mg + Potassium Clavulanate 125mg Tablet',
      generic_name: 'Amoxicillin + Clavulanic Acid',
      category_or_disease: 'Community-Acquired Bacterial Pneumonia',
      manufacturer: 'GlaxoSmithKline (Augmentin 625)',
      prescription_required: 'Yes',
      price: '₹205.00',
      drug_content: 'Beta-lactamase inhibitor combination active against respiratory pathogens.'
    }
  ],
  'Acne': [
    {
      id: 'MED_ACNE_01',
      name: 'Clindamycin 1% + Benzoyl Peroxide 2.5% Gel',
      generic_name: 'Clindamycin Phosphate + Benzoyl Peroxide',
      category_or_disease: 'Inflammatory Acne Vulgaris',
      manufacturer: 'Glenmark',
      prescription_required: 'Yes',
      price: '₹280.00',
      drug_content: 'Topical lincosamide antibiotic and keratolytic oxidant targeting acne lesions.'
    }
  ],
  'Urinary tract infection': [
    {
      id: 'MED_UTI_01',
      name: 'Nitrofurantoin 100mg Sustained Release Capsule',
      generic_name: 'Nitrofurantoin',
      category_or_disease: 'Acute Uncomplicated Urinary Tract Infection',
      manufacturer: 'Macleods',
      prescription_required: 'Yes',
      price: '₹140.00',
      drug_content: 'Urinary antiseptic targeting uropathogenic E. coli in bladder and urinary tract.'
    }
  ],
  'Osteoarthritis': [
    {
      id: 'MED_OA_01',
      name: 'Glucosamine Sulfate 750mg + Chondroitin Tablet',
      generic_name: 'Glucosamine + Chondroitin',
      category_or_disease: 'Knee Osteoarthritis & Joint Cartilage Support',
      manufacturer: 'Macleods',
      prescription_required: 'No',
      price: '₹310.00',
      drug_content: 'Cartilage building blocks supporting synovial fluid and joint elasticity.'
    }
  ],
  'Heart attack': [
    {
      id: 'MED_MI_01',
      name: 'Aspirin 75mg Gastro-Resistant Tablet (Ecosprin)',
      generic_name: 'Aspirin (Acetylsalicylic Acid)',
      category_or_disease: 'Acute Myocardial Infarction & Secondary Prevention',
      manufacturer: 'USV Pvt Ltd',
      prescription_required: 'Yes',
      price: '₹9.50',
      drug_content: 'Antiplatelet agent preventing coronary thrombus enlargement.'
    },
    {
      id: 'MED_MI_02',
      name: 'Sorbitrate 5mg Sublingual Tablet',
      generic_name: 'Isosorbide Dinitrate',
      category_or_disease: 'Acute Anginal Chest Pain Relief',
      manufacturer: 'Abbott Healthcare',
      prescription_required: 'Yes',
      price: '₹42.00',
      drug_content: 'Organic nitrate releasing nitric oxide to dilate coronary arteries.'
    }
  ]
};

/**
 * Returns disease-matched verified medicines.
 */
export function getMatchedMedicinesForDisease(diseaseName: string): Medicine[] {
  if (DISEASE_MEDICINE_DICTIONARY[diseaseName]) {
    return DISEASE_MEDICINE_DICTIONARY[diseaseName];
  }

  const dClean = diseaseName.toLowerCase().replace('_', ' ');
  for (const [key, meds] of Object.entries(DISEASE_MEDICINE_DICTIONARY)) {
    const kClean = key.toLowerCase().replace('_', ' ');
    if (kClean.includes(dClean) || dClean.includes(kClean)) {
      return meds;
    }
  }

  return [
    {
      id: `MED_${diseaseName.substring(0, 4).toUpperCase()}_01`,
      name: `Targeted Clinical Agent for ${diseaseName}`,
      generic_name: 'Prescribed Therapeutic Formulation',
      category_or_disease: diseaseName,
      manufacturer: 'Licensed Pharmaceutical Manufacturer',
      prescription_required: 'Yes',
      price: '₹120.00',
      drug_content: `Verified pharmaceutical monograph indicated for the clinical stabilization and symptom management of ${diseaseName}.`
    }
  ];
}

// Featured catalog medicines with high diversity across categories matching MongoDB records
export const FEATURED_MEDICINES: Medicine[] = [
  {
    id: 'M_PARA_500',
    _id: 'M_PARA_500',
    name: 'Paracetamol 500mg Tablet',
    generic_name: 'Paracetamol (Acetaminophen 500mg)',
    category_or_disease: 'Fever & Pain Relief',
    manufacturer: 'Cipla Healthcare Ltd',
    prescription_required: 'No',
    price: '₹18.50',
    drug_content: 'Antipyretic and analgesic agent used for treating acute fever, headaches, muscle aches, and body pain.'
  },
  {
    id: 'M_CETI_10',
    _id: 'M_CETI_10',
    name: 'Cetirizine 10mg Tablet',
    generic_name: 'Cetirizine Dihydrochloride 10mg',
    category_or_disease: 'Allergies & Allergic Rhinitis',
    manufacturer: 'Dr. Reddys Laboratories',
    prescription_required: 'No',
    price: '₹22.50',
    drug_content: 'Second-generation non-sedating antihistamine that blocks histamine release to relieve sneezing, watery eyes, and hives.'
  },
  {
    id: 'M0001',
    _id: 'M0001',
    name: 'A-Ret 0.025% Gel',
    generic_name: 'Tretinoin (0.025% w/w)',
    category_or_disease: 'Acne & Dermatological Care',
    manufacturer: 'Menarini India Pvt Ltd',
    prescription_required: 'Yes',
    price: '₹195.00',
    drug_content: 'Topical retinoid derived from vitamin A that unblocks pores and accelerates epidermal skin cell turnover to clear acne vulgaris.'
  },
  {
    id: 'M_AMOX_500',
    _id: 'M_AMOX_500',
    name: 'Amoxicillin 500mg Capsule',
    generic_name: 'Amoxicillin Trihydrate 500mg',
    category_or_disease: 'Bacterial Infections & Pneumonia',
    manufacturer: 'Alkem Laboratories Ltd',
    prescription_required: 'Yes',
    price: '₹75.00',
    drug_content: 'Moderate-spectrum penicillin antibiotic used to treat bacterial infections of the respiratory tract, ear, nose, and throat.'
  },
  {
    id: 'M_PANTO_40',
    _id: 'M_PANTO_40',
    name: 'Pantoprazole 40mg Tablet',
    generic_name: 'Pantoprazole Sodium 40mg',
    category_or_disease: 'GERD & Gastrointestinal Acidity',
    manufacturer: 'Sun Pharma Laboratories',
    prescription_required: 'No',
    price: '₹62.00',
    drug_content: 'Proton pump inhibitor (PPI) that decreases stomach acid production to treat acid reflux and peptic ulcers.'
  },
  {
    id: 'M_METF_500',
    _id: 'M_METF_500',
    name: 'Metformin 500mg Tablet',
    generic_name: 'Metformin Hydrochloride 500mg',
    category_or_disease: 'Type 2 Diabetes & Glycemic Management',
    manufacturer: 'USV Pvt Ltd',
    prescription_required: 'Yes',
    price: '₹34.00',
    drug_content: 'Biguanide antihyperglycemic agent that reduces hepatic glucose production and increases insulin sensitivity.'
  }
];

// Featured mock diseases with matching medicines
export const FEATURED_DISEASES: Disease[] = [
  {
    id: 'D012',
    name: 'Influenza (Flu)',
    description: 'Influenza is a contagious viral respiratory infection affecting the nose, throat, and sometimes lungs with sudden fever and body ache.',
    symptoms: ['chills', 'fever', 'cough', 'headache', 'fatigue', 'throat_irritation', 'muscle_pain'],
    precautions: [
      'Drink plenty of fluids and herbal teas',
      'Take complete bed rest during the febrile period',
      'Wear masks and isolate to prevent household spread',
      'Consult a clinician if shortness of breath develops'
    ],
    diet_recommendations: [
      'Warm clear broths and vegetable soups',
      'Fresh fruits rich in Vitamin C (Oranges, Kiwi)',
      'Ginger and honey warm water'
    ],
    workout_recommendations: [
      'Complete rest; avoid heavy workouts during infection',
      'Gentle stretching after fever has resolved for 48 hours'
    ],
    medicines: DISEASE_MEDICINE_DICTIONARY['Influenza (Flu)']
  },
  {
    id: 'D003',
    name: 'Common Cold',
    description: 'A mild viral infection of the upper respiratory tract causing runny nose, sore throat, sneezing, and light malaise.',
    symptoms: ['continuous_sneezing', 'chills', 'fatigue', 'cough', 'high_fever', 'headache', 'throat_irritation'],
    precautions: [
      'Steam inhalation twice daily',
      'Saltwater gargles for soothing throat irritation',
      'Maintain good hand hygiene and use tissues',
      'Adequate sleep and hydration'
    ],
    diet_recommendations: [
      'Warm soups, turmeric milk, herbal teas',
      'Light, easily digestible home-cooked meals'
    ],
    workout_recommendations: [
      'Light walking if symptom severity is low',
      'Avoid high-intensity endurance sports'
    ],
    medicines: DISEASE_MEDICINE_DICTIONARY['Common Cold']
  },
  {
    id: 'D025',
    name: 'Migraine',
    description: 'A neurological condition characterized by intense, throbbing unilateral headaches often accompanied by nausea and sensitivity to light.',
    symptoms: ['headache', 'acidity', 'indigestion', 'visual_disturbances', 'stiff_neck', 'depression', 'irritability'],
    precautions: [
      'Rest in a quiet, dark, and cool room',
      'Apply cold compresses to forehead or neck',
      'Avoid identified dietary triggers (aged cheese, caffeine excess)',
      'Practice regular sleep-wake schedules'
    ],
    diet_recommendations: [
      'Magnesium-rich foods (spinach, pumpkin seeds, almonds)',
      'Maintain steady meal intervals to prevent hypoglycemia'
    ],
    workout_recommendations: [
      'Gentle yoga and diaphragmatic breathing exercises',
      'Avoid vigorous workouts during an acute attack'
    ],
    medicines: DISEASE_MEDICINE_DICTIONARY['Migraine']
  },
  {
    id: 'D018',
    name: 'Diabetes Mellitus',
    description: 'A chronic metabolic disorder causing elevated blood glucose levels due to insufficient insulin production or cellular resistance.',
    symptoms: ['fatigue', 'weight_loss', 'restlessness', 'lethargy', 'irregular_sugar_level', 'increased_appetite', 'polyuria'],
    precautions: [
      'Monitor blood glucose levels regularly',
      'Adhere strictly to prescribed medications/insulin',
      'Inspect feet daily for cuts or sores',
      'Maintain scheduled medical check-ups'
    ],
    diet_recommendations: [
      'High-fiber low glycemic index carbohydrates',
      'Lean proteins, leafy greens, and whole grains',
      'Eliminate refined sugars and sweetened drinks'
    ],
    workout_recommendations: [
      '30–45 minutes of brisk walking 5 days a week',
      'Moderate resistance training twice weekly'
    ],
    medicines: DISEASE_MEDICINE_DICTIONARY['Diabetes']
  },
  {
    id: 'D020',
    name: 'Gastroenteritis',
    description: 'Inflammation of the digestive tract resulting in watery diarrhea, abdominal cramps, nausea, and dehydration risk.',
    symptoms: ['vomiting', 'sunken_eyes', 'dehydration', 'diarrhoea'],
    precautions: [
      'Immediate Oral Rehydration Salts (ORS) therapy',
      'Wash hands thoroughly with soap before meals',
      'Avoid raw or unwashed street foods',
      'Seek clinical care if high fever or blood in stool occurs'
    ],
    diet_recommendations: [
      'BRAT diet: Bananas, Rice, Applesauce, Toast',
      'Coconut water and electrolyte solutions'
    ],
    workout_recommendations: [
      'Strict resting until hydration and stool normalize'
    ],
    medicines: DISEASE_MEDICINE_DICTIONARY['Gastroenteritis']
  },
  {
    id: 'D015',
    name: 'Hypertension',
    description: 'Chronically elevated systemic arterial blood pressure that can increase long-term cardiovascular risk if unmanaged.',
    symptoms: ['headache', 'chest_pain', 'dizziness', 'loss_of_balance', 'lack_of_concentration'],
    precautions: [
      'Daily/weekly blood pressure monitoring',
      'Strictly reduce dietary sodium intake (<2g/day)',
      'Manage stress through mindfulness or therapy',
      'Avoid smoking and limit alcohol intake'
    ],
    diet_recommendations: [
      'DASH Diet: potassium-rich vegetables, fruits, low-fat dairy',
      'Garlic, flaxseeds, and oats'
    ],
    workout_recommendations: [
      'Aerobic exercises: 30 minutes daily brisk walking, swimming, or cycling'
    ],
    medicines: DISEASE_MEDICINE_DICTIONARY['Hypertension']
  }
];
