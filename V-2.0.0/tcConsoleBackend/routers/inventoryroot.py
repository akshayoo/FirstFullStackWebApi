from fastapi import APIRouter, Depends
from fastapi.exceptions import HTTPException
from schemas.schema import InventoryItems, InventoryVendors
from uuid import uuid4
from utils.jwt_utils import parse_token
from utils.postgre import invntengine
from sqlalchemy import text
from datetime import datetime


router = APIRouter(prefix="/inventory")


@router.post("/additems")
async def add_items(payload: InventoryItems, usertok: dict = Depends(parse_token)):
    try:
        #if not usertok["username"] == "darshan@theracues.com":
            #return {
                #"status": False,
                #"message": "User not allowed"
            #}

        query = """
            INSERT INTO tcitems(
                itemid,
                itemname,
                cataloguenumber,
                description,
                category,
                subcategory,
                unitofmeasure,
                minstockquantity,
                createdby,
                createdbyid,
                createdat
            )
            VALUES(
                :itemid,
                :itemname,
                :catalogue,
                :desc,
                :category,
                :subcategory,
                :unitofmeasure,
                :minstock,
                :createdby,
                :createdbyid,
                :createdat
            )
        """

        with invntengine.connect() as conn:
            conn.execute(text(query), {
                "itemid": uuid4(),
                "itemname": payload.item_name,
                "catalogue": payload.catalogue_num,
                "desc" : payload.description,
                "category": payload.category,
                "subcategory": payload.sub_category,
                "unitofmeasure": payload.unit_of_measure,
                "minstock": payload.min_stock_qty,
                "createdby": usertok["name"],
                "createdbyid": usertok["user_id"],
                "createdat": datetime.now()
            })
            conn.commit()

        return {
            "status": True,
            "message": "New Item Added"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Unable to process request"
        )


@router.post("/addvendors")
async def add_vendors(payload: InventoryVendors, usertok: dict = Depends(parse_token)):
    try:
        #if not usertok["username"] == "dujxcuh@theracues.com":
            #return {
                #"status": False,
                #"message": "User not allowed"
            #}

        query = """
            INSERT INTO tcvendors(
                vendorid,
                vendorname,
                primarycontact,
                primarycontactemail,
                primarycontactphone,
                sourceofsupply,
                currency,
                vendoraddress,
                createdby,
                createdbyid,
                createdat
            )
            VALUES(
                :vendorid,
                :vendorname,
                :primarycontact,
                :primarycontactemail,
                :primarycontactphone,
                :sourceofsupply,
                :currency,
                :vendoraddress,
                :createdby,
                :createdbyid,
                :createdat
            )
        """

        with invntengine.connect() as conn:
            conn.execute(text(query), {
                "vendorid": uuid4(),
                "vendorname": payload.vendor_name,
                "primarycontact": payload.contact_name,
                "primarycontactemail": payload.contact_email,
                "primarycontactphone": payload.contact_phone,
                "sourceofsupply": payload.supply_source,
                "currency": payload.currency,
                "vendoraddress": payload.address,
                "createdby": usertok["name"],
                "createdbyid": usertok["user_id"],
                "createdat": datetime.now()
            })
            conn.commit()

        return {
            "status": True,
            "message": "New Vendor Added"
        }

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail="Unable to process request"
        )