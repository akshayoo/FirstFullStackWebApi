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

    data = collections.find_one({"project_id" : project_id},
                                {
                                    "_id" : 0,
                                    "form_status.sample_submission": 1,
                                    "service_info.service_name" : 1,
                                    "service_info.sample_number" : 1,
                                    "sample_submission": 1
                                })
    
    if data.get("form_status").get("sample_submission") == False:
        return {
            "status" : "NoSubmission",
            "payload" : "No sample submission form found. Please contact the client"
        }
    
    def true_false(bool):
        if bool is True:
            return "Yes"
        elif bool is False:
            return "No"
        return bool
    
    def null_val(val):
        if val == "" or val == " " or val is None:
            return "No data available"
        return val
    
    service_info = data.get("service_info", {})
    sample_sub = data.get("sample_submission", {})
    details = sample_sub.get("details", {})

    return {
        "status": "Fetch successful",
        "payload": {
            "service_name": service_info.get("service_name", "No data available"),
            "sample_number": service_info.get("sample_number", "No data available"),
            "service_technology": null_val(sample_sub.get("service_technology")),
            "application": null_val(details.get("application")),
            
            "replicates": true_false(details.get("replicates", "No data available")),
            "extraction_needed": true_false(details.get("extraction_needed", "No data available")),
            "total_rna_prep": null_val(details.get("total_rna_prep")),
            "nucleases": true_false(details.get("nucleases")),
            "kit_name": null_val(details.get("kit_name")),
            "qc_accessed": null_val(details.get("qc_accessed")),
            "bioinformatics_required": true_false(details.get("bioinformatics_required", "No data available")),
            "key_objectives": null_val(details.get("key_objectives")),
            "comparisons": null_val(details.get("comparisons")),
            "additional_analysis": null_val(details.get("additional_analysis")),
            "reference_studies": null_val(details.get("reference_studies")),
            "sample_details": details.get("sample_details", [])
        }
    }



    


    
