import pickle
import pandas as pd

def inspect_model(file_path):
    print(f"\n--- Inspecting {file_path} ---")
    try:
        with open(file_path, 'rb') as f:
            obj = pickle.load(f)
            print(f"Type: {type(obj)}")
            if hasattr(obj, 'feature_names_in_'):
                print(f"Feature names: {obj.feature_names_in_}")
            elif hasattr(obj, 'get_booster'):
                print(f"Booster feature names: {obj.get_booster().feature_names}")
            else:
                print("No feature names found in attributes.")
    except Exception as e:
        print(f"Error: {e}")

inspect_model('scaler.pkl')
inspect_model('xgb_model.pkl')
