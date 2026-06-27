from fastapi import APIRouter, File, UploadFile, HTTPException
from utils.dbfunc import collections_load
import pandas as pd
from jinja2 import Environment, FileSystemLoader
from io import StringIO
from utils.confgmail import email_config
from schemas.schema import NgsForm, NcounterForm
from datetime import datetime
from uuid import uuid1
from utils.cache import decode_csv_bytes
import logging

router = APIRouter(prefix= "/intake")
logger = logging.getLogger(__name__)

@router.post("/tablepopulate")
async def populate_form(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        text = decode_csv_bytes(contents)
        csv_data = StringIO(text)

        try:
            data = pd.read_csv(csv_data)
        except pd.errors.EmptyDataError:
            return {"status": False, "message": "The uploaded file is empty."}
        except pd.errors.ParserError as e:
            logger.warning(f"CSV parse error for {file.filename}: {e}")
            return {"status": False, "message": "Invalid CSV file. Please use the provided template, save the file in CSV (.csv) format, and try again"}

        if len(data.columns) < 5:
            return {"status": False, "message": "Please use the template provided and upload the data"}

        data = data.rename(columns={
            data.columns[0]: "sample_id",
            data.columns[1]: "description",
            data.columns[2]: "concentration",
            data.columns[3]: "notes",
            data.columns[4]: "replicate_group"
        })

        records = data.dropna(how="all").fillna("No Value").to_dict(orient="records")

        return {"status": True, "message": "Parsed successfully", "submission": records}

    except Exception as e:
        logger.exception(f"Table upload failed for file {file.filename}")
        raise HTTPException(status_code=500, detail="Table upload failed")


@router.post("/ngsform")
async def ngs_form(payload : NgsForm):

    collection = collections_load("tcProjects")

    sam_track = collections_load("sampleTrack")

    try:

        project_id = payload.project_id

        project_token = str(uuid1())

        data = collection.find_one({"project_id" : project_id},
                                   {
                                       "_id" : 0,
                                       "project_info.email": 1,
                                       "sample_submission" : 1,
                                       "project_stakeholders" : 1,
                                       "audit.username" : 1
                                   })
        
        email = data.get("project_info").get("email")


        nuclease = payload.dnase_treated if payload.application == "RNA" else payload.rnase_treated
        kit_name = payload.rna_kit_name if payload.application == "RNA" else payload.dna_kit_name
        qc_assesed = payload.rna_assessment if payload.application == "RNA" else payload.dna_assessment

        result = sam_track.find_one_and_update(
            {"id": "current_sample"},
            {"$inc": {"current_sampleid": len(payload.table)}},
            return_document=False  
        )

        current_sam = result.get("current_sampleid")  

        sample_entries = []

        for entry in payload.table:
            current_sam += 1                                    
            entry["tc_sample_id"] = f"TCSAM{current_sam:06d}"
            sample_entries.append(entry)
        
        document = {
            "submission_number" : 1 if len(data.get("sample_submission", [])) == 0 else len(data.get("sample_submission", [])) + 1,
            "service_technology": payload.technology,
            "project_description" : payload.project_description,
            "details" : {
                "application": payload.application,
                "replicates": payload.replicates == "Yes",
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
                "sample_details": sample_entries,
                "audit": {
                    "submitted_at": datetime.now()
                }
            }
        }
        
        collection.update_one(
            {"project_id": project_id},
            {
                "$push": {
                    "sample_submission": document
                },
                "$set": {
                    "project_token": project_token,
                    "project_status.sample_submission": True
                }
            }
        )

        env = Environment(loader= FileSystemLoader("./templates"))
        template = env.get_template("sample_subnotification.html")

        html_msg = template.render(
            project_id = project_id
        )

        cc_mail_list = [
            "projectmgt@theracues.com",
            "analysis@theracues.com",
            data.get("audit", {}).get("username"),
            *[stakeholder.get("email")for stakeholder in data.get("project_stakeholders", [])]
        ]

        mail_status = await email_config(
            subject= "Sample Submission form recieved",
            to_mail= [email],
            cc_mail= cc_mail_list,
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

    sam_track = collections_load("sampleTrack")

    try:

        project_id = payload.project_id

        data = collection.find_one({"project_id" : project_id},
                                   {
                                       "_id" : 0,
                                       "project_info.email": 1,
                                       "sample_submission" : 1,
                                       "project_stakeholders" : 1,
                                       "audit.username" : 1
                                   })

        result = sam_track.find_one_and_update(
            {"id": "current_sample"},
            {"$inc": {"current_sampleid": len(payload.table)}},
            return_document=False  
        )

        current_sam = result.get("current_sampleid")  

        sample_entries = []

        for entry in payload.table:
            current_sam += 1                                    
            entry["tc_sample_id"] = f"TCSAM{current_sam:06d}"
            sample_entries.append(entry)
    
        document = {
            "submission_number" : 1 if len(data.get("sample_submission", [])) == 0 else len(data.get("sample_submission", [])) + 1,
            "service_technology": payload.technology,
            "project_description" : payload.project_description,
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
                "sample_details": sample_entries,
                "audit": {
                    "submitted_at": datetime.now()
                }
            }
        }
        
        email = data.get("project_info").get("email")

        project_token = str(uuid1())

        collection.update_one(
            {"project_id": project_id},
            {
                "$push": {
                    "sample_submission": document
                },
                "$set": {
                    "project_token": project_token,
                    "project_status.sample_submission": True
                }
            }
        )
        
        env = Environment(loader= FileSystemLoader("./templates"))
        template = env.get_template("sample_subnotification.html")

        html_msg = template.render(
            project_id = project_id
        )

        cc_mail_list = [
            "projectmgt@theracues.com",
            "analysis@theracues.com",
            data.get("audit", {}).get("username"),
            *[stakeholder.get("email")for stakeholder in data.get("project_stakeholders", [])]
        ]

        mail_status = await email_config(
            subject= "Sample Submission form recieved",
            to_mail= [email],
            cc_mail= cc_mail_list,
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