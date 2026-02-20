from fastapi import APIRouter, HTTPException, Depends
from utils.llmcall import ModelLoad
from utils.jwt_utils import parse_token
from utils.dbfunc import collections_load
from bson import ObjectId


router = APIRouter(prefix= "/cuesai")

@router.get("/history")
#async def interaction(usertok : dict = Depends(parse_token)):
async def interaction():

    user_collection = collections_load("tcUsers")
    convo_collection = collections_load("cuesaiConversations")

    try:
        #userid = usertok["user_id"].strip()
        userid = "TIPL_029"

        user = user_collection.find_one({"user_id" :userid},
                                                 {
                                                     "_id" : 1
                                                 })
        
        conversations = (convo_collection.find({"userId": user["_id"],   "isArchived": False }).sort("updatedAt", -1))
        
        convo_obj = []

        for doc in conversations:
            doc["_id"] = str(doc["_id"])
            doc["userId"] = str(doc["userId"])
            convo_obj.append(doc)
        
        return{
            "status" : True,
            "message" : "Fetch successfull",
            "payload" : convo_obj
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to load message"
        )
    

@router.post("/interaction")
async def interaction(usertok : dict = Depends(parse_token)):

    try:
        pass

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Internal server error"
        )