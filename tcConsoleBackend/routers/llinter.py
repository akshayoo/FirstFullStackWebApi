from fastapi import APIRouter, HTTPException, Depends
from utils.llmcall import ModelLoad
from utils.jwt_utils import parse_token
from utils.dbfunc import collections_load


router = APIRouter(prefix= "/cuesai")

@router.post("/interaction")
async def interaction(usertok : dict = Depends(parse_token)):

    try:
        pass

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Internal server error"
        )




@router.get("/history")
async def interaction(usertok : dict = Depends(parse_token)):

    try:
        pass

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Unable to load message"
        )