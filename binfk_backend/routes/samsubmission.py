from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO
from pydantic import BaseModel
from typing import Dict, Optional, Any, List
from pymongo import MongoClient
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

CLIENT = MongoClient("mongodb://localhost:27017")
db = CLIENT.tcDB

@app.post("/ssub/samsub/tableupload")
async def populate_form(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        csv_data = StringIO(contents.decode("utf-8"))

        data = pd.read_csv(csv_data)
        data.columns = data.columns.str.strip()

        records = data.fillna("No Value").to_dict(orient="records")

        return {
            "status": "Parsed successfully",
            "submission": records
        }

    except Exception as e:
        return {
            "status": "Error",
            "message": str(e)
        }


class ngsForm(BaseModel):
    project_id: str
    technology: str
    application: str
    replicates: str
    extraction_needed: str

    dnase_treated: Optional[str] = None
    rna_kit_name: Optional[str] = None
    rna_assessment: Optional[str] = None

    rnase_treated: Optional[str] = None
    dna_kit_name: Optional[str] = None
    dna_assessment: Optional[str] = None

    bioinformatics_needed: str
    key_objectives: Optional[str] = None
    differential_comparisons: Optional[str] = None
    additional_analysis: Optional[str] = None
    reference_study: Optional[str] = None

    table: List[Dict[str, Any]]


@app.post("/ssub/projdet/ngsform")
async def ngs_form(payload : ngsForm):

    collection = db['tcProjects']

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
            "qc_accessed": qc_assesed,
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

    collection.update_one({"project_id" : project_id},
                          {"$set" : {"sample_submission" : document}})

    return {
        "status" : "successfull"
    }

class NcounterForm(BaseModel):
    project_id: str
    technology : str
    application: str
    replicates: str
    extraction_needed: str

    rna_prep: Optional[str] = None 
    rna_kit_name: Optional[str] = None
    dnase_treated: Optional[str] = None
    rna_assessment: Optional[str] = None


    bioinformatics_needed: str
    key_objectives: Optional[str] = None
    differential_comparisons: Optional[str] = None
    additional_analysis: Optional[str] = None
    reference_study: Optional[str] = None

    table: List[Dict[str, Any]]


@app.post("/ssub/projdet/ncounter")
async def ncounter_form(payload: NcounterForm):

    collection = db['tcProjects']
    
    document = {
        "service_technology": payload.technology,
        "details" : {
            "application": payload.application,
            "replicates": True if payload.replicates == "Yes" else False,
            "extraction_needed": True if payload.extraction_needed == "Yes" else False,
            "total_rna_prep": payload.rna_prep,
            "nucleases": True if payload.dnase_treated == "Yes" else False,
            "kit_name": payload.rna_kit_name,
            "qc_accessed": payload.rna_assessment,
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

    collection.update_one({"project_id" : project_id},
                          {"$set" : {"sample_submission" : document}})

    return {
        "status" : "Success"
    }