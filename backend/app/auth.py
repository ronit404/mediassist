import hashlib
import hmac
import secrets
import json
import base64
import time
from typing import Optional, Dict, Any

# In-memory secret key for token signing (can also come from env)
SECRET_KEY = "mediassist_super_secret_jwt_hmac_key_2026"

def hash_password(password: str) -> str:
    """Hashes a password with a random salt using SHA-256."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return f"{salt}:{key.hex()}"

def verify_password(stored_password_hash: str, provided_password: str) -> bool:
    """Verifies a plain password against the stored salt:hash string."""
    try:
        if ":" not in stored_password_hash:
            # Fallback for plain text during testing/migration
            return stored_password_hash == provided_password
        salt, key_hex = stored_password_hash.split(":", 1)
        new_key = hashlib.pbkdf2_hmac(
            'sha256',
            provided_password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return hmac.compare_digest(new_key.hex(), key_hex)
    except Exception:
        return False

def create_access_token(user_id: str, email: str, expires_in_seconds: int = 86400 * 7) -> str:
    """Creates a signed session token containing user_id and expiration."""
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": int(time.time()) + expires_in_seconds,
        "nonce": secrets.token_hex(8)
    }
    payload_json = json.dumps(payload, separators=(',', ':'))
    payload_b64 = base64.urlsafe_b64encode(payload_json.encode('utf-8')).decode('utf-8').rstrip('=')
    
    signature = hmac.new(
        SECRET_KEY.encode('utf-8'),
        payload_b64.encode('utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return f"{payload_b64}.{signature}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and validates a session token signature and expiration."""
    try:
        if not token or "." not in token:
            return None
        payload_b64, signature = token.split(".", 1)
        
        # Verify HMAC signature
        expected_signature = hmac.new(
            SECRET_KEY.encode('utf-8'),
            payload_b64.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        if not hmac.compare_digest(expected_signature, signature):
            return None
            
        # Add padding back if necessary
        padding = '=' * (-len(payload_b64) % 4)
        payload_json = base64.urlsafe_b64decode(payload_b64 + padding).decode('utf-8')
        payload = json.loads(payload_json)
        
        if payload.get("exp", 0) < time.time():
            return None # Expired
            
        return payload
    except Exception:
        return None
