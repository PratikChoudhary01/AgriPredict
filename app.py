import os
import random
import time
from flask import Flask, render_template, request, jsonify, session
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
from db_utils import init_db, add_user, get_user_by_email, verify_user, update_password
from email_service import send_otp_email, generate_otp, send_reset_password_email

app = Flask(__name__)
app.secret_key = os.urandom(24)
CORS(app) 

# Initialize database
init_db()

# Load models
def load_models():
    try:
        if not all(os.path.exists(f) for f in ['encoders.pkl', 'scaler.pkl', 'xgb_model.pkl']):
            print("Warning: Model files not found. Prediction will fail.")
            return None, None, None
        with open('encoders.pkl', 'rb') as f:
            encoders = pickle.load(f)
        with open('scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
        with open('xgb_model.pkl', 'rb') as f:
            model = pickle.load(f)
        return encoders, scaler, model
    except Exception as e:
        print(f"Error loading models: {e}")
        return None, None, None

encoders, scaler, model = load_models()

# In-memory OTP storage: {email: {otp: '123456', expires: timestamp}}
otp_store = {}

# Categorical mappings (must match src/constants.ts)
CROP_MAP = {"Wheat": 0, "Rice": 1, "Maize": 2, "Barley": 3, "Soybean": 4}
SOIL_MAP = {"Alluvial": 0, "Black": 1, "Red": 2, "Laterite": 3, "Sandy": 4}
REGION_MAP = {"North": 0, "South": 1, "East": 2, "West": 3, "Central": 4}

def validate_password(password):
    """Checks password for length and complexity."""
    if len(password) < 6:
        return False, "Password must be at least 6 characters long."
    if not any(char.isdigit() for char in password):
        return False, "Password must contain at least one number."
    if not any(char in "!@#$%^&*()-_+=" for char in password):
        return False, "Password must contain at least one special character (!@#$%^&*)."
    return True, ""

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if model is None or scaler is None:
        return jsonify({'success': False, 'error': 'Models not loaded on server.'})
    try:
        data = request.json
        region = REGION_MAP.get(data.get('region'), 0)
        soil_type = SOIL_MAP.get(data.get('soilType'), 0)
        crop = CROP_MAP.get(data.get('cropType'), 0)
        rainfall = float(data.get('rainfall', 500))
        temperature = float(data.get('temperature', 25))
        irrigation = 1 if data.get('irrigationUsed') == 'Used' else 0
        harvest_days = float(data.get('daysToHarvest', 120))
        
        features = [float(region), float(soil_type), float(crop), float(rainfall), float(temperature), float(irrigation), float(harvest_days)]
        features_arr = np.array(features).reshape(1, -1)
        features_scaled = scaler.transform(features_arr)
        prediction = model.predict(features_scaled)[0]
        
        confidence = 0.85 + (np.random.rand() * 0.1)
        recommendations = [
            "Maintain optimal soil moisture levels.",
            "Consider adding NPK 10-26-26 fertilizer based on soil health.",
            "Monitor for early signs of pests during the monsoon season."
        ]
        
        return jsonify({
            'success': True,
            'predictedYield': round(float(prediction), 2),
            'confidence': confidence,
            'recommendations': recommendations
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# --- Authentication Routes ---

@app.route('/auth/check-user', methods=['POST'])
def check_user():
    data = request.json
    user = get_user_by_email(data.get('email'))
    return jsonify({'exists': user is not None})

@app.route('/auth/send-otp', methods=['POST'])
def send_otp():
    data = request.json
    email = data.get('email')
    otp = generate_otp()
    otp_store[email] = {'otp': otp, 'expires': time.time() + 120} # 2 minutes
    
    # Send branded HTML email via SMTP
    success = send_otp_email(email, otp)
    
    if success:
        return jsonify({'success': True, 'message': 'OTP sent successfully'})
    else:
        return jsonify({'success': False, 'message': 'Failed to send OTP email'})

@app.route('/auth/resend-otp', methods=['GET', 'POST'])
def resend_otp():
    email = request.args.get('email') or (request.json.get('email') if request.is_json else None)
    if not email:
        return jsonify({'success': False, 'message': 'Email is required'}), 400
    
    otp = generate_otp()
    otp_store[email] = {'otp': otp, 'expires': time.time() + 120} # 2 minutes
    
    success = send_otp_email(email, otp)
    if success:
        # If it was a link click (GET), redirect back to home, otherwise return JSON
        if request.method == 'GET':
            return render_template('index.html', message="A new OTP has been sent to your email.")
        return jsonify({'success': True, 'message': 'New OTP sent successfully'})
    return jsonify({'success': False, 'message': 'Failed to resend OTP'})

@app.route('/auth/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json
    email = data.get('email')
    user_otp = data.get('otp')
    
    stored = otp_store.get(email)
    if stored and stored['otp'] == user_otp and time.time() < stored['expires']:
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Invalid or expired OTP'})

@app.route('/auth/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    user_otp = data.get('otp')
    
    # Final check on OTP before signup
    stored = otp_store.get(email)
    if not (stored and stored['otp'] == user_otp and time.time() < stored['expires']):
        return jsonify({'success': False, 'message': 'OTP verification failed'})

    is_valid, error_msg = validate_password(data['password'])
    if not is_valid:
        return jsonify({'success': False, 'message': error_msg})

    success, message = add_user(data['first_name'], data['last_name'], email, data['password'])
    if success:
        user = get_user_by_email(email)
        session['user_id'] = user['id']
        session['user_name'] = f"{user['first_name']} {user['last_name']}"
        return jsonify({'success': True, 'user': {'name': session['user_name'], 'email': email}})
    return jsonify({'success': False, 'message': message})

@app.route('/auth/signin', methods=['POST'])
def signin():
    data = request.json
    user = verify_user(data.get('email'), data.get('password'))
    if user:
        session['user_id'] = user['id']
        session['user_name'] = f"{user['first_name']} {user['last_name']}"
        return jsonify({'success': True, 'user': {'name': session['user_name'], 'email': user['email']}})
    return jsonify({'success': False, 'message': 'Invalid email or password'})

@app.route('/auth/signout')
def signout():
    session.clear()
    return jsonify({'success': True})

@app.route('/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.json
    email = data.get('email')
    user = get_user_by_email(email)
    
    if not user:
        return jsonify({'success': False, 'message': 'Email not found.'})
    
    otp = generate_otp()
    otp_store[email] = {'otp': otp, 'expires': time.time() + 120}
    
    if send_reset_password_email(email, otp):
        return jsonify({'success': True, 'message': 'Reset code sent to your email.'})
    return jsonify({'success': False, 'message': 'Failed to send recovery email.'})

@app.route('/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.json
    email = data.get('email')
    user_otp = data.get('otp')
    new_password = data.get('password')
    
    stored = otp_store.get(email)
    if not (stored and stored['otp'] == user_otp and time.time() < stored['expires']):
        return jsonify({'success': False, 'message': 'Invalid or expired OTP.'})
    
    is_valid, error_msg = validate_password(new_password)
    if not is_valid:
        return jsonify({'success': False, 'message': error_msg})
        
    success, message = update_password(email, new_password)
    if success:
        return jsonify({'success': True, 'message': 'Password reset successfully. Please sign in.'})
    return jsonify({'success': False, 'message': message})

@app.route('/auth/status')
def status():
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'user': {'name': session['user_name']}})
    return jsonify({'logged_in': False})

if __name__ == '__main__':
    app.run(debug=True)
