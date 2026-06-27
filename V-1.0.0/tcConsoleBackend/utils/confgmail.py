from fastapi_mail import ConnectionConfig, FastMail, MessageSchema
from fastapi import HTTPException
from dotenv import load_dotenv
import os
from typing import List

load_dotenv()

async def email_config(
        subject : str,
        to_mail : List[str],
        cc_mail : List[str],
        mail_html : str,
        attachments = None
):

    ZOHO_AUTH = os.getenv("ZOHO_AUTH")
    MAIL_USER = os.getenv("MAIL_USER")

    config = ConnectionConfig(
        MAIL_USERNAME=MAIL_USER,
        MAIL_PASSWORD=ZOHO_AUTH,
        MAIL_FROM=MAIL_USER,
        MAIL_PORT=587,
        MAIL_SERVER="smtp.zoho.com",
        MAIL_STARTTLS=True,   
        MAIL_SSL_TLS=False, 
        USE_CREDENTIALS=True
    )

    message = MessageSchema(
        subject=subject,
        recipients= to_mail,
        cc= cc_mail,
        body=mail_html,
        subtype="html",
        attachments= attachments or []
    )

    fastmail = FastMail(config)

    try: await fastmail.send_message(message); return  "Mail sent successfully"
    except Exception as e : 
        print(str(e))
        raise HTTPException(
            status_code= 500,
            detail= "Mail sending failed"
        )