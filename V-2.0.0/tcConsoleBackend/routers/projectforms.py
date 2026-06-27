from fastapi import APIRouter, Form, UploadFile, File, Depends
from utils.dbfunc import collections_load
from fastapi import HTTPException
from schemas.schema import ProjId
from utils.jwt_utils import parse_token
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
        qc_application: str = Form(...),
        method_summary: str = Form(...),
        concentration_technology: str = Form(...),
        integrity_technology: str = Form(...),
        qc_summary: str = Form(...),
        qc_report: UploadFile = File(...),
        qc_data: UploadFile = File(...),

        usertok : dict = Depends(parse_token)
):
    
    if usertok["role"] == "bd" or usertok["role"] == "analysis":
        return{
            "status" : False,
            "message" : "No permission"
        }

    collections = collections_load("tcProjects")

    data = collections.find_one({"project_id" : project_id.strip()},
                                {
                                    "_id" : 0,
                                    "project_status.sample_submission": 1,
                                    "method": 1,
                                    "qc": 1
                                })

    try:

        if not data: 
            return{
                "status" : False,
                'message' : "Unable to process request please try after sometime"
            }

        if not data.get("project_status",{}).get("sample_submission"):
            return{
                "status" : False,
                "message" : "Sample submission details not found. Please contact the client to update one"
            }

        if not project_id:
            return{
                "status" : False,
                "message" : "Please refresh the page and try again"
            }
        
        if not qc_data.filename.lower().endswith(".csv"):
            return {
                "status": False,
                "message" :  "QC data must be a CSV file"
            }
        
        if not qc_report.filename.lower().endswith(".pdf"):
            return {
                "status" : False,
                "message"  : "QC report must be in pdf format"
            }
        

        project_path = f"{UPLOAD_DIR}/{project_id}"
        qc_path = f"{project_path}/QC"

        os.makedirs(qc_path, exist_ok=True)

        qc_report_path = f"{qc_path}/{datetime.now()}_{qc_report.filename}"

        report_readinby = await qc_report.read()

        with open(qc_report_path, "wb") as f:
            f.write(report_readinby)

        if qc_application == "RNA":
        
            contents = await qc_data.read()
            csv_data = StringIO(contents.decode("utf-8"))

            df = pd.read_csv(csv_data)

            if len(df.columns) != 5:
                return{
                    "status" : False,
                    "message" : "Please use the RNA template to upload the data again"
                }

            df = df.rename(columns={
                df.columns[0]: "sample_id",
                df.columns[1]: "tcues_sample_id",
                df.columns[2]: "nucleic_acid_conc",
                df.columns[3]: "integrity",
                df.columns[4]: "comments"
            })

            records = df.fillna("No value").to_dict(orient="records")

        if qc_application == "DNA":
        
            contents = await qc_data.read()
            csv_data = StringIO(contents.decode("utf-8"))

            df = pd.read_csv(csv_data)

            if len(df.columns) != 7:
                return{
                    "status" : False,
                    "message" : "Please use the template DNA to upload the data again"
                }

            df = df.rename(columns={
                df.columns[0]: "sample_id",
                df.columns[1]: "tcues_sample_id",
                df.columns[2]: "conc_f",
                df.columns[3]: "purity_ratio_f",
                df.columns[4]: "purity_ratio_s",
                df.columns[5] : "conc_s",
                df.columns[6] : "comments"
            })

            records = df.fillna("No value").to_dict(orient="records")

        qc_count = len(data.get("qc", []))

        qc_document = {
            "submission_number" : qc_count + 1,
            "qc_application" : qc_application,
            "method_summary" : method_summary,
            "concentration_technology" : concentration_technology,
            "integrity_technology" : integrity_technology,
            "qc_summary" : qc_summary,
            "qc_report" : qc_report_path,
            "qc_sample_details" : records,
            "qc_audit" : {
                "completed_at" : datetime.now(),
                "updated_user"  : usertok["name"],
                "user_id" : usertok["user_id"],
                "username" : usertok["username"]
            }
        }

        collections.update_one(
            {"project_id": project_id},
            {
                "$push": {
                    "qc" : qc_document,
                }
            }
        )

        collections.update_one(
            {"project_id": project_id},
            {
                "$set": {
                    "project_status.method": True,
                    "project_status.qc": True
                }
            }
        )

        return {
            "status" : True,
            "message" : "QC details updated"
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
        library_data : UploadFile = File(...),

        usertok : dict = Depends(parse_token)
):
    
    if usertok["role"] == "bd" or usertok["role"] == "analysis":
        return{
            "status" : False,
            "message" : "No permission"
        }
    collections = collections_load("tcProjects")
    
    data = collections.find_one({"project_id" : project_id.strip()},
                            {
                                "_id" : 0,
                                "project_status.sample_submission": 1,
                                "library": 1                           
                            })


    try:

        if not data: 
            return{
                "status" : False,
                'message' : "Unable to process request please try after sometime"
            }

        if not data.get("project_status",{}).get("sample_submission"):
            return{
                "status" : False,
                "message" : "Sample submission details not found. Please contact the client to update one"
            }
    
        if not library_report.filename.lower().endswith(".pdf"):
            return {"status" : False,
                    "message" : "Library QC report should be a pdf file"}
        
        if not library_data.filename.lower().endswith(".csv"):
            return {"status" : False,
                    "message" : "Library QC data report should be a csv file"}
        
        project_path = f"{UPLOAD_DIR}/{project_id}"
        lib_path = f"{project_path}/LIB"

        os.makedirs(lib_path, exist_ok=True)

        lib_report_path = f"{lib_path}/{datetime.now()}_{library_report.filename}"

        report_readinby = await library_report.read()

        with open(lib_report_path, 'wb') as f:
            f.write(report_readinby)

        csv_bytes = await library_data.read()
        csv_data = StringIO(csv_bytes.decode('utf-8'))

        data = pd.read_csv(csv_data)

        if len(data.columns) < 4:
            return{
                "status" : False,
                "message" : "Please use the template to upload the data again"
            }

        data = data.rename(columns={
            data.columns[0]: "sample_id",
            data.columns[1]: "tcues_sample_id",
            data.columns[2]: "nucleic_acid_conc",
            data.columns[3]: "comments"
        })

        records = data.fillna("No Value").to_dict(orient="records")
        libqc_count = len(data.get("library", []))

        lib_document = {
            "submission_number" : libqc_count + 1,
            "library_method" : library_method,
            "library_summary" : library_summary,
            "library_report" : lib_report_path,
            "qc_sample_details" : records,
            "audit" : {
                "completed_at" : datetime.now(),
                "updated_user"  : usertok["name"],
                "user_id" : usertok["user_id"],
                "username" : usertok["username"]
            }
        }

        collections.update_one({"project_id" : project_id},
                            {
                                "$push" : {
                                        "library" : lib_document,
                                }
                            })
        
        collections.update_one({"project_id" : project_id},
                            {
                                "$set" : {
                                        "project_status.library": True,
                                }
                            })
        
        return{"status" : True,
               "message" : "Lib QC details updated"}
    
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
        bioinformatics_report : UploadFile = File(...),

        usertok : dict = Depends(parse_token)
):
    
    if usertok["role"] == "bd" or usertok["role"] == "projects" :
        return{
            "status" : False,
            "message" : "No permission"
        }


    collections = collections_load("tcProjects")

    data = collections.find_one({"project_id" : project_id.strip()},
                            {
                                "_id" : 0,
                                "project_status.sample_submission": 1,
                                "bioinformatics": 1
                            })

    try:


        if not data: 
            return{
                "status" : False,
                'message' : "Unable to process request please try after sometime"
            }

        if not data.get("project_status",{}).get("sample_submission"):
            return{
                "status" : False,
                "message" : "Sample submission details not found. Please contact the client to update one"
            }
        
        if not bioinformatics_report.filename.lower().endswith(".pdf"):
            return {
                "status" : False,
                "message" : "Bioinformatics report should be a pdf file"
            }
        
        project_path = f"{UPLOAD_DIR}/{project_id}"
        binfk_path = f"{project_path}/ANALYSIS"

        os.makedirs(binfk_path, exist_ok=True)

        binf_report_path = f"{binfk_path}/{bioinformatics_report.filename}_{datetime.now()}"

        binf_reabytes = await bioinformatics_report.read()

        with open(binf_report_path, "wb") as f:
            f.write(binf_reabytes)

        binf_count = len(data.get("bioinformatics", []))

        binf_document = {
            "submission_number" : binf_count + 1,
            "bioinformatics_summary" : bioinformatics_summary,
            "estimated_hours" : estimated_hours,
            "approximate_hours" : approximate_hours,
            "bioinformatics_report" : binf_report_path,
            "binf_audit" : {
                "completed_at" : datetime.now(),
                "updated_user"  : usertok["name"],
                "user_id" : usertok["user_id"],
                "username" : usertok["username"]
            }
        }

        collections.update_one(
            {"project_id": project_id},
            {
                "$push": {
                    "bioinformatics": binf_document,
                }
            }
        )

        collections.update_one(
            {"project_id": project_id},
            {
                "$set": {
                    "project_status.bioinformatics": True
                }
            }
        )

        return {
            "status": True,
            "message": "Analysis details updated"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Failed to update analysis report"
        )
    

    
    
@router.post("/closeproject")
def close_project(payload: ProjId, usertok : dict = Depends(parse_token)):

    if usertok["role"] == "bd":
        return{
            "status" : False,
            "message" : "No permission"
        }
    
    collection = collections_load("tcProjects")

    try: 

        project_id = payload.project_id

        data = collection.find_one(
            {"project_id": project_id},
            {"_id": 0, "project_status": 1}
        )

        status = data.get("project_status", {})

        if not status.get("qc") and not status.get("library") and not status.get("bioinformatics"):
            return {"status": False,
                    "message" : "Cannot be closed at this stage"}

        if not status.get("closed"):

            collection.update_one(
                {"project_id": project_id},

                {
                    "$set": {"project_status.closed": True}
                }
            )
            return {"status": True,
                    "message" : "Project closed"}

        return {"status": False,
                "message" : "Project already closed"}

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Project status error"
        )
    

@router.post("/deleteproject")
async def delete_project(payload : ProjId, usertok : dict = Depends(parse_token)):

    if usertok["role"] == "analysis" or usertok["role"] == "projects" or usertok["role"] == "bd" :
        return{
            "status" : False,
            "message" : "No permission"
        }
    
    collection = collections_load("tcProjects")
    delete_collection = collections_load("tcDropProjects")
    
    try:

        project_id = payload.project_id

        data = collection.find_one({"project_id": project_id}, {"_id": 0})

        if not data:
            return {
                "status": False,
                "message": "Project not found"
            }

        delete_collection.insert_one(data)
        collection.delete_one({"project_id": project_id})

        return{
            "status" : True,
            "message" : "Project deleted"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Delete project error"
        ) 




    

