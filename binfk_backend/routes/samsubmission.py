from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO
from pydantic import BaseModel
from typing import Dict, Optional, Any, List

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True
)

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
    application: str
    replicates: str
    extraction_needed: str

    rna_prep_method: Optional[str] = None
    rna_kit_name: Optional[str] = None
    dnase_treated: Optional[str] = None
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


class NcounterForm(BaseModel):

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

@app.post("/ssub/projdet/ngsform")
async def ngs_form(payload : ngsForm):
    
    print(payload)

    return {
        "status" : "successfull"
    }


@app.post("/ssub/projdet/ncounter")
async def ncounter_form(payload: NcounterForm):
    
    print(payload)

    return {
        "status" : "Success"
    }