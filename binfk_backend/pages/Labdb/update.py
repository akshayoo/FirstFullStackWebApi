from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import datetime

CLIENT = MongoClient("mongodb://localhost:27017")
db = CLIENT.tcDB
collection = db["prLabReport"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_headers=["*"],
    allow_methods=["*"],
    allow_credentials=True,
)

UPLOAD_DIR = "../../REPORTS"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def project_return(doc):
    return {
        "project_id": doc["project"]["project_id"],
        "title": doc["project"]["title"],
        "customer": doc["project"]["customer"],
        "organization": doc["project"]["organization"],


        "sam_type": doc["sample"]["type"],
        "count": doc["sample"]["count"],
        "preservation": doc["sample"]["preservation"],
        "other_info": doc["sample"]["other_info"],


        "method_name": doc["method"]["name"],
        "method_writeup": doc["method"]["writeup"],
        "method_summary": doc["method"]["method_summary"],

        
        "qc_summary": doc["qc"]["qc_summary"],
        "quantification": doc["qc"]["qc_files"]["quantification"],
        "integrity": doc["qc"]["qc_files"]["integrity"],


        "lib_method": doc["library"]["lib_method"],
        "lib_summary": doc["library"]["library_summary"],
        "lib_report": doc["library"]["library_files"]["report"],
        "lib_tape": doc["library"]["library_files"]["tapestation_report"],


        "updated_by": doc["audit"]["updated_by"],
        "updated_date": doc["audit"]["updated_date"],
    }

class ProjectId(BaseModel):
    project_id: str


@app.post("/labdb/update/projectid")
async def post_dbdata(payload: ProjectId):
    project_id = payload.project_id

    project = collection.find_one({"project.project_id": project_id})

    if not project:
        return {
            "status": "Project not found",
            "message": "Project ID not found"
        }

    project["_id"] = str(project["_id"])

    data_now = project_return(project)

    return{
        "status" : "Project Id found",
        "data" : data_now
    }


@app.get("/labdb/update/download")
async def download_files(path: str):
    if not path:
        raise HTTPException(status_code=400, detail="File path is required")

    path = os.path.abspath(path)

    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=path,
        filename=os.path.basename(path),
        media_type="application/octet-stream"
    )


@app.put("/labdb/update/updatedb")
async def updatedb(
    updated_by: str = Form(...),
    project_id: str = Form(...),
    title: str = Form(...),
    customer: str = Form(...),
    organization: str = Form(...),
    sam_type: str = Form(...),
    count: int = Form(...),
    preservation: str = Form(...),
    other_info: str = Form(...),
    method_name: str = Form(...),
    method_writeup: str = Form(...),
    method_summary: str = Form(...),
    qc_summary: str = Form(...),
    lib_method: str = Form(...),
    lib_summary: str = Form(...),
    quantification: UploadFile | None = File(None),
    integrity: UploadFile | None = File(None),
    lib_report: UploadFile | None = File(None),
    lib_tape: UploadFile | None = File(None)
):

    current_data = collection.find_one({"project.project_id": project_id})
    if not current_data:
        raise HTTPException(status_code=404, detail="Project not found")

    project_dir = f"{UPLOAD_DIR}/{project_id}"
    qc_dir = f"{project_dir}/QC"
    lib_dir = f"{project_dir}/LIB"

    os.makedirs(qc_dir, exist_ok=True)
    os.makedirs(lib_dir, exist_ok=True)

    qc_files = current_data["qc"]["qc_files"]
    lib_files = current_data["library"]["library_files"]

    if quantification:
        qc_files["quantification"] = f"{qc_dir}/{quantification.filename}"
        with open(qc_files["quantification"], "wb") as f:
            f.write(await quantification.read())

    if integrity:
        qc_files["integrity"] = f"{qc_dir}/{integrity.filename}"
        with open(qc_files["integrity"], "wb") as f:
            f.write(await integrity.read())

    if lib_report:
        lib_files["report"] = f"{lib_dir}/{lib_report.filename}"
        with open(lib_files["report"], "wb") as f:
            f.write(await lib_report.read())

    if lib_tape:
        lib_files["tapestation_report"] = f"{lib_dir}/{lib_tape.filename}"
        with open(lib_files["tapestation_report"], "wb") as f:
            f.write(await lib_tape.read())

    updated_date = datetime.datetime.now().isoformat()

    update_doc = {
        "project": {
            "project_id": project_id,
            "title": title,
            "customer": customer,
            "organization": organization
        },
        "sample": {
            "type": sam_type,
            "count": count,
            "preservation": preservation,
            "other_info": other_info
        },
        "method": {
            "name": method_name,
            "writeup": method_writeup,
            "method_summary": method_summary
        },
        "qc": {
            "qc_summary": qc_summary,
            "qc_files": qc_files
        },
        "library": {
            "lib_method": lib_method,
            "library_summary": lib_summary,
            "library_files": lib_files
        },
        "audit": {
            "updated_by": current_data["audit"]["updated_by"],
            "updated_date": current_data["audit"]["updated_date"],
            "modified_by": updated_by,
            "modified_date": updated_date
        }
    }

    collection.update_one(
        {"project.project_id": project_id},
        {"$set": update_doc}
    )

    with open(f"{project_dir}/metadata.json", "w") as f:
        json.dump(update_doc, f, indent=2)

    return {
        "status": "Project updated successfully",
        "project_id": project_id,
        "mongo_id": str(current_data["_id"])
    }

