from fastapi import APIRouter, File, UploadFile, HTTPException
from utils.dbfunc import collections_load
import pandas as pd
from jinja2 import Environment, FileSystemLoader
from io import StringIO
from utils.confgmail import email_config
from schemas.schema import NgsForm, NcounterForm
from datetime import datetime
from uuid import uuid1

router = APIRouter(prefix= "/intake")

@router.post("/tablepopulate")
async def populate_form(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        csv_data = StringIO(contents.decode("utf-8"))

        data = pd.read_csv(csv_data)

        if len(data.columns) < 5:
            return {"status": False, "message": "Please use the template provided and upload the data"}
        
        data = data.rename(columns={
            data.columns[0]: "sample_id",
            data.columns[1]: "description",
            data.columns[2]: "concentration",
            data.columns[3]: "notes",
            data.columns[4]: "replicate_group"
        })

        records = data.fillna("No Value").to_dict(orient="records")

        return {
            "status" : True,
            "message": "Parsed successfully",
            "submission": records
        }

    except Exception as e:
        raise HTTPException(
            status_code= 500,
            detail= "Table upload failed"
        )


@router.post("/ngsform")
async def ngs_form(payload : NgsForm):

    collection = collections_load("tcProjects")

    try:

        nuclease = payload.dnase_treated if payload.application == "RNA" else payload.rnase_treated
        kit_name = payload.rna_kit_name if payload.application == "RNA" else payload.dna_kit_name
        qc_assesed = payload.rna_assessment if payload.application == "RNA" else payload.dna_assessment
        
        document = {
            "service_technology": payload.technology,
            "details" : {
                "application": payload.application,
                "replicates": True if payload.replicates == "Yes" else False,
                "extraction_needed": True if payload.extraction_needed == "Yes" else False,
                "total_rna_prep": "Not applicable",
                "nucleases": nuclease,
                "kit_name": kit_name,
                "qc_assessed": qc_assesed,
                "bioinformatics_required": True if payload.bioinformatics_needed == "Yes" else False,
                "key_objectives": payload.key_objectives,
                "comparisons": payload.differential_comparisons,
                "additional_analysis": payload.additional_analysis,
                "reference_studies": payload.reference_study,
                "sample_details": payload.table,
                "audit": {
                    "submitted_at": datetime.now()
                }
            }
        }
        

        project_id = payload.project_id

        project_token = str(uuid1())

        data = collection.find_one({"project_id" : project_id},
                                   {
                                       "_id" : 0,
                                       "project_info.email": 1,
                                   })
        
        email = data.get("project_info").get("email")

        collection.update_one(
            {"project_id": project_id},
            {
                "$set": {
                    "project_token" : project_token,
                    "sample_submission": document,
                    "project_status.sample_submission": True
                }
            }
        )

        env = Environment(loader= FileSystemLoader("./templates"))
        template = env.get_template("sample_subnotification.html")

        html_msg = template.render(
            project_id = project_id
        )

        mail_status = await email_config(
            subject= "Sample Submission form recieved",
            to_mail= [email],
            cc_mail= ["itsmeakshay8055@theracues.com"],
            mail_html= html_msg
        )

        return {
            "status" : True,
            "message" : f"Sample submission form recieved"
        }
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail="Sample submission failed"
        )




@router.post("/ncounterform")
async def ncounter_form(payload: NcounterForm):

    collection = collections_load("tcProjects")

    try:
    
        document = {
            "service_technology": payload.technology,
            "details" : {
                "application": payload.application,
                "replicates": True if payload.replicates == "Yes" else False,
                "extraction_needed": True if payload.extraction_needed == "Yes" else False,
                "total_rna_prep": payload.rna_prep,
                "nucleases": True if payload.dnase_treated == "Yes" else False,
                "kit_name": payload.rna_kit_name,
                "qc_assessed": payload.rna_assessment,
                "bioinformatics_required": True if payload.bioinformatics_needed == "Yes" else False,
                "key_objectives": payload.key_objectives,
                "comparisons": payload.differential_comparisons,
                "additional_analysis": payload.additional_analysis,
                "reference_studies": payload.reference_study,
                "sample_details": payload.table,
                "audit": {
                    "submitted_at": datetime.now()
                }
            }
        }

        project_id = payload.project_id

        data = collection.find_one({"project_id" : project_id},
                                   {
                                       "_id" : 0,
                                       "project_info.email": 1,
                                   })
        
        email = data.get("project_info").get("email")

        project_token = str(uuid1())

        collection.update_one(
            {"project_id": project_id},
            {
                "$set": {
                    "project_token" : project_token,
                    "sample_submission": document,
                    "project_status.sample_submission": True
                }
            }
        )
        env = Environment(loader= FileSystemLoader("./templates"))
        template = env.get_template("sample_subnotification.html")

        html_msg = template.render(
            project_id = project_id
        )

        mail_status = await email_config(
            subject= "Sample Submission form recieved",
            to_mail= [email],
            cc_mail= ["itsmeakshay8055@theracues.com"],
            mail_html= html_msg
        )

        return {
            "status" : True,
             "message" :  f"Sample submission form recieved"
        }
    

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail="Sample submission failed"
        )