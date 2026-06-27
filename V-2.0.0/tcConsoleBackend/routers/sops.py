from fastapi import APIRouter, Depends
from sqlalchemy import MetaData, Table, text, select
from fastapi.exceptions import HTTPException
from schemas.schema import SopStart, PipeSopId, SopContent
from utils.jwt_utils import parse_token
import re
from datetime import datetime, timezone
from datetime import datetime
datetime.now(timezone.utc)
from uuid import uuid4
from utils.postgre import insert_postgres_transaction, insert_postgres, update_postgres,  engine


router = APIRouter(prefix="/sops")

@router.post('/startdraft')
async def start_sop_draft(payload: SopStart, usertok: dict = Depends(parse_token)):

    try:
        with engine.connect() as conn:
            exists = conn.execute(
                text("SELECT 1 FROM tcsopmaster WHERE sopname = :name"),
                {"name": payload.sop_id}
            ).fetchone()

            reviewuser =  conn.execute(
                text("SELECT * FROM tcsopusers WHERE useremployeeid = :name"),
                {"name" : payload.sop_reviewer}
            ).fetchone()

        if exists:
            raise HTTPException(status_code=409, detail=f"SOP '{payload.sop_id}' already exists")

        uid  = uuid4()
        vuid = uuid4()

        reviewuser = dict(reviewuser._mapping)

        inserts = [
            {
                "table": "tcsopmaster",
                "values": {
                    "sopmasterid"   : uid,
                    "sopname"       : payload.sop_id,
                    "soptitle"      : payload.sop_title,
                    "sopcategory"   : payload.sop_category,
                    "sopdepartment" : payload.sop_dept,
                    "sopdescription": payload.sop_desc,
                    "createdby"     : usertok["name"],
                    "createdbyid" : usertok["user_id"],
                }
            },
            {
                "table": "tcsopversions",
                "values": {
                    "sopid"         : vuid,
                    "sopmasterid"   : uid,
                    "sopnameversion": f"{payload.sop_id}_V1",
                    "sopversion"    : 1,
                    "sopstatus"     : "DRAFT",
                    "sopcreatedby"  : usertok["name"],
                    "sopupdatedby"  : usertok["name"],
                    "sopcreatedbyid" : usertok["user_id"],
                    "sopupdatedbyid" : usertok["user_id"],
                    "soprevisiongap" : payload.sop_rev_period
                }
            },

            {
                "table": "tcsopreview",
                "values": {
                    "sopid"       : vuid,
                    "reviewer" : reviewuser.get("username"),
                    "reviewerid" : reviewuser.get("useremployeeid"),
                    "reviewtype"  : "SCHEDULED"
                }
            }
        ]

        insert_postgres_transaction(inserts=inserts)

        return {
            "status" : True,
            "message": "New SOP added as draft"
        }

    except HTTPException:
        raise

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500, 
            detail="Failed to create new SOP"
        )
    


@router.get("/pipesopview/{sopid}/{versionname}")
async def pipesopsprint(sopid: str, versionname: str,  _: dict = Depends(parse_token)):
    try:
        meta = MetaData()
        master_tab = Table("tcsopmaster",   meta, autoload_with=engine)
        version_tab = Table("tcsopversions", meta, autoload_with=engine)
        review_tab = Table("tcsopreview",  meta, autoload_with=engine)
        content_tab = Table("tcsopcontent", meta, autoload_with=engine)

        sopname = re.sub(r"_V\d+$", "", versionname)

        with engine.connect() as conn:

            row = conn.execute(select(master_tab).where(master_tab.c.sopname == sopname)).fetchone()
            sop_master_data = dict(row._mapping)

            row = conn.execute(select(version_tab).where(version_tab.c.sopid == sopid)).fetchone()
            if not row:
                return {
                    "status": False, 
                    "message": "SOP version not found"
                }
            sop_version_data = dict(row._mapping)

            row = conn.execute(select(review_tab).where(review_tab.c.sopid == sop_version_data["sopid"])).fetchone()
            sop_review_data = dict(row._mapping)

            row = conn.execute(select(content_tab).where(content_tab.c.sopid == sop_version_data["sopid"])).fetchone()
            sop_content_data = dict(row._mapping) if row else {}

        data = {**sop_master_data, **sop_version_data, **sop_review_data, **sop_content_data}

        return {
            "status": True, 
            "payload": data
        }

    except Exception as e:
        print(f"pipesopview error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    

def insert_content(dbdata : dict, userdata : dict):
    table = "tcsopcontent"
    values = {
        "contentid" : uuid4(),
        "sopid" : dbdata.sop_id,
        "contenthtml" : dbdata.sop_content,
        "contentversion" : 1,
        "createdby" : userdata["user_id"],
        "updatedat" : datetime.now()
    }

    ins = insert_postgres(table=table, values=values) 
    return ins   

def updatesaved_content(dbdata : dict, userdata : dict):

    ins = update_postgres(
        table="tcsopcontent",
        values={
            "contenthtml": dbdata.sop_content,
            "updatedat" : datetime.now()
        },
        condition={
            "contentid": dbdata.sop_contentid
        }
    )

    return ins


@router.post("/savecontent")
def save_content(payload : SopContent, usertok : dict = Depends(parse_token)):

    try:

        purpose = payload.process.lower().strip()

        match purpose:
            case "save":

                if not payload.sop_contentid:
                    ins = insert_content(dbdata = payload, userdata = usertok)

                else: 
                    ins = updatesaved_content(dbdata = payload, userdata = usertok)

                if not ins:
                    return{
                        "status" : False,
                        "message" : "Unable to update content"
                    }
                
                return{
                    "status" : True,
                    "message" : "Contents saved"
                }
            
            case "review":

                with engine.connect() as conn:
                    reviewstatus =  conn.execute(
                        text("SELECT * FROM tcsopreview WHERE sopid = :id"),
                        {"id" : payload.sop_id}
                    ).fetchone()

                if reviewstatus.reviewtype == "TRIGGERED":
                    return{
                        "status" : False,
                        "message" : "Already submitted for review"
                    }

                if not payload.sop_contentid:
                    ins = insert_content(dbdata = payload, userdata = usertok)

                else: 
                    ins = updatesaved_content(dbdata = payload, userdata = usertok)

                if not ins:
                    return{
                        "status" : False,
                        "message" : "Unable to update content"
                    }
                
                ins = update_postgres(
                    table = "tcsopreview",
                    values = {
                        "reviewtype" : "TRIGGERED",
                        "updatedat" : datetime.now()
                    },
                    condition = {
                        "sopid" : payload.sop_id
                    } 
                )

                if not ins:
                    return{
                        "status" : False,
                        "message" : "Unable to sent for review"
                    }

                ins = update_postgres(
                    table = "tcsopversions",
                    values = {
                        "sopstatus" : "UNDER_REVIEW",
                        "sopupdatedby" : usertok["name"],
                        "sopupdatedbyid" : usertok["user_id"],
                        "sopupdatedat" : datetime.now()
                    },
                    condition = {
                        "sopid" : payload.sop_id
                    } 
                )

                if not ins:
                    return{
                        "status" : False,
                        "message" : "Unable to sent for review"
                    }
                
                return{
                    "status" : True,
                    "message" : "Submitted for review"
                }

            case "approve":

                with engine.connect() as conn:
                    reviewstatus =  conn.execute(
                        text("SELECT * FROM tcsopreview WHERE sopid = :id"),
                        {"id" : payload.sop_id}
                    ).fetchone()

                if reviewstatus.reviewoutcome != "APPROVED":
                    return{
                        "status" : False,
                        "message" : "Sop review pending.. PLese submit for review"
                    }

                if not payload.sop_contentid:
                    ins = insert_content(dbdata = payload, userdata = usertok)

                else: 
                    ins = updatesaved_content(dbdata = payload, userdata = usertok)

                if not ins:
                    return{
                        "status" : False,
                        "message" : "Unable to update content"
                    }
                
                ins = update_postgres(
                    table = "tcsopreview",
                    values = {
                        "approvetype" : "TRIGGERED"
                    },
                    condition = {
                        "sopid" : payload.sop_id
                    }
                )

                if not ins:
                    return{
                        "status" : False,
                        "message" : "Unable to sent for review"
                    }
                
                return{
                    "status" : True,
                    "message" : "Unable to sent for approval"
                }

            case _ :

                return{
                    "status" : False,
                    "message" : "Not a valid function"
                }
        

        
    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to touch db"
        )
    

