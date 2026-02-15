from fastapi import APIRouter
from schemas.schema import ProjToken
from utils.dbfunc import collections_load
from fastapi.exceptions import HTTPException

router = APIRouter(prefix= "/intake")



@router.post("/initialinfo")
async def proj_details(payload : ProjToken):

    project_token = payload.project_token.strip()

    collection = collections_load("tcProjects")

    try:
        proj_data = collection.find({"project_token" : project_token}, {
            "project_id" : 1,
            "_id" : 0,
            "project_info.pi_name": 1,
            "project_info.email": 1,
            "project_info.institution" : 1,
            "project_info.lab_dept": 1,
            "service_info.service_name" : 1,
            "service_info.platform" : 1,
            "service_info.sample_number" : 1
        })

        data = []

        for doc in proj_data:
            data.append(doc)


        if data == []:  
            return{
                "status" : False, 
                "message": "No Project found, Check project ID or Initialize again"
            }

        project_id = data[0].get("project_id")
        pi_name = data[0].get("project_info", {}).get("pi_name", "")
        email =  data[0].get("project_info", {}).get("email", "")
        institution =  data[0].get("project_info", {}).get("institution", "")
        lab_dept = data[0].get("project_info", {}).get("lab_dept", "")
        service_name = data[0].get("service_info", {}).get("service_name", "")
        sample_number = data[0].get("service_info", {}).get("sample_number", "")
        platform = data[0].get("service_info", {}).get("platform", "").strip()

        match platform:

            case "Bruker NanoString nCounter Sprint Profiler":
                technology = "nCounter"
            case "GeoMx":
                technology = "GeoMx"
            case _:
                technology = "NGS"

        return {
            "status" : True,
            "message" : "Data fetched",
            "payload" : {
                "project_id" : project_id,
                "pi_name" : pi_name,
                "email" : email,
                "institution" : institution,
                "lab_dept" : lab_dept,
                "service_name" : service_name,
                "technology" : technology,
                "sample_number" : sample_number
            }
        }
    

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail="Error loading project details"
        )

    
