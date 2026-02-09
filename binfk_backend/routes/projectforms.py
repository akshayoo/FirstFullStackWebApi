from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
from pymongo import MongoClient
from io import StringIO
import pandas as pd
from datetime import datetime

CLIENT = MongoClient("mongodb://localhost:27017")
db = CLIENT["tcProjects"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

UPLOAD_DIR = "/REPORTS/"


@app.post("/project/qcdataupdate")
async def qcdata_update(
        project_id: str = Form(...),
        method_writeup: str = Form(...),
        method_summary: str = Form(...),
        concentration_technology: str = Form(...),
        integrity_technology: str = Form(...),
        qc_summary: str = Form(...),
        qc_report: UploadFile = File(...),
        qc_data: UploadFile = File(...)
):
    collections = db["tcProjects"]
    try: 
        if not project_id:

            return{
                "status" : "Please refresh the page and try again"
            }
        project_path = f"{UPLOAD_DIR}/{project_id}"
        
        os.makedirs(project_path, exist_ok= True)
        qc_path = f"{project_path}/QC"
        os.makedirs(qc_path, exist_ok= True)

        with open(f"{qc_path}/{qc_report}", 'w') as f:
            f.write(await qc_report)
        
        contents = await qc_data.read()
        csv_data = StringIO(contents.decode("utf-8"))

        data = pd.read_csv(csv_data)
        data = data.rename(columns={
            data.columns[0]: "sample_id",
            data.columns[1]: "tcues_sample_id",
            data.columns[2]: "nucleic_acid_conc",
            data.columns[3]: "integrity",
            data.columns[4]: "comments"
        })

        records = data.fillna("No value").to_dict(orient=records)

        method_document = {
            "writeup" : method_writeup,
            "method_summary" : method_summary,
            "audit" : {
                "completed_at" : datetime.now()
            }
        }

        qc_document = {
            "concentration_technology" : concentration_technology,
            "integrity_technology" : integrity_technology,
            "qc_summary" : qc_summary,
            "qc_report" : f"{qc_path}/{qc_report}",
            "qc_sample_details" : records,
            "audit" : {
                "completed_at" : datetime.now()
            }
        }

        collections.update_one(
            {"project_id": project_id},
            {
                "$set": {
                    "method": method_document,
                    "qc" : qc_document,
                    "form_status.method": True,
                    "form_status.qc": True
                }
            }
        )

        return {
            "status" : "QC Details Updated"
        }
    except Exception as e:
        return{
            "status" : e
        }
        

@app.post("/project/libqcdataupdate")
async def libqcdata_update(
        project_id : str = Form(...),
        library_method : str = Form(...),
        library_summary : str = Form(...),
        library_report : UploadFile = File(...),
        library_data : UploadFile = File(...)
):
    pass

@app.post("/project/binfkilldataupdate")
async def binfdata_update(
        project_id : str = Form(...),
        bioinformatics_summary : str = Form(...),
        estimated_hours : str = Form(...),
        approximate_hours : str = Form(...),
        bioinfromatics_report : str = Form(...)
):
    pass

