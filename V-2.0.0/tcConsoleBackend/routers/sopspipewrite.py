from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from sqlalchemy import select, MetaData, Table, text
from utils.jwt_utils import parse_token
from utils.postgre import engine

router = APIRouter(prefix= "/sops")


@router.get("/pipesops")
async def pipe_data(usertok : dict = Depends(parse_token)):
    try:

        query = """
        SELECT 
        v.sopid,
        v.sopstatus,
        v.sopnameversion,
        v.sopcreatedat,
        v.sopversion
        FROM tcsopversions as v
        WHERE v.sopcreatedbyid = :id
        """

        print(f"Token data: {usertok}")  
        print(f"User ID being queried: {usertok.get('user_id')}")  

        with engine.connect() as conn:
            rows = conn.execute(
                text(query),
                {"id": usertok["user_id"]}
            ).fetchall()

        if not rows:
            return{
                "status" : False,
                "Message" : "No data"
            }

        data = {
            "drafts"       : [],
            "under_review" : [],
            "for_approval" : [],
            "for_redraft" : [],
            "for_revision" : [],
            "retired"      : []
        }

        status_map = {
            "DRAFT"        : "drafts",
            "UNDER_REVIEW" : "under_review",
            "FOR_APPROVAL" : "for_approval",
            "RE-DRAFT" : "for_redraft",
            "FOR_REVISION" : "for_revision",
            "RETIRED"      : "retired"
        }

        for row in rows:
            record = dict(row._mapping)
            bucket = status_map.get(record.get("sopstatus"))
            if bucket:
                data[bucket].append(record)

        return {
            "status" : True,
            "message" : "Fetch successfull",
            "payload" : data
        }

    except Exception as e:
        print(f"Failed to fetch pipeline: {e}")
        raise HTTPException(
            status_code=500,
            detail="Failed to fetch SOP pipeline"
        )
    




@router.get("/toreview")
def to_review(usertok: dict = Depends(parse_token)):

    try:

        with engine.connect() as conn:

            rows = conn.execute(
                text(" SELECT * FROM tcsopreview WHERE reviewerid = :id AND reviewtype = :type"),
                {"id": usertok["user_id"], "type": "TRIGGERED"}
            ).fetchall()

            if not rows:
                raise HTTPException(
                    status_code=404,
                    detail="No sops found"
                )

            payload = []

            for row in rows:

                reviewstatus = dict(row._mapping)

                sop_row = conn.execute(
                    text("SELECT * FROM tcsopversions WHERE sopid = :id"),
                    {"id": reviewstatus["sopid"]}
                ).fetchone()

                sop_version = (dict(sop_row._mapping)if sop_row else {})

                payload.append({
                    "review": reviewstatus,
                    "version": sop_version
                })

            print(payload)

        return {
            "status": True,
            "payload": payload
        }

    except Exception as e:
        print(str(e))

        raise HTTPException(
            status_code=500,
            detail="Unable to fetch review data"
        )
    


@router.get("/toapprove")
def to_review(usertok: dict = Depends(parse_token)):

    try:

        if usertok["role"] == "admin":

            with engine.connect() as conn:

                rows = conn.execute(
                    text(" SELECT * FROM tcsopreview WHERE approvetype = :type"),
                    {"type": "TRIGGERED"}
                ).fetchall()

                if not rows:
                    raise HTTPException(
                        status_code=404,
                        detail="No reviews found"
                    )

                payload = []

                for row in rows:

                    reviewstatus = dict(row._mapping)

                    sop_row = conn.execute(
                        text("SELECT * FROM tcsopversions WHERE sopid = :id"),
                        {"id": reviewstatus["sopid"]}
                    ).fetchone()

                    sop_version = (dict(sop_row._mapping)if sop_row else {})

                    payload.append({
                        "review": reviewstatus,
                        "version": sop_version
                    })

                print(payload)

            return {
                "status": True,
                "payload": payload
            }

    except Exception as e:
        print(str(e))

        raise HTTPException(
            status_code=500,
            detail="Unable to fetch review data"
        )
    

@router.get("/sopsusers")
async def get_sopusers(_ : dict = Depends(parse_token)):

    try:
        with engine.connect() as conn:

            query = """
            SELECT 
            u.userid,
            u.useremployeeid,
            u.username 
            FROM tcsopusers as u
            """
            rows = conn.execute(text(query)).fetchall()

            if not rows:
                return{"status" : False, "message" : "No record found"}
            
            return{
                "status" : True,
                "message" : "Users found",
                "payload" : [dict(row._mapping) for row in rows]
            }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to process request"
        )


@router.get("/getsopmetadata/{sopId}")
async def getsop_meta(sopId: str,_: dict = Depends(parse_token)):

    try:
        with engine.connect() as conn:

            print(sopId)

            row = conn.execute(
                text("""
                    SELECT
                    m.sopname,
                    m.soptitle,
                    m.sopdescription,
                    m.sopcategory,
                    m.sopdepartment,
                    v.soprevisiongap,
                    r.reviewer
                    FROM tcsopversions v
                    INNER JOIN tcsopmaster m
                        ON m.sopmasterid = v.sopmasterid
                    LEFT JOIN tcsopreview r
                        ON r.sopid = v.sopid
                    WHERE v.sopid = :sopid
                    """),
                {"sopid": sopId}
            ).fetchone()

            if not row:
                return {
                    "status": False,
                    "message": "SOP not found"
                }

            return {
                "status": True,
                "message": "Metadata found",
                "payload": dict(row._mapping)
            }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Unable to process request"
        )
    
@router.get("/getacknowledgements/{sop_id}")
async def get_acknowledgements(sop_id: str, _: dict = Depends(parse_token)):
    try:
        with engine.connect() as conn:
            rows = conn.execute(
                text("""
                    SELECT 
                    ackid,
                    sopid,
                    userid,
                    username,
                    acknowledgedat,
                    ackmethod,
                    acknowledgecomment
                    FROM tcsopacknowledgement 
                    WHERE sopid = :sop_id 
                    ORDER BY acknowledgedat DESC
                """),
                {"sop_id": sop_id}
            ).fetchall()

        if not rows:
            return {"status": True, "payload": []}

        return {
            "status": True,
            "payload": [dict(row._mapping) for row in rows]
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(status_code=500, detail="Failed to fetch acknowledgements")