from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

CLIENT = MongoClient("mongodb://localhost:27017")

db = CLIENT.tcDB
collections = db["prLabReport"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_headers = ["*"],
    allow_credentials = True,
    allow_methods = ["*"]
)

@app.get("/labdb/view/pagepop")
async def pagepop():

    project_ids_present = collections.distinct("project.project_id")
    return {
        "project_ids" : project_ids_present
    }
