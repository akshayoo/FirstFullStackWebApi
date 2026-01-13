from pymongo import MongoClient
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

CLIENT = MongoClient("mongodb://localhost:27017")
db = CLIENT.chatUserProfiles
collections = db['conversations']

USER_ID = "u_001"


@app.get("/chat/chatContent")
async def postChatContent():
    cursor = collections.find({"userId": USER_ID})

    messages = []

    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        messages.append(doc)

    if not messages:
        raise HTTPException(status_code=404, detail="No Userdata found")
    

    return {
        "userId": USER_ID,
        "conversations": messages
    }