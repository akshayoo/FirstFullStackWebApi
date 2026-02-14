import os
from jose import jwt
from datetime import datetime, timedelta, timezone

SECRET_KEY = "JEIHERKNKEJFIENFJIEFHBEHBHE"
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 90

def create_access_token(data: dict):
    
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(hours=TOKEN_EXPIRE_HOURS)
    payload["iat"] = datetime.now(timezone.utc) 
    
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token