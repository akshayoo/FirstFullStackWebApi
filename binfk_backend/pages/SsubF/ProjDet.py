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


@app.get("/ssub/projdet/fillinfo")
async def prilim_info():

    categories = collection.find({}, {"category": 1, "_id": 0})

    category_services = {}  

    for cat in categories:
        category = cat["category"]

        items = collection.find(
            {"category": category},
            {"services.service_name": 1, "_id": 0}
        )

        service_list = []

        for doc in items:
            for service in doc.get("services", []):
                service_list.append(service.get("service_name"))

        category_services[category] = service_list
    
    return category_services

"""
@app.get("/ssub/projdet/fillinfo")
async def prilim_info():

    pipeline = [
        {"$unwind": "$services"},
        {
            "$group": {
                "_id": "$category",
                "services": {"$addToSet": "$services.service_name"}
            }
        },
        {
            "$project": {
                "_id": 0,
                "category": "$_id",
                "services": 1
            }
        }
    ]

    result = collection.aggregate(pipeline)

    return {doc["category"]: doc["services"] for doc in result}
"""