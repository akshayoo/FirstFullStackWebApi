from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel

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

@app.get("/project/projects")
async def projects_comp():
    collections = db["tcProjects"]

    data = collections.find({}, 
                            {"_id": 0,
                            "project_id" : 1,
                            "project_details.standard_deliverables.completed" : 1,
                            "project_details.added_deliverables.completed" : 1,
                            "form_status" : 1
                            })

    list_elements = []

    payload = []

    for doc in data:
        list_elements.append(doc)

    for i in range(len(list_elements)):
        project_id = list_elements[i].get("project_id", "")
        std_comp =  list_elements[i].get("project_details").get("standard_deliverables", [])
        add_comp = list_elements[i].get("project_details").get("added_deliverables", [])

        total_elem = len(std_comp) + len(add_comp)

        true_count = 0

        for std in std_comp:
            if std["completed"] is True:
                true_count += 1

        for add in add_comp:
            if add["completed"] is True:
                true_count + 1

        project_completion = true_count/total_elem *100

        get_status =  list_elements[0].get("form_status")

        def get_project_status(flags: dict) -> str:

            if flags.get("bioinformatics") == True:
                return "Completed"

            if flags.get("library") == True:
                return "Bioinformatics Stage"

            if flags.get("qc") == True:
                return "Library Stage"

            if flags.get("method") == True:
                return "In QC Stage"

            if flags.get("sample_submission") == True:
                return "Accepted"

            return "Initiated"

        status = get_project_status(get_status)

        project = {
            "project_id" : project_id,
            "percent" : project_completion,
            "status" : status
        }

        payload.append(project)
    
    return{
        "status" : "Fetch successfull",
        "payload" : payload
    }



class ProjId(BaseModel):
    project_id : str
    project_status : str

@app.post("/project/projectcomp")
async def projectcomp_pop(payload: ProjId):

    collections = db['tcProjects']

    project_id = payload.project_id.strip()
    
    data = collections.find_one({"project_id" : project_id}, {"_id" : 0,
                                               "project_info.pi_name" : 1,
                                               "project_info.email" : 1,
                                               "project_info.phone": 1,
                                               "project_info.institution" : 1,
                                               "project_info.lab_dept" : 1,
                                               "service_info.offering_type" : 1,
                                               "service_info.platform" : 1,
                                               "project_details.standard_deliverables" : 1,
                                               "project_details.added_deliverables" : 1})
    
    if not data:pass
    
    pi_name = data["project_info"]["pi_name"]
    email = data["project_info"]["email"]
    phone = data["project_info"]["phone"]
    institution = data["project_info"]["institution"]
    lab_dept =  data["project_info"]["lab_dept"]
    offering_type = data["service_info"]["offering_type"]
    platform = data["service_info"]["platform"]
    std_del = data["project_details"]["standard_deliverables"]
    add_del = data["project_details"]["added_deliverables"]

    return {
        "status" : "Fetch Successfull",
        "payload" : {
            "project_id" : project_id,
            "project_status" : payload.project_status,
            "pi_name" : pi_name, 
            "email" : email, 
            "phone" : phone,
            "institution" : institution,
            "lab_dept" : lab_dept,
            "offering_type" : offering_type,
            "platform" : platform,
            "std_del" : std_del,
            "add_del" : add_del 
        }
    }



class ProjIdSamSub(BaseModel):
    project_id : str

@app.post("/project/samsubdetails")
async def samsub_pop(payload : ProjIdSamSub):

    collections = db['tcProjects']

    project_id = payload.project_id.strip()

    data = collections.find_one({"project_id" : project_id}, {"_id" : 0,
                                                              "service_info.service_name" : 1,
                                                              "service_info.sample_type" : 1,
                                                              "service_info.sample_number" : 1,
                                                                "sample_submission.service_technology" : 1,
                                                                "sample_submission.details.application" : 1,
                                                                "sample_submission.details.replicates": 1,
                                                                "sample_submission.details.extraction_needed" : 1,
                                                                "sample_submission.details.nucleases" : 1,
                                                                "sample_submission.details.kit_name" : 1,
                                                                "sample_submission.details.qc_accessed" : 1,
                                                                "sample_submission.details.bioinformatics_required" : 1,
                                                                "sample_submission.details.key_objectives" : 1,
                                                                "sample_submission.details.comparisons" : 1,
                                                                "sample_submission.details.additional_analysis" : 1,
                                                                "sample_submission.details.reference_studies" : 1,
                                                                "sample_submission.details.sample_details" : 1
                                                                })
    

    if not data: pass

    service_technology = data.get("sample_submission", {}).get("service_technology", "No data available")
    application = data.get("sample_submission", {}).get("details", {}).get("application", "No data available")
    replicates = data.get("sample_submission", {}).get("details", {}).get("replicates", "No data available")
    extraction_needed = data.get("sample_submission", {}).get("details", {}).get("extraction_needed", "No data available")
    total_rna_prep = data.get("sample_submission", {}).get("details", {}).get("total_rna_prep", "No data available")
    nucleases = data.get("sample_submission", {}).get("details", {}).get("nucleases", "No data available")
    kit_name = data.get("sample_submission", {}).get("details", {}).get("kit_name", "No data available")
    qc_accessed = data.get("sample_submission", {}).get("details", {}).get("qc_accessed", "No data available")
    bioinformatics_required = data.get("sample_submission", {}).get("details", {}).get("bioinformatics_required", "No data available")
    key_objectives = data.get("sample_submission", {}).get("details", {}).get("key_objectives", "No data available")
    comparisons = data.get("sample_submission", {}).get("details", {}).get("comparisons", "No data available")
    additional_analysis = data.get("sample_submission", {}).get("details", {}).get("additional_analysis", "No data available")
    reference_studies = data.get("sample_submission", {}).get("details", {}).get("reference_studies", "No data available")
    sample_details = data.get("sample_submission", {}).get("details", {}).get("sample_details", [{

            "sample_id": "No data",
            "description": "No data",
            "concentration": "No data",
            "notes": "No data",
            "replicate_group": "No data"
    }])

    return {
        "status" : "Fetch successfull",
        "payload" : {
            "service_technology" : service_technology,
            "application": application,
            "replicates": replicates,
            "extraction_needed": extraction_needed,
            "total_rna_prep": total_rna_prep,
            "nucleases": nucleases,
            "kit_name": kit_name,
            "qc_accessed": qc_accessed,
            "bioinformatics_required": bioinformatics_required,
            "key_objectives": key_objectives,
            "comparisons": comparisons,
            "additional_analysis": additional_analysis,
            "reference_studies": reference_studies,
            "sample_details" : sample_details
        }
    }



    
