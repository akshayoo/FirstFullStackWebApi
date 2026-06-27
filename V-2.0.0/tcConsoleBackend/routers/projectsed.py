from fastapi import APIRouter, HTTPException, Depends, Form, UploadFile, File
from utils.dbfunc import collections_load
from schemas.schema import EditCheck
from utils.jwt_utils import parse_token
from datetime import datetime
import pandas as pd
from io import StringIO
import os
from typing import Optional

router = APIRouter(prefix="/project")

UPLOAD_DIR = "REPORTS"


@router.post("/qcdataedit")
async def qcdata_edit(
        project_id : str = Form(...),
        submission_no : int = Form(...),
        qc_application : str = Form(...),
        method_summary : str = Form(...),
        concentration_technology : str = Form(...),
        integrity_technology : str = Form(...),
        qc_summary : str = Form(...),
        qc_report : Optional[UploadFile] = File(None),
        qc_data :  Optional[UploadFile] = File(None),

        usertok : dict = Depends(parse_token)
):
    if usertok["role"] == "bd" or usertok["role"] == "analysis":
        return {"status": False, "message": "No permission"}

    collections = collections_load("tcProjects")
    idx = submission_no - 1

    try:
        update_fields = {
            f"qc.{idx}.qc_application": qc_application,
            f"qc.{idx}.method_summary": method_summary,
            f"qc.{idx}.concentration_technology": concentration_technology,
            f"qc.{idx}.integrity_technology": integrity_technology,
            f"qc.{idx}.qc_summary": qc_summary,
            f"qc.{idx}.qc_audit.updated_user":  usertok["name"],
            f"qc.{idx}.qc_audit.user_id": usertok["user_id"],
            f"qc.{idx}.qc_audit.username": usertok["username"],
            f"qc.{idx}.qc_audit.edited_at": datetime.now(),
        }

        if qc_report and qc_report.filename:

            if not qc_report.filename.lower().endswith(".pdf"):
                return {"status": False, "message": "QC report must be a PDF"}
            
            project_path = f"{UPLOAD_DIR}/{project_id}/QC"
            os.makedirs(project_path, exist_ok=True)

            qc_report_path = f"{project_path}/{datetime.now()}_{qc_report.filename}"
            with open(qc_report_path, "wb") as f:

                f.write(await qc_report.read())

            update_fields[f"qc.{idx}.qc_report"] = qc_report_path


        if qc_data and qc_data.filename:

            if not qc_data.filename.lower().endswith(".csv"):
                return {"status": False, "message": "QC data must be a CSV"}
            
            contents = await qc_data.read()
            df = pd.read_csv(StringIO(contents.decode("utf-8")))

            if qc_application == "RNA":

                if len(df.columns) != 5:
                    return {"status": False, "message": "Please use the RNA template"}
                
                df = df.rename(columns={
                    df.columns[0]: "sample_id",     
                    df.columns[1]: "tcues_sample_id",
                    df.columns[2]: "nucleic_acid_conc", 
                    df.columns[3]: "integrity",
                    df.columns[4]: "comments"
                })

            elif qc_application == "DNA":

                if len(df.columns) != 7:
                    return {"status": False, "message": "Please use the DNA template"}
                
                df = df.rename(columns={
                    df.columns[0]: "sample_id",       
                    df.columns[1]: "tcues_sample_id",
                    df.columns[2]: "conc_f",           
                    df.columns[3]: "purity_ratio_f",
                    df.columns[4]: "purity_ratio_s",   
                    df.columns[5]: "conc_s",
                    df.columns[6]: "comments"
                })

            update_fields[f"qc.{idx}.qc_sample_details"] = df.fillna("No value").to_dict(orient="records")

        collections.update_one(
            {"project_id": project_id},
            {"$set": update_fields}
        )

        return {"status": True, "message": "QC data updated"}

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Failed to edit QC data")




@router.post("/libqcdataedit")
async def libqcdata_edit(
        project_id: str = Form(...),
        submission_no: int = Form(...),
        library_method: str  = Form(...),
        library_summary: str = Form(...),
        library_report: Optional[UploadFile] = File(None),  
        library_data: Optional[UploadFile] = File(None), 

        usertok : dict = Depends(parse_token)
):
    if usertok["role"] == "bd" or usertok["role"] == "analysis":
        return {"status": False, "message": "No permission"}

    collections = collections_load("tcProjects")
    idx = submission_no - 1

    try:
        update_fields = {
            f"library.{idx}.library_method": library_method,
            f"library.{idx}.library_summary": library_summary,
            f"library.{idx}.lib_audit.updated_user": usertok["name"],
            f"library.{idx}.lib_audit.user_id": usertok["user_id"],
            f"library.{idx}.lib_audit.username": usertok["username"],
            f"library.{idx}.lib_audit.edited_at": datetime.now(),
        }

        if library_report and library_report.filename:

            if not library_report.filename.lower().endswith(".pdf"):
                return {"status": False, "message": "Library report must be a PDF"}
            
            lib_path = f"{UPLOAD_DIR}/{project_id}/LIB"
            os.makedirs(lib_path, exist_ok=True)

            lib_report_path = f"{lib_path}/{datetime.now()}_{library_report.filename}"

            with open(lib_report_path, "wb") as f:
                f.write(await library_report.read())

            update_fields[f"library.{idx}.library_report"] = lib_report_path


        if library_data and library_data.filename:
            if not library_data.filename.lower().endswith(".csv"):
                return {"status": False, "message": "Library data must be a CSV"}
            
            csv_bytes = await library_data.read()

            df = pd.read_csv(StringIO(csv_bytes.decode("utf-8")))

            if len(df.columns) < 4:
                return {"status": False, "message": "Please use the library QC template"}
            
            df = df.rename(columns={
                df.columns[0]: "sample_id",       
                df.columns[1]: "tcues_sample_id",
                df.columns[2]: "nucleic_acid_conc", 
                df.columns[3]: "comments"
            })
            update_fields[f"library.{idx}.qc_sample_details"] = df.fillna("No Value").to_dict(orient="records")

        collections.update_one(
            {"project_id": project_id},
            {"$set": update_fields}
        )

        return {"status": True, "message": "Library QC updated"}

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Failed to edit library QC")




@router.post("/binfdataedit")
async def binfdata_edit(
        project_id : str = Form(...),
        submission_no: int = Form(...),
        bioinformatics_summary: str = Form(...),
        estimated_hours: int = Form(...),
        approximate_hours: int = Form(...),
        bioinformatics_report: Optional[UploadFile] = File(None),  
        usertok: dict = Depends(parse_token)
):
    if usertok["role"] == "bd" or usertok["role"] == "projects":
        return {"status": False, "message": "No permission"}

    collections = collections_load("tcProjects")
    idx = submission_no - 1

    try:
        update_fields = {
            f"bioinformatics.{idx}.bioinformatics_summary": bioinformatics_summary,
            f"bioinformatics.{idx}.estimated_hours":        estimated_hours,
            f"bioinformatics.{idx}.approximate_hours":      approximate_hours,
            f"bioinformatics.{idx}.binf_audit.updated_user": usertok["name"],
            f"bioinformatics.{idx}.binf_audit.user_id":     usertok["user_id"],
            f"bioinformatics.{idx}.binf_audit.username":    usertok["username"],
            f"bioinformatics.{idx}.binf_audit.edited_at":   datetime.now(),
        }

        if bioinformatics_report and bioinformatics_report.filename:

            if not bioinformatics_report.filename.lower().endswith(".pdf"):
                return {"status": False, "message": "Analysis report must be a PDF"}
            
            binf_path = f"{UPLOAD_DIR}/{project_id}/ANALYSIS"
            os.makedirs(binf_path, exist_ok=True)

            binf_report_path = f"{binf_path}/{bioinformatics_report.filename}_{datetime.now()}"

            with open(binf_report_path, "wb") as f:
                f.write(await bioinformatics_report.read())

            update_fields[f"bioinformatics.{idx}.bioinformatics_report"] = binf_report_path

        collections.update_one(
            {"project_id": project_id},
            {"$set": update_fields}
        )

        return {"status": True, "message": "Analysis updated"}

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Failed to edit analysis data")