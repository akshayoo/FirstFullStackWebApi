from fastapi import APIRouter, HTTPException
from schemas.schema import AuthLogin, AuthSignup
from utils.dbfunc import collections_load
from utils.cache import to_hash
from datetime import datetime



router = APIRouter(prefix="/auth")

@router.post("/login")
async def login(payload : AuthLogin):

    collection = collections_load("tcAuth")

    username = payload.username
    password = payload.password

    try:

        data = collection.find_one({"username" : username},
                            {
                                "password" : 1
                            })
        
        password_db = data.get("password")

        if password == password_db:

            user_data = collection.find_one({"username" : username},
                                            {
                                            "name" : 1,
                                            "user_id" : 1,
                                            "role" : "admin",
                                            "is_active" : 1
                                            })
            
            if data.get("is_active") == False:
                return{
                    "auth" : "Not a user"
                }
            else:
                return{
                    "auth" : "success",
                    "name" : user_data.get("name"),
                    "user_id" : user_data.get("user_id"),
                    "role" : user_data.get("role")
                }
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Login unsuccessfull"
        )


@router.post("/signup")
async def signup(payload: AuthSignup):

    username = payload.username.strip()
    password = payload.password

    user_collection = collections_load("tcUsers")   
    auth_collection = collections_load("tcAuth")    

    try:

        data = user_collection.find_one(
            {"user_email": username},
            {"_id": 0}
        )

        if not data:
            return {"status": "Not an authorized user"}

        if data.get("has_signed_up"):
            return {"status": "Already a user please login"}

        auth_doc = {
            "name": data.get("name"),
            "user_id": data.get("user_id"),
            "user_email": data.get("user_email"),
            "password_hash": to_hash(password),
            "role": data.get("role"),
            "is_active": True,
            "created_at": datetime.now(),
            "last_login": None
        }

        auth_collection.insert_one(auth_doc)

        user_collection.update_one(
            {"user_email": username},
            {
                "$set": {"has_signed_up": True}
            }
        )

        return {"status": "Sign Up completed please sign in"}

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Signup failed"
        )

    