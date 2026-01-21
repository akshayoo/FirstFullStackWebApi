from fastapi import FastAPI
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware


CLIENT = MongoClient("mongodb://localhost:27017")
db = CLIENT.tcDB

collection = db['tcStdDeliverables']

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"],
    allow_credentials = True
)

@app.get("/SamSub/ColDataPush")
async def stddel():

    cursor = collection.find()

    tc_std = []

    for doc in cursor:
        doc['_id'] = str(doc['_id'])
        tc_std.append(doc)


    return {
        "status" : "success",
        "payload" : tc_std
    }