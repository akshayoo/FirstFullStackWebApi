from fastapi import APIRouter, Depends, Body, Response
from sqlalchemy import text
from fastapi.exceptions import HTTPException
from schemas.schema import PipeSopDel, PipeChangeOwner, SopEdit, SopDwnld, SopShare, SopAck, SopExtend
from utils.jwt_utils import parse_token
from utils.dbfunc import sop_print
from datetime import datetime, timezone
from fastapi import BackgroundTasks
from jinja2 import Environment, FileSystemLoader
from utils.postgre import insert_postgres, update_postgres
import tempfile
from utils.confgmail import email_config
from datetime import datetime
datetime.now(timezone.utc)
from utils.postgre import engine
from dateutil.relativedelta import relativedelta


router = APIRouter(prefix="/sops")


@router.delete("/deletesop")
async def delete_sop(payload: PipeSopDel = Body(...),
                     usertok: dict = Depends(parse_token)):

    try:
        print(payload)
        with engine.begin() as conn:

            row = conn.execute(
                text("SELECT * FROM tcsopversions WHERE sopid = :id"),
                {"id": payload.sop_uid}
            ).fetchone()

            if not row:
                return {"status": False, "message": "SOP not found"}

            sop_version = dict(row._mapping)

            if sop_version["sopcreatedbyid"] != usertok["user_id"]:
                return {"status": False, "message": "Not authorized to perform this action"}

            conn.execute(
                text("DELETE FROM tcsopcontent WHERE sopid = :id"),
                {"id": payload.sop_uid}
            )

            conn.execute(
                text("DELETE FROM tcsopreview WHERE sopid = :id"),
                {"id": payload.sop_uid}
            )

            conn.execute(
                text("DELETE FROM tcsopversions WHERE sopid = :id"),
                {"id": payload.sop_uid}
            )

            if payload.sop_ver <= 1:
                conn.execute(
                    text(
                        "DELETE FROM tcsopmaster "
                        "WHERE sopmasterid = :masterid"
                    ),
                    {"masterid": sop_version["sopmasterid"]}
                )

            return {
                "status": True,
                "message": "Record deleted"
            }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Unable to process request"
        )
    



@router.post("/changeowner")
async def change_owner(payload: PipeChangeOwner, usertok: dict = Depends(parse_token)):
    try:
        with engine.begin() as conn:

            row = conn.execute(
                text("""
                    SELECT *
                    FROM tcsopversions
                    WHERE sopid = :sop_id
                """),
                {"sop_id": payload.sop_id}
            ).fetchone()

            if not row:
                return {"status": False, "message": "SOP not found"}

            sop_version = dict(row._mapping)

            if sop_version["sopcreatedbyid"] != usertok["user_id"]:
                return {"status": False, "message": "Not authorized to perform this action"}
            
            userrow = conn.execute(
                text("""
                    SELECT username
                    FROM tcsopusers
                    WHERE useremployeeid = :id
                """),
                {"id": payload.sop_new_owner}
            ).fetchone()

            if not userrow:
                return {"status": False, "message": "User not found"}
            
            user_dict = dict(userrow._mapping)

            conn.execute(
                text("""
                    UPDATE tcsopversions
                    SET
                    sopcreatedbyid = :new_owner_id,
                    sopcreatedby = :new_owner,
                    sopcreatedat = :updated_at
                    WHERE sopid = :sop_id
                     """),
                {
                    "new_owner_id": payload.sop_new_owner,
                    "new_owner" : user_dict.get("username"),
                    "updated_at": datetime.now(),
                    "sop_id": payload.sop_id
                }
            )

            return {
                "status": True,
                "message": "SOP Ownership Transferred"
            }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Unable to process request"
        )


@router.post("/editsopmeta")
async def edit_sop_meta(payload: SopEdit, usertok: dict = Depends(parse_token)):

    print(payload)

    try:
        with engine.begin() as conn:

            row = conn.execute(
                text("""
                    SELECT *
                    FROM tcsopversions
                    WHERE sopid = :sop_uid
                """),
                {"sop_uid": payload.sop_uid}
            ).fetchone()

            if not row:
                return{"status" : False, "message" : "No SOP Found"}
            
            sop_version = dict(row._mapping)

            print(payload.sop_reviewer)

            row = conn.execute(
                text("""
                    SELECT *
                    FROM tcsopusers
                    WHERE useremployeeid = :id
                """),
                {"id": payload.sop_reviewer}
            ).fetchone()

            if not row:
                return{"status" : False, "message" : "No Reviewer Found"}
            
            user_info = dict(row._mapping)

            if sop_version.get("sopcreatedbyid") != usertok["user_id"]:
                return{"status" : False, "message" : "Not authorized to perform this action"}

            conn.execute(
                text("""
                    UPDATE tcsopmaster
                    SET
                    soptitle = :title,
                    sopdescription = :desc,
                    sopcategory = :category,
                    sopdepartment = :dept
                    WHERE sopmasterid = :sop_masterid
                """),
                {
                    "title": payload.sop_title,
                    "desc": payload.sop_desc,
                    "category": payload.sop_category,
                    "dept": payload.sop_dept,
                    "sop_masterid": sop_version.get("sopmasterid")
                }
            )

            conn.execute(
                text("""
                    UPDATE tcsopversions
                    SET
                    sopupdatedat = :upat,
                    sopupdatedby = :upby,
                    sopupdatedbyid = :upid,
                    soprevisiongap = :rev_gap
                    WHERE sopid = :sopid
                """),
                {
                    "upat" : datetime.now(),
                    "upby" : usertok["name"],
                    "upid" : usertok["user_id"],
                    "rev_gap": payload.sop_rev_period,
                    "sopid": payload.sop_uid
                }
            )

            conn.execute(
                text("""
                    UPDATE tcsopreview
                    SET reviewerid = :reviewerid,
                    reviewer = :reviewer,
                    updatedat = :updatedat
                    WHERE sopid = :sopid
                """),
                {
                    "reviewerid": payload.sop_reviewer,
                    "reviewer" : user_info.get("username"),
                    "updatedat" : datetime.now(),
                    "sopid": payload.sop_uid
                }
            )

            return {
                "status": True,
                "message": "SOP metadata updated"
            }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Unable to process request"
        )
    

@router.post("/downloadsop")
async def download_sop(payload : SopDwnld, _ : dict = Depends(parse_token)):

    try:
        sop_bytes = sop_print(sop_id= payload.sop_id)

        return Response(
            content= sop_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=sop_{payload.sop_id}.pdf"}
        )
    
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail="Unable to generate report"
        )


@router.post("/sharesop")
async def sharesop(payload: SopShare, background_tasks: BackgroundTasks, usertok: dict = Depends(parse_token)):
    try:

        header = "SOP's theraCUES"
        filename = f"{payload.sop_id}_SOP.pdf"
        sop_bytes = sop_print(sop_id=payload.sop_id)

        env = Environment(loader=FileSystemLoader("./templates"), autoescape=True)
        template = env.get_template("sopmail_template.html")

        mail_html = template.render(
            header= header,
        )

        with tempfile.NamedTemporaryFile(mode='wb', delete=False, suffix='.pdf') as temp_file:
            temp_file.write(sop_bytes)
            temp_file_path = temp_file.name

        background_tasks.add_task(
            email_config,
            subject="theraCUES Standard Operating Procedure",
            cc_mail=[],
            to_mail=[payload.share_email],
            mail_html=mail_html,
            attachments=[{
                "file": temp_file_path,
                "filename": filename
            }]
        )

        return {
            "status": True, 
            "message": "SOP shared"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500, 
            detail="Unable to share SOP"
        )


@router.post("/acknowledgesop")
async def acknowledge_sop(payload: SopAck, usertok: dict = Depends(parse_token)):
    try:

        with engine.connect() as conn:
            existing = conn.execute(
                text("SELECT ackid FROM tcsopacknowledgement WHERE sopid = :sop_id AND userid = :user_id"),
                {"sop_id": payload.sop_id, "user_id": usertok["user_id"]}
            ).fetchone()

        if existing:
            return {"status": False, "message": "You have already acknowledged this SOP"}

        ins = insert_postgres(
            table="tcsopacknowledgement",
            values={
                "sopid":          payload.sop_id,
                "userid":         usertok["user_id"],
                "username":       usertok["name"],
                "acknowledgedat": datetime.now(),
                "acknowledgecomment" : payload.acknowledge_comm,
                "ackmethod":      "MANUAL"
            }
        )

        if not ins:
            return {"status": False, "message": "Failed to save acknowledgement"}

        return {"status": True, "message": "SOP acknowledged successfully"}

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Failed to acknowledge SOP")
    



@router.post("/extendsop")
async def extend_sop(payload: SopExtend, usertok: dict = Depends(parse_token)):
    try:

        if usertok["role"] != "admin":
            return {"status": False, "message": "Not allowed to perform this action"}

        with engine.connect() as conn:
            row = conn.execute(
                text("SELECT * FROM tcsopversions WHERE sopid = :sop_id"),
                {"sop_id": payload.sop_id}
            ).fetchone()

        if not row:
            return {"status": False, "message": "SOP not found"}

        sop = dict(row._mapping)

        if sop["sopstatus"] != "FOR_REVISION":
            return {"status": False, "message": "SOP is not in revision state"}

        new_revision_date = datetime.now() + relativedelta(months=payload.extend_period)

        ins = update_postgres(
            table="tcsopversions",
            values={
                "sopstatus": "APPROVED",
                "soprevisiondate": new_revision_date,
                "soprevisiongap": payload.extend_period,
                "sopupdatedat": datetime.now(),
                "sopupdatedby": usertok["name"],
                "sopupdatedbyid" : usertok["user_id"],
                "sopchangesummary": f"SOP revision period extended by {payload.extend_period} months"
            },
            condition={"sopid": payload.sop_id}
        )

        if not ins:
            return {"status": False, "message": "Failed to extend SOP"}

        return {
            "status": True,
            "message": f"SOP extended by {payload.extend_period} months"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Failed to extend SOP")
    


@router.post("/retiresop")
async def retire_sop(payload: SopDwnld, usertok: dict = Depends(parse_token)):
    try:

        if usertok["role"] != "admin":
            return {"status": False, "message": "Not allowed to perform this action"}

        with engine.connect() as conn:
            row = conn.execute(
                text("SELECT sopmasterid FROM tcsopversions WHERE sopid = :sop_id"),
                {"sop_id": payload.sop_id}
            ).fetchone()

        if not row:
            return {"status": False, "message": "SOP not found"}

        sop = dict(row._mapping)

        ins = update_postgres(
            table="tcsopversions",
            values={
                "sopstatus":        "RETIRED",
                "sopupdatedat":     datetime.now(),
                "sopupdatedby":     usertok["name"],
                "sopchangesummary": "SOP class retired"
            },
            condition={"sopmasterid": sop["sopmasterid"]}
        )

        if not ins:
            return {"status": False, "message": "Failed to retire SOP"}

        return {
            "status": True,
            "message": "SOP and all its versions have been retired"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Failed to retire SOP")