import pandas as pd
import numpy as np
import os
import json
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import xgboost as xgb

RAW_DIR = "../data/raw"
MODEL_DIR = "models"

os.makedirs(MODEL_DIR, exist_ok=True)

print("Starting Phase 3: Machine Learning Model Training (With Realistic Noise Injection)...")

# 1. Load the Data
try:
    df_train = pd.read_csv(f"{RAW_DIR}/Training.csv")
except FileNotFoundError:
    print("Error: Training.csv not found in backend/data/raw/")
    exit()

# 2. Preprocess the Data
print("Preprocessing data...")
df_train = df_train.dropna(axis=1, how='all')

X = df_train.drop(columns=['prognosis'])
y_raw = df_train['prognosis']

# Save symptoms list
symptoms_list = X.columns.tolist()
with open(f"{MODEL_DIR}/symptoms_list.json", "w") as f:
    json.dump(symptoms_list, f)

# Encode target labels
label_encoder = LabelEncoder()
y = label_encoder.fit_transform(y_raw)
joblib.dump(label_encoder, f"{MODEL_DIR}/label_encoder.pkl")

# --- REALISM TWEAK: Inject Noise ---
# We randomly flip about 8% of the symptom data to simulate human error in symptom reporting.
# This prevents the models from perfectly memorizing the synthetic dataset.
def inject_noise(features_df, noise_ratio=0.08):
    print(f"Injecting {noise_ratio * 100}% synthetic noise to simulate real-world patient data...")
    np.random.seed(42) # Keep it reproducible
    X_numpy = features_df.to_numpy()
    
    # Create a random mask of the same shape
    mask = np.random.rand(*X_numpy.shape) < noise_ratio
    
    # Flip the binary values where the mask is True (1 becomes 0, 0 becomes 1)
    X_noisy = np.where(mask, 1 - X_numpy, X_numpy)
    
    return pd.DataFrame(X_noisy, columns=features_df.columns)

X_realistic = inject_noise(X)
# -----------------------------------

# Split into training and testing sets (80/20) using the noisy data
X_train, X_test, y_train, y_test = train_test_split(X_realistic, y, test_size=0.2, random_state=42)

# 3. Define Models to Compare (Removed deprecated XGBoost parameter)
models = {
    "Random Forest": RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42),
    "XGBoost": xgb.XGBClassifier(eval_metric='mlogloss', random_state=42),
    "Decision Tree": DecisionTreeClassifier(max_depth=10, random_state=42),
    "Naive Bayes": GaussianNB()
}

# 4. Train and Evaluate
best_model_name = ""
best_model = None
best_score = 0
results = []

print("\nTraining and evaluating models...")
print("-" * 50)

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    
    acc = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    rec = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)
    
    print(f"{name}:")
    print(f"  Accuracy:  {acc:.4f}")
    print(f"  Precision: {prec:.4f}")
    print(f"  Recall:    {rec:.4f}")
    print(f"  F1 Score:  {f1:.4f}\n")
    
    if f1 > best_score:
        best_score = f1
        best_model = model
        best_model_name = name

print("-" * 50)
print(f"Best Model Selected: {best_model_name} (F1 Score: {best_score:.4f})")

# 5. Save the Best Model
model_path = f"{MODEL_DIR}/disease_prediction_model.pkl"
joblib.dump(best_model, model_path)
print(f"Model saved successfully to {model_path}")
print("Phase 3 Complete!")