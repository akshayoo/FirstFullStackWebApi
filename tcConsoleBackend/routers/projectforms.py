from fastapi import APIRouter, Form, UploadFile, File
from utils.dbfunc import collections_load
from fastapi import HTTPException
from schemas.schema import ProjId
import os
from io import StringIO
import pandas as pd
from datetime import datetime

router = APIRouter(prefix= "/project")

UPLOAD_DIR = "REPORTS"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/qcdataupdate")
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
    collections = collections_load("tcProjects")

    data = collections.find_one({"project_id" : project_id.strip()},
                                {
                                    "_id" : 0,
                                    "project_status.sample_submission": 1
                                })

    try: 

        if data.get("project_status").get("sample_submission") == False:
            return{"status" : "Sample submission details not found. Please contact the client to update one"}

        if not project_id:
            return{"status" : "Please refresh the page and try again"}
        
        if not qc_data.filename.endswith(".csv"):
            return {"status": "QC data must be a CSV file"}
        
        if not qc_report.filename.lower().endswith(".pdf"):
            return {"status" : "QC report must be in pdf format"}
        

        project_path = f"{UPLOAD_DIR}/{project_id}"
        qc_path = f"{project_path}/QC"

        os.makedirs(qc_path, exist_ok=True)

        qc_report_path = f"{qc_path}/{qc_report.filename}"

        report_readinby = await qc_report.read()

        with open(qc_report_path, "wb") as f:
            f.write(report_readinby)
        
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

        records = data.fillna("No value").to_dict(orient="records")

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
            "qc_report" : qc_report_path,
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
                    "project_status.method": True,
                    "project_status.qc": True
                }
            }
        )

        return {
            "status" : "QC details updated"
        }
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Failed to update qc report"
        )
        

@router.post("/libqcdataupdate")
async def libqcdata_update(
        project_id : str = Form(...),
        library_method : str = Form(...),
        library_summary : str = Form(...),
        library_report : UploadFile = File(...),
        library_data : UploadFile = File(...)
):
    collections = collections_load("tcProjects")

    try:

    
        if not library_report.filename.lower().endswith(".pdf"):
            return {"status" : "Library QC report should be a pdf file"}
        
        if not library_data.filename.endswith(".csv"):
            return {"status" : "Library QC data report should be a csv file"}
        
        project_path = f"{UPLOAD_DIR}/{project_id}"
        lib_path = f"{project_path}/LIB"

        os.makedirs(lib_path, exist_ok=True)

        lib_report_path = f"{lib_path}/{library_report.filename}"

        report_readinby = await library_report.read()

        with open(lib_report_path, 'wb') as f:
            f.write(report_readinby)

        csv_bytes = await library_data.read()
        csv_data = StringIO(csv_bytes.decode('utf-8'))

        data = pd.read_csv(csv_data)
        data = data.rename(columns={
            data.columns[0]: "sample_id",
            data.columns[1]: "tcues_sample_id",
            data.columns[2]: "nucleic_acid_conc",
            data.columns[3]: "comments"
        })

        records = data.fillna("No Value").to_dict(orient="records")

        lib_document = {
            "library_method" : library_method,
            "library_summary" : library_summary,
            "library_report" : lib_report_path,
            "qc_sample_details" : records,
            "audit" : {
                "completed_at" : datetime.now()
            }
        }

        collections.update_one({"project_id" : project_id},
                            {
                                "$set" : {
                                        "library" : lib_document,
                                        "project_status.library": True,
                                }
                            })
        return{"status" : "Lib QC details updated"}
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Failed to update qc report"
        )

    
    

@router.post("/binfkilldataupdate")
async def binfdata_update(
        project_id : str = Form(...),
        bioinformatics_summary : str = Form(...),
        estimated_hours : str = Form(...),
        approximate_hours : str = Form(...),
        bioinformatics_report : UploadFile = File(...)
):
    collections = collections_load("tcProjects")

    try:
        if not bioinformatics_report.filename.lower().endswith(".pdf"):
            return {"status" : "Library QC report should be a pdf file"}
        
        project_path = f"{UPLOAD_DIR}/{project_id}"
        binfk_path = f"{project_path}/ANALYSIS"

        os.makedirs(binfk_path, exist_ok=True)

        binf_report_path = f"{binfk_path}/{bioinformatics_report.filename}"

        binf_reabytes = await bioinformatics_report.read()

        with open(binf_report_path, "wb") as f:
            f.write(binf_reabytes)

        binf_document = {
            "bioinformatics_summary" : bioinformatics_summary,
            "estimated_hours" : estimated_hours,
            "approximate_hours" : approximate_hours,
            "bioinformatics_report" : binf_report_path,
            "audit" : {
                "completed_at" : datetime.now()
            }
        }

        collections.update_one(
            {"project_id": project_id},
            {
                "$set": {
                    "bioinformatics": binf_document,
                    "project_status.bioinformatics": True
                }
            }
        )

        return{"status" : "Analysis details updated"}

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Failed to update qc report"
        )
    
    
@router.post("/closeproject")
def close_project(payload: ProjId):

    project_id = payload.project_id

    try: 
        collection = collections_load("tcProjects")

        data = collection.find_one(
            {"project_id": project_id},
            {"_id": 0, "project_status": 1}
        )

        status = data.get("project_status", {})

        if not status.get("qc") or not status.get("library") or not status.get("bioinformatics"):
            return {"status": "Cannot be closed at this stage"}

        if not status.get("closed"):

            collection.update_one(
                {"project_id": project_id},

                {
                    "$set": {"project_status.closed": True}
                }
            )
            return {"status": "Project closed"}

        return {"status": "Project already closed"}

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Project status error"
        )



    

