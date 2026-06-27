from fastapi import APIRouter, HTTPException, Depends
from utils.dbfunc import collections_load
from schemas.schema import ProjIdStatus, ProjId, TaskUpdate, ProjComments, TaskAdd
import os
from utils.jwt_utils import parse_token
from fastapi.responses import FileResponse
from urllib.parse import quote
from datetime import datetime 


router = APIRouter(prefix="/project")


def get_project_status(flags: dict) -> str:
    if flags.get("closed"):
        return "Closed"
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



@router.get("/projects")
async def projects_comp(_: dict = Depends(parse_token)):
    try:
        collections = collections_load("tcProjects")

        data = collections.find({},
                                {
                                    "_id": 0,
                                    "project_id": 1,
                                    "project_details.standard_deliverables.completed": 1,
                                    "project_details.added_deliverables.completed": 1,
                                    "project_info": 1,
                                    "service_info": 1,
                                    "project_status": 1,
                                    "audit.created_user": 1,
                                    "audit.created_at": 1,
                                }
                                ).sort("audit.created_at", -1)

        payload = []

        for doc in data:
            std_comp = doc.get("project_details", {}).get("standard_deliverables", [])
            add_comp = doc.get("project_details", {}).get("added_deliverables", [])

            total_elem = len(std_comp) + len(add_comp)
            true_count = sum(1 for d in std_comp + add_comp if d.get("completed") is True)

            project_completion = round(true_count / total_elem * 100) if total_elem > 0 else 0

            payload.append({
                "project_id": doc.get("project_id", ""),
                "pi_name": doc.get("project_info", {}).get("pi_name"),
                "institution": doc.get("project_info", {}).get("institution"),
                "percent": project_completion,
                "status": get_project_status(doc.get("project_status", {})),
                "created_by": doc.get("audit", {}).get("created_user"),
                "created_at": doc.get("audit", {}).get("created_at"),
            })

        return {
            "status": True, 
            "message": "Data fetched", 
            "payload": payload
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500, 
            detail="Could not fetch projects"
        )



@router.get("/projectdash")
async def project_dashboard( _ : dict =  Depends(parse_token)):
    
    try:

        collection = collections_load("tcProjects")

        data = collection.find({},
                               {
                                   "_id" : 0,
                                   "project_status" : 1
                               })
        
        projects  = []

        for doc in data:
            projects.append(doc)
        
        total_projects = len(projects)

        closed = 0
        bioinformatics = 0
        library = 0
        qc = 0
        accepted = 0
        initiated = 0

        for project_stats in projects:
            stats = project_stats.get("project_status")

            if stats.get("closed"): closed += 1; continue
            if stats.get("bioinformatics"): bioinformatics += 1; continue
            if stats.get("library"): library += 1; continue
            if stats.get("qc") : qc += 1; continue
            if stats.get("sample_submission"): accepted += 1; continue
            if stats.get("service_info") : initiated += 1; continue

        print(closed)

        return{
            "status" : True,
            "message" : "Fetch successfull",
            "payload" : {
                "total" : total_projects,
                "closed" : closed,
                "bioinfo" : bioinformatics,
                "library" : library,
                "qc" : qc,
                "accepted" : accepted,
                "initiated" : initiated
            }
        }


    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Fetch failed"
        )




@router.post("/projectcomp")
async def projectcomp_pop(payload: ProjIdStatus, _ : dict = Depends(parse_token)):

    try:

        collections = collections_load("tcProjects")

        project_id = payload.project_id.strip()
        
        data = collections.find_one({"project_id" : project_id}, {"_id" : 0, 
                                                "project_info.pi_name" : 1,
                                                "project_info.email" : 1,
                                                "project_info.phone": 1,
                                                "project_info.institution" : 1,
                                                "project_info.lab_dept" : 1,
                                                "project_stakeholders" : 1,
                                                "service_info.offering_type" : 1,
                                                "service_info.platform" : 1,
                                                "service_info.sample_type" : 1,
                                                "service_info.sample_class" : 1,
                                                "service_info.service_name" : 1,
                                                "service_info.sample_number" : 1,
                                                "service_info.extraction_needed" : 1,
                                                "project_details.standard_deliverables" : 1,
                                                "project_details.added_deliverables" : 1,
                                                "project_status": 1,
                                                "audit":1})
        
        
        if not data:
            return {
                "status": False,
                "message": "Project not found"
            }
        
        pi_name = data["project_info"]["pi_name"]
        email = data["project_info"]["email"]
        phone = data["project_info"]["phone"]
        institution = data["project_info"]["institution"]
        lab_dept =  data["project_info"]["lab_dept"]
        project_stakeholders = data["project_stakeholders"] 
        offering_type = data["service_info"]["offering_type"]
        platform = data["service_info"]["platform"]
        sample_type = data["service_info"]["sample_type"]
        sample_class = data.get("service_info", {}).get("sample_class", "Not specified")
        service_name = data["service_info"]["service_name"]
        sample_number = data["service_info"]["sample_number"]
        sample_extraction_needed = data["service_info"]["extraction_needed"]

        std_del = data["project_details"]["standard_deliverables"]
        add_del = data["project_details"]["added_deliverables"]

        total_elem = len(std_del) + len(add_del)
        true_count = sum(1 for d in std_del + add_del if d.get("completed") is True)

        project_completion = round(true_count / total_elem * 100) if total_elem > 0 else 0

        payload_comp = {
                "project_id" : project_id,
                "project_status" : get_project_status(data.get("project_status", {})),
                "pi_name" : pi_name, 
                "email" : email, 
                "phone" : phone,
                "institution" : institution,
                "lab_dept" : lab_dept,
                "project_stakeholders" : project_stakeholders,
                "offering_type" : offering_type,
                "platform" : platform,
                "sample_type": sample_type,
                "sample_class" : sample_class,
                "service_name": service_name,
                "sample_number" : sample_number,
                "sample_extraction_needed" : sample_extraction_needed,
                "std_del" : std_del,
                "add_del" : add_del,
                "project_completion" : project_completion,
                "created_by" : data.get("audit", {}).get("created_user"),
                "created_at" : data.get("audit", {}).get("created_at"),
                "created_by_email" : data.get("audit", {}).get("username")  
            }
        

        return {
            "status" : True,
            "message" : "Data fetched",
            "payload" : payload_comp
        }
    
    except Exception as e:
        print("ERROR:", str(e))
        HTTPException(
            status_code=500,
            detail= "Failed to fetch project details"
        )






@router.post("/samsubdetails")
async def samsub_pop(payload: ProjId, _: dict = Depends(parse_token)):

    collections = collections_load("tcProjects")
    project_id = payload.project_id.strip()

    try:
        data = collections.find_one(
            {"project_id": project_id},
            {
                "_id": 0,
                "project_status.sample_submission": 1,
                "service_info.service_name": 1,
                "service_info.sample_number": 1,
                "sample_submission": 1
            }
        )

        if not data.get("project_status", {}).get("sample_submission"):
            return {
                "status": False,
                "message": "No sample submission form found. Please contact the client"
            }

        def true_false(val):
            if val == "" or val == " " or val is None:
                return "No data available"
            if val is True or (isinstance(val, str) and val.lower() == "yes"):
                return "Yes"
            elif val is False or (isinstance(val, str) and val.lower() == "no"):
                return "No"
            return val

        def null_val(val):
            if val == "" or val == " " or val is None:
                return "No data available"
            return val

        service_info    = data.get("service_info", {})
        sample_sub_list = data.get("sample_submission", [])


        payload_list = []
        for sub in sample_sub_list:
            details = sub.get("details", {})
            payload_list.append({
                "submission_number":      sub.get("submission_number"),
                "service_technology":     null_val(sub.get("service_technology")),
                "project_description":    null_val(sub.get("project_description")),
                "service_name":           service_info.get("service_name", "No data available"),
                "sample_number":          service_info.get("sample_number", "No data available"),
                "details": {
                    "application":            null_val(details.get("application")),
                    "replicates":             true_false(details.get("replicates")),
                    "extraction_needed":      true_false(details.get("extraction_needed")),
                    "total_rna_prep":         null_val(details.get("total_rna_prep")),
                    "nucleases":              true_false(details.get("nucleases")),
                    "kit_name":               null_val(details.get("kit_name")),
                    "qc_assessed":            null_val(details.get("qc_assessed")),
                    "bioinformatics_required":true_false(details.get("bioinformatics_required")),
                    "key_objectives":         null_val(details.get("key_objectives")),
                    "comparisons":            null_val(details.get("comparisons")),
                    "additional_analysis":    null_val(details.get("additional_analysis")),
                    "reference_studies":      null_val(details.get("reference_studies")),
                    "sample_details":         details.get("sample_details", []),
                    "audit":                  details.get("audit")
                }
            })

        return {
            "status": True,
            "message": "Data fetched",
            "payload": payload_list       
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Sample submission details fetch failed")



@router.post("/projcommupdate")
async def update_comments(payload :  ProjComments, _ : dict=Depends(parse_token)):

    collection = collections_load("tcProjects")

    try:

        project_id = payload.project_id.strip()

        collection.update_one({"project_id" : project_id},
                              {
                                  "$set" : {
                                      "project_comments" : payload.project_comments
                                  }
                              })

        return{
            "status" : True,
            "message" : "Comment updated",
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Comments update failed"
        )





@router.get("/reportspop")
async def reports_pop(fileandpath: str, _ : dict = Depends(parse_token)):

    current_dir = os.getcwd()

    file_path = os.path.join(current_dir, fileandpath)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Report not found")

    return FileResponse(
        path=file_path,
        media_type="application/pdf"
    )




@router.post("/qcsubdetails")
async def qc_sub_pop(payload : ProjId, _ : dict = Depends(parse_token)):
    
    collections = collections_load("tcProjects")
    project_id = payload.project_id

    try:

        data = collections.find_one({"project_id" : project_id},
                                    {
                                        "_id" : 0,
                                        "project_status.qc": 1,
                                        "qc" : 1,
                                    })
        
        if not data:
            return{
                "status" : False,
                "message" : "No QC submission found. Please upload to view"
            }
        
        if data.get("project_status").get("qc") == False:
            return {
                "status" : False,
                "message" : "No QC submission found. Please upload to view"
            }
        
        qcs = data.get("qc", [])
        qc_payload = []

        for qc in qcs:
            qc_report_path = qc.get("qc_report")
            if qc_report_path:
                qc_report_url = f"/project/reportspop?fileandpath={quote(qc_report_path)}"
                qc["qc_report_url"] = qc_report_url
            else:
                qc_report_url = None
                qc["qc_report_url"] = qc_report_url
            
            qc_payload.append(qc)

        return{
            "status" : True,
            "message" : "Data fetched",
            "payload": qc_payload
        }
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "QC details fetch failed"
        )





@router.post("/libqcsubdetails")
async def libqc_sub_pop(payload : ProjId, _ : dict = Depends(parse_token)):

    collections = collections_load("tcProjects")

    project_id = payload.project_id

    try:

        data = collections.find_one({"project_id" : project_id},
                                    {
                                        "_id" : 0,
                                        "project_status.library": 1,
                                        "library" : 1
                                    })
        
        if not data:
            return{
                "status" : False,
                "message" : "No Library QC submission found. Please upload one"
            }
        
        if not data.get("project_status", {}).get("library"):
            return{
                "status" : False,
                "message" : "No Library QC submission found. Please upload one"
            }
        
        librarys = data.get("library", [])
        libqc_payload = []

        for library in librarys:
            library_report = library.get("library_report")

            if library_report:
                lib_report_url = f"/project/reportspop?fileandpath={quote(library_report)}"
                library["lib_report_url"] = lib_report_url
            else:
                lib_report_url = None
                library["lib_report_url"] = lib_report_url

            libqc_payload.append(library)

        return{
            "status" : True,
            "message" : "Data fetched",
            "payload" : libqc_payload, 
        }
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Lib QC details fetch failed"
        )
    



@router.post("/binfsubdetails")
async def binf_sub_pop(payload : ProjId, _ : dict = Depends(parse_token)):

    collections = collections_load("tcProjects")

    project_id = payload.project_id

    try:

        data = collections.find_one({"project_id" : project_id},
                                {
                                    "_id" : 0,
                                    "project_status.bioinformatics": 1,
                                    "bioinformatics" : 1
                                })
        
        if not data:
            return{
                "status" : False,
                "message" : "No Analysis submissions found. Please upload one"
            }
        
        if data.get("project_status", {}).get("bioinformatics") == False:
            return{
                "status" : False,
                "message" : "No Analysis submissions found. Please upload one"
            }

        bioinformatics = data.get("bioinformatics", [])
        binf_payload = []

        for bioinfroma in bioinformatics:

            binf_report = bioinfroma.get("bioinformatics_report")

            if binf_report:
                binf_url = f"/project/reportspop?fileandpath={quote(binf_report)}"
                bioinfroma["binf_url"] = binf_url
            else:
                binf_url = None
                bioinfroma["binf_url"] = binf_url

            binf_payload.append(bioinfroma)

        return{
            "status" :  True,
            "message" : "Data fetched",
            "payload" : binf_payload
        }
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to fetch analysis details"
        )
    





@router.post("/taskstatusupdate")
def task_update(payload : TaskUpdate, usertok : dict = Depends(parse_token)):

    if usertok["role"] == "bd": 
        return{
            "status" : False,
            "message" : "No permission"
        }

    collection = collections_load("tcProjects")

    project_id = payload.project_id
    task_num = payload.task
    sec  = payload.sec.strip()

    try:

        del_sec = "standard_deliverables" if sec == "std" else "added_deliverables"
            
        collection.update_one({"project_id" : project_id},
                            {
                                "$set" : {
                                    f"project_details.{del_sec}.$[elem].completed" : True,
                                    f"project_details.{del_sec}.$[elem].completed_at" : datetime.now(),
                                    f"project_details.{del_sec}.$[elem].updated_user" : usertok["name"],
                                    f"project_details.{del_sec}.$[elem].user_id" : usertok["user_id"],
                                    f"project_details.{del_sec}.$[elem].username" : usertok["username"]
                                },
                                
                            }, array_filters=[{"elem.task_number": task_num}])
        
        return{
            "status" : True,
            "message" : "Task completion updated"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Failed to update task"
        )
    

@router.post("/taskdelete")
async def delete_task(payload:TaskUpdate, usertok :  dict = Depends(parse_token)):

    if usertok["role"] == "admin" or usertok["role"] == "analysis":
        pass
    else: 
        return{
            "status" : False,
            "message" : "No permission"
        }
    
    collection = collections_load("tcProjects")

    project_id = payload.project_id
    task_num = payload.task
    sec  = payload.sec.strip().lower()

    try:

        del_sec = "standard_deliverables" if sec == "std" else "added_deliverables"

        task = collection.update_one({"project_id" : project_id},
                              {
                                  "$pull" : {
                                      f"project_details.{del_sec}": {
                                          "task_number": task_num
                                          }
                                  }
                              })
        if task.modified_count == 0:
            return {"status": False, "message": "Task not found"}

        return{
            "status" : True,
            "message" : "Task deleted"
        }
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Failed to delete task"
        )
    

@router.post("/addtask")
async def add_task(payload : TaskAdd, usertok: dict = Depends(parse_token)):
    if usertok["role"] == "admin" or usertok["role"] == "analysis":
        pass
    else: 
        return{
            "status" : False,
            "message" : "No permission"
        }
    
    collection = collections_load("tcProjects")
    project_id = payload.project_id

    try:

        project_data = collection.find_one({"project_id": project_id})

        all_deliverables = project_data.get("project_details", {}).get("added_deliverables", [])

        last_task_number = max(
            (d["task_number"] for d in all_deliverables), default=-1
        )
        new_task_number = last_task_number + 1

        new_task = {
            "label": payload.project_task,         
            "task_number": new_task_number,
            "completed": False,
            "completed_at": None,
            "updated_user": None,
            "user_id": None,
            "username": None
        }

        collection.update_one(
            {"project_id": project_id},
            {"$push": {"project_details.added_deliverables": new_task}}
        )

        return {
            "status": True,
            "message": "Task added successfully"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Failed to add the task"
        )
    


@router.get("/sampleclasspop")
async def reports_pop(_: dict = Depends(parse_token)):

    collection = collections_load("sampleClass")

    try:
        categories = [
            "Human",
            "Mouse/Rat",
            "Plant",
            "Fungal",
            "Bacterial",
            "Viral",
            "Archaea",
            "Algal",
            "Environmental",
            "Other Animals"
        ]

        response = {}

        for category in categories:
            response[category] = [
                doc["sample_type"]
                for doc in collection.find(
                    {"category": category},
                    {"_id": 0, "sample_type": 1}
                )
            ]

        return response

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Could not process request"
        )
