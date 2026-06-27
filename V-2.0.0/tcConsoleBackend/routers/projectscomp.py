from fastapi import HTTPException, APIRouter, UploadFile, File, Form, Depends
from fastapi.responses import FileResponse
from utils.dbfunc import collections_load
from schemas.schema import StakeholderPayload, EditClientPayload, EditServicePayload, CommentPayload, ProjId, DeleetAddReport
from utils.jwt_utils import parse_token
from datetime import datetime
from bson import ObjectId
import os
import magic

router = APIRouter(prefix="/projects")


@router.post("/addstakeholder")
async def add_stakeholder(payload: StakeholderPayload, usertok: dict = Depends(parse_token)):

    collections = collections_load("tcProjects")

    try:

        project = collections.find_one(
            {"project_id": payload.project_id},
            {"_id": 0, "audit.user_id": 1}
        )

        if not project:
            return {
                "status": False,
                "message": "Project not found"
            }

        if project.get("audit", {}).get("user_id") != usertok["user_id"]:
            return {
                "status": False,
                "message": "Not allowed, only the project creator can add stakeholders"
            }

        new_entry = {
            "name":    payload.name,
            "email":   payload.email,
            "added_by": usertok["user_id"]
        }

        result = collections.update_one(
            {
                "project_id": payload.project_id
            },
            {"$push": {"project_stakeholders": new_entry}}
        )

        if result.modified_count == 0:
            return {
                "status":  False,
                "message": "Stakeholder not added"
            }

        return {
            "status":  True,
            "message": f"{payload.name} added as stakeholder"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to add stakeholder"
        )
    


@router.post("/editclientdata")
async def edit_client_data(payload: EditClientPayload, usertok: dict = Depends(parse_token)):

    collections = collections_load("tcProjects")

    try:


        project = collections.find_one(
            {
                "project_id": payload.project_id
            },
            {"_id": 0, "audit.user_id": 1}
        )

        if not project:
            return {"status": False, "message": "Project not found"}

        if project.get("audit", {}).get("user_id") != usertok["user_id"]:
            return {"status": False, "message": "Not allowed, only the project creator can edit"}

        result = collections.update_one(
            {"project_id": payload.project_id},
            {"$set": {
                "project_info.pi_name": payload.pi_name,
                "project_info.email": payload.email,
                "project_info.phone": payload.phone,
                "project_info.institution": payload.institution,
                "project_info.lab_dept": payload.lab_dept,
                "service_info.offering_type": payload.offering_type,
            }}
        )

        if result.modified_count == 0:
            return {
                "status": False, 
                "message": "No changes made"
            }

        return {
            "status": True, 
            "message": "Client details updated"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500, 
            detail="Failed to update client details"
        )
    


@router.post("/editservicedata")
async def edit_service_data(payload: EditServicePayload, usertok: dict = Depends(parse_token)):

    collections = collections_load("tcProjects")

    try:
        project = collections.find_one(
            {
                "project_id": payload.project_id
            },
            {"_id": 0, "audit.user_id": 1}
        )

        if not project:
            return {"status": False, "message": "Project not found"}

        if project.get("audit", {}).get("user_id") != usertok["user_id"]:
            return {"status": False, "message": "Not allowed — only the project creator can edit"}

        result = collections.update_one(
            {"project_id": payload.project_id},
            {"$set": {
                "service_info.service_name": payload.service_name,
                "service_info.platform": payload.platform,
                "service_info.sample_type": payload.sample_type,
                "service_info.sample_number": payload.sample_number,
                "service_info.extraction_needed": payload.sample_extraction_needed,
            }}
        )

        if result.modified_count == 0:
            return {
                "status": False, 
                "message": "No changes made"
            }

        return {
            "status": True, 
            "message": "Service details updated"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500, 
            detail="Failed to update service details"
        )
    


@router.post("/addcomment")
async def add_comment(payload: CommentPayload, usertok: dict = Depends(parse_token)):
 
    if not payload.comment.strip():
        return {"status": False, "message": "Comment cannot be empty"}
 
    if len(payload.comment) > 1000:
        return {"status": False, "message": "Comment too long- max 1000 characters"}
 
    comments_col = collections_load("tcProjectComments")
    projects_col = collections_load("tcProjects")
 
    try:

        project = projects_col.find_one(
            {
                "project_id": payload.project_id
            },
            {"_id": 0, "project_id": 1}
        )
 
        if not project:
            return {"status": False, "message": "Project not found"}
 
        document = {
            "project_id":   payload.project_id,
            "comment":      payload.comment.strip(),
            "commented_by": usertok["name"],
            "user_id":      usertok["user_id"],
            "username":     usertok["username"],
            "role":         usertok["role"],
            "created_at":   datetime.now()
        }
 
        comments_col.insert_one(document)
 
        return {
            "status":  True,
            "message": "Comment added"
        }
 
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500, 
            detail="Failed to add comment"
        )
    
 
 
@router.get("/getcomments/{project_id}")
async def get_comments(project_id: str, _: dict = Depends(parse_token)):
 
    comments_col = collections_load("tcProjectComments")
 
    try:
        cursor = comments_col.find({"project_id": project_id},{"_id": 0}).sort("created_at", -1)  
 
        comments = list(cursor)
 
        for c in comments:
            if isinstance(c.get("created_at"), datetime):
                c["created_at"] = c["created_at"].isoformat()
 
        return {
            "status":  True,
            "message": f"{len(comments)} comments fetched",
            "payload": comments
        }
 
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500, 
            detail="Failed to fetch comments"
        )
    



UPLOAD_DIR = "REPORTS"
MIME_TO_EXT = {
    "application/pdf": "pdf",
    "text/csv": "csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "image/png": "png",
    "image/jpeg": "jpg",
}


@router.post("/upploadaddreport")
async def add_additionalreport(
    project_id : str =  Form(...),
    report_name : str = Form(...),
    report_description : str = Form(...),
    file : UploadFile = File(...),
    usertok : dict = Depends(parse_token)
):
    
    collection_reports = collections_load("tcAdditionalReports")

    try:

        if usertok["role"] == "bd" :
            return{
                "status" : False,
                "message" : "No permission to perform this action"
        }

        project_path = f"{UPLOAD_DIR}/{project_id}"
        addreport_path = f"{project_path}/ADDITIONALREPORTS"

        os.makedirs(addreport_path, exist_ok= True)

        file_read = await file.read()

        mime_type = magic.from_buffer(file_read, mime=True)
        file_type = MIME_TO_EXT.get(mime_type)

        if not file_type:
            file_type = os.path.splitext(file.filename)[1].lstrip(".").lower() or "unknown"

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_path = f"{addreport_path}/{timestamp}_{file.filename}"

        with open(file_path, 'wb') as f:
            f.write(file_read)
        
        document = {
            "project_id" : project_id.strip(),
            "report_name" : report_name,
            "report_description" : report_description,
            "file_type": file_type,
            "report_path" : file_path,
            "audit" : {
                "name" : usertok["name"],
                "user_id": usertok["user_id"],
                "created_at": datetime.now()
            }
        }

        collection_reports.insert_one(document)

        return{
            "status" : True,
            "message" : "Report added successfully"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Could not fetch reports"
        )



@router.post("/getadditional")
async def get_additional_reports(payload: ProjId, _: dict = Depends(parse_token)):
    try:
        collection = collections_load("tcAdditionalReports")
        docs = list(collection.find({"project_id": payload.project_id}))

        if not docs:
            return {
                "status": False,
                "message": "No additional reports found for this project"
            }

        reports = []
        for doc in docs:
            reports.append({
                "_id": str(doc["_id"]),         
                "report_name": doc.get("report_name"),
                "report_description": doc.get("report_description"),
                "file_type": doc.get("file_type"),   
                "report_path": doc.get("report_path"),
                "audit": doc.get("audit")
            })

        return {
            "status": True,
            "message": "Fetched additional data",
            "payload": reports
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Could not fetch reports")
    

    

@router.post("/deleteadditionalreport")
async def delete_additional_report(payload: DeleetAddReport, usertok: dict = Depends(parse_token)):

    collection = collections_load("tcAdditionalReports")

    try:

        if usertok["role"] == "bd" :
            return{
                "status" : False,
                "message" : "No permission to perform this action"
        }

        result = collection.delete_one({
            "project_id": payload.project_id,
            "_id": ObjectId(payload.report_id)
        })

        if result.deleted_count == 0:
            return {
                "status": False,
                "message": "Report not found or already deleted"
            }

        return {
            "status": True,
            "message": "Report deleted"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500, 
            detail="Could not delete report"
        )
    


@router.get("/reports/download")
async def download_report(path: str, _: dict = Depends(parse_token)):

    try:

        if not os.path.exists(path):
            raise HTTPException(
                status_code=404, 
                detail="File not found"
            )

        filename = os.path.basename(path)

        return FileResponse(
            path=path,
            media_type="application/octet-stream",
            filename=filename
        )

    except HTTPException:
        raise

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500, 
            detail="Could not download file"
        )
    


@router.get("/reports/preview")
async def preview_report(path: str, _: dict = Depends(parse_token)):

    try:
        if not os.path.exists(path):
            raise HTTPException(
                status_code=404, 
                detail="File not found"
            )


        with open(path, "rb") as f:
            header = f.read(2048)

        mime_type = magic.from_buffer(header, mime=True)

        return FileResponse(
            path=path,
            media_type=mime_type
        )

    except HTTPException:
        raise

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500, 
            detail="Could not preview file"
        )
    

@router.post("/deletesh")
async def delete_sh(
    payload: StakeholderPayload,
    usertok: dict = Depends(parse_token)
):

    collections = collections_load("tcProjects")

    try:
        project = collections.find_one(
            {"project_id": payload.project_id},
            {"_id": 0, "audit.user_id": 1}
        )

        if not project:
            return {
                "status": False,
                "message": "Project not found"
            }

        if project.get("audit", {}).get("user_id") != usertok["user_id"]:
            return {
                "status": False,
                "message": "Not allowed, only the project creator can manage stakeholders"
            }

        collections.update_one(
            {"project_id": payload.project_id},
            {
                "$pull": {
                    "project_stakeholders": {
                        "name" : payload.name,
                        "email": payload.email
                    }
                }
            }
        )

        return {
            "status": True,
            "message": "Done"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Could not process your request"
        )

