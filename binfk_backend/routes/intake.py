from fastapi import FastAPI
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import HTTPException

CLIENT = MongoClient("mongodb://localhost:27017")
db = CLIENT.tcDB

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"],
    allow_credentials = True
)

class ProjId(BaseModel):
    project_id : str

@app.post("/ssub/samsub/projidsearch")
async def proj_details(payload : ProjId):
    project_id = payload.project_id.strip()

    

    collection = db["tcProjects"]
    try:
        proj_data = collection.find({"project_id" : project_id}, {
            "_id" : 0,
            "project_info.pi_name": 1,
            "project_info.email": 1,
            "project_info.institution" : 1,
            "project_info.lab_dept": 1,
            "service_info.service_name" : 1,
            "service_info.platform" : 1
        })

        data = []

        for doc in proj_data:
            data.append(doc)

 
        project_id = project_id

        if data == []:  return{"status" : "No Project found, Check project ID or Initialize again"}

        pi_name = data[0].get("project_info", {}).get("pi_name", "")
        email =  data[0].get("project_info", {}).get("email", "")
        institution =  data[0].get("project_info", {}).get("institution", "")
        lab_dept = data[0].get("project_info", {}).get("lab_dept", "")
        service_name = data[0].get("service_info", {}).get("service_name", "")
        platform = data[0].get("service_info", {}).get("platform", "").strip()

        match platform:

            case "Bruker NanoString nCounter Sprint Profiler":
                technology = "nCounter"
            case "GeoMx":
                technology = "GeoMx"
            case _:
                technology = "NGS"

        return {
            "status" : "Data fetch Successfull",
            "payload" : {
                "project_id" : project_id,
                "pi_name" : pi_name,
                "email" : email,
                "institution" : institution,
                "lab_dept" : lab_dept,
                "service_name" : service_name,
                "technology" : technology
            }
        }
    

    except Exception as e:
        raise HTTPException(
            status_code= 404,
            detail="Project submission failed"
        )

    
