from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient

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

            if flags.get("bioinformatics"):
                return "Completed"

            if flags.get("library"):
                return "Bioinformatics Stage"

            if flags.get("qc"):
                return "Library Stage"

            if flags.get("method"):
                return "In QC Stage"

            if flags.get("sample_submission"):
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