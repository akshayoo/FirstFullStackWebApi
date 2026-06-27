from fastapi import APIRouter, Depends
from sqlalchemy import text
from fastapi.exceptions import HTTPException
from schemas.schema import SopFate
from utils.jwt_utils import parse_token
import re
from datetime import datetime, timezone
from datetime import datetime
datetime.now(timezone.utc)
from dateutil.relativedelta import relativedelta
from uuid import uuid4
from utils.postgre import update_postgres,  engine


router = APIRouter(prefix="/sops")


@router.post("/sopsfate")
def sop_process(payload : SopFate, usertok : dict = Depends(parse_token)):

    try:
        process = payload.process

        match process:
            case "forreview":
                with engine.connect() as conn:

                    row = conn.execute(
                        text("SELECT * FROM tcsopreview WHERE sopid = :id"),
                        {"id" : payload.sop_id}
                    ).fetchone()

                if not row:
                    return {
                        "status": False,
                        "message": "Review record not found"
                    }

                review_sop = dict(row._mapping)

                if review_sop["reviewerid"] != usertok["user_id"]:
                    return{"status" : False, "message" : "Not allowed to perform this action"}
                
                if review_sop["reviewoutcome"] == "APPROVED":
                    return{"status" : False, "message" : "Already reviewed, Bad action"}

                ins = update_postgres(
                    table = "tcsopreview",
                    values = {
                        "reviewtype" : "NOT SCHEDULED",
                        "reviewedby" : usertok["name"],
                        "reviewedbyid" : usertok["user_id"],
                        "reviewedat" : datetime.now(),
                        "reviewcomments" : payload.comments,
                        "reviewoutcome" : "APPROVED",
                        "approvetype" : "TRIGGERED",
                        "updatedat" : datetime.now()
                    },
                    condition={
                        "sopid" : payload.sop_id
                    } 
                )

                if not ins:
                    return{"status" : False, "message" : "Unable to send for review"}
                
                ins = update_postgres(
                    table= "tcsopversions",
                    values= {
                        "sopstatus" : "FOR_APPROVAL",
                        "sopupdatedat" : datetime.now(),
                        "sopupdatedby" : usertok["name"]
                    },
                    condition={
                        "sopid" : payload.sop_id
                    }
                )

                if not ins:
                    return{"status" : False, "message" : "Unable to send for review"}
                
                return{
                    "status" : True,
                    "message" : "SOP Submitted for approval"
                }
            

            case "approve":
                with engine.connect() as conn:
                    row = conn.execute(
                        text("SELECT * FROM tcsopreview WHERE sopid = :id"),
                        {"id" : payload.sop_id}
                    ).fetchone()

                    rowv = conn.execute(
                        text("SELECT * FROM tcsopversions WHERE sopid = :id"),
                        {"id" : payload.sop_id}
                    ).fetchone()

                if not row:
                    return {
                        "status": False,
                        "message": "Review record not found"
                    }
                if not rowv:
                    return {
                        "status": False,
                        "message": "Review record not found"
                    }
                
                review_sop = dict(row._mapping)
                version_sop = dict(rowv._mapping)
                
                if usertok["role"] != "admin":
                    return{"status" : False, "message" : "Not allowed to perform this action"}
                
                if review_sop.get("approveoutcome") == "APPROVED":
                    return {"status": False, "message": "SOP already approved"}

                if review_sop.get("reviewoutcome") != "APPROVED":
                    return {"status": False,"message": "SOP not reviewed yet"}
                
                ins = update_postgres(
                    table = "tcsopreview",
                    values = {
                        "approvetype" : "NOT SCHEDULED",
                        "approver" : usertok["name"],
                        "approverid" : usertok["user_id"],
                        "approvedby" : usertok["name"],
                        "approvedbyid" : usertok["user_id"],
                        "approvedat" : datetime.now(),
                        "approvecomments" : payload.comments,
                        "approveoutcome" : "APPROVED",
                        "updatedat" : datetime.now()
                    },
                    condition={
                        "sopid" : payload.sop_id
                    } 
                )

                if not ins:
                    return{"status" : False, "message" : "Unable approve"}
                
                ins = update_postgres(
                    table= "tcsopversions",
                    values= {
                        "sopstatus" : "APPROVED",
                        "sopupdatedat" : datetime.now(),
                        "sopupdatedby" : usertok["name"],
                        "sopchangesummary" : "SOP is approved and active",
                        "sopeffectivedate" : datetime.now(),
                        "soprevisiondate" : datetime.now() + relativedelta(months= int(version_sop["soprevisiongap"]))
                    },
                    condition={
                        "sopid" : payload.sop_id
                    }
                )
                
                if not ins:
                    return{"status" : False, "message" : "Unable to approve"}
                
                return{
                    "status" : True,
                    "message" : "SOP Approved"
                }
            

            case "reedit":

                with engine.connect() as conn:
                    row = conn.execute(
                        text("SELECT * FROM tcsopreview WHERE sopid = :id"),{"id": payload.sop_id}).fetchone()

                if not row:return {"status": False, "message": "Review record not found"}

                review_sop = dict(row._mapping)

                if review_sop.get("approveoutcome") == "APPROVED":
                    return {"status": False, "message": "SOP already approved, cannot send for re-edit"}

#########################################################################################################
                if review_sop.get("reviewoutcome") != "APPROVED":

                    if usertok["user_id"] != review_sop.get("reviewerid"):
                        return {"status": False, "message": "Not allowed to perform this action"}
                    
                    ins = update_postgres(
                        table="tcsopreview",
                        values={
                            "reviewoutcome": "REJECTED",
                            "reviewcomments": payload.comments,
                            "reviewtype": "NOT SCHEDULED",
                            "reviewedat": datetime.now(),
                            "reviewedby" : usertok["name"],
                            "reviewedbyid" : usertok["user_id"],
                            "updatedat": datetime.now(),
                            "approveoutcome": "NOT SCHEDULED",
                            "approver": None,
                            "approverid": None,
                            "approvecomments": None,
                            "approvetype": "NOT SCHEDULED",
                        },
                        condition={
                            "sopid": payload.sop_id
                        }
                    )

                    if not ins:
                        return {"status": False, "message": "Unable to send for re-edit"}

                    ins = update_postgres(
                        table="tcsopversions",
                        values={
                            "sopstatus": "RE-DRAFT",
                            "sopupdatedat": datetime.now(),
                            "sopupdatedby": usertok["name"],
                            "sopchangesummary": "SOP sent back for redrafting"
                        },
                        condition={
                            "sopid": payload.sop_id
                        }
                    )

                    if not ins:
                        return {"status": False, "message": "Unable to update SOP status"}

                    return {
                        "status": True,
                        "message": "SOP sent for re-edit"
                    }
                
#########################################################################################################
                if review_sop.get("reviewoutcome") == "APPROVED":

                    if review_sop.get("reviewoutcome") != "APPROVED":
                        return {"status": False, "message": "SOP not reviewed yet"}

                    if usertok["role"] != "admin":
                        return {"status": False, "message": "Not allowed to perform this action"}
                    
                    ins = update_postgres(
                        table="tcsopreview",
                        values={
                            "approveoutcome": "REJECTED",
                            "approver": usertok["name"],
                            "approverid": usertok["user_id"],
                            "approvecomments": payload.comments,
                            "approvetype": "NOT SCHEDULED",
                            "updatedat": datetime.now(),
                            "reviewoutcome": None,
                            "reviewedby" : None,
                            "reviewtype" : "NOT SCHEDULED",
                            "reviewedat" : None,
                            "reviewcomments" : None,
                        },
                        condition={
                            "sopid": payload.sop_id
                        }
                    )

                    if not ins:
                        return {"status": False, "message": "Unable to send for re-edit"}

                    ins = update_postgres(
                        table="tcsopversions",
                        values={
                            "sopstatus": "RE-DRAFT",
                            "sopupdatedat": datetime.now(),
                            "sopupdatedby": usertok["name"],
                            "sopchangesummary": "SOP sent back for revision"
                        },
                        condition={
                            "sopid": payload.sop_id
                        }
                    )

                    if not ins:
                        return {"status": False, "message": "Unable to update SOP status"}

                    return {
                        "status": True,
                        "message": "SOP sent for re-edit"
                    }
            case "cancel":
                pass

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to process request"
        )
    



@router.get("/sopspopulate")
def sops_populate(_: dict = Depends(parse_token)):
    try:

        query = """
            SELECT
                v.sopid,
                v.sopnameversion,
                v.sopcreatedby,
                v.sopeffectivedate,
                v.soprevisiondate,
                v.sopstatus,
                m.sopmasterid,
                m.sopname,
                m.sopdepartment,
                m.sopcategory,
                r.reviewer,
                r.approver
            FROM tcsopversions v
            LEFT JOIN tcsopmaster m
                ON v.sopmasterid = m.sopmasterid
            LEFT JOIN tcsopreview r
                ON v.sopid = r.sopid;
            """

        with engine.connect() as conn:
            rows = conn.execute(text(query)).fetchall()

        if not rows:
            return {
                "status": False,
                "message": "No SOPs found"
            }

        payload = [dict(row._mapping) for row in rows]

        print(payload)

        return {
            "status": True,
            "message": "Fetch successful",
            "payload": payload
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Cannot process your request"
        )
    

@router.get("/fetchsop/{sopid}")
def sops_populate(sopid : str, _: dict = Depends(parse_token)):
    try:

        query = """
        SELECT
            v.*,
            m.*,
            r.*,
            c.*

        FROM tcsopversions v

        LEFT JOIN tcsopmaster m
            ON v.sopmasterid = m.sopmasterid

        LEFT JOIN tcsopreview r
            ON v.sopid = r.sopid

        LEFT JOIN tcsopcontent c
            ON v.sopid = c.sopid

        WHERE v.sopid = :sopid
        """

        with engine.connect() as conn:
            row = conn.execute(
                text(query),
                {"sopid": sopid}).fetchone()

        if not row:
            return {
                "status": False,
                "message": "No SOPs found"
            }

        payload = dict(row._mapping)

        return {
            "status": True,
            "message": "Fetch successful",
            "payload": payload
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Cannot process your request"
        )