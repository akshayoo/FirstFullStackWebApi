from fastapi import FastAPI
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from fastapi.exceptions import HTTPException
from dotenv import load_dotenv
from typing import List
import os
from datetime import datetime


CLIENT = MongoClient("mongodb://localhost:27017")
db = CLIENT.tcDB

load_dotenv()

GMAIL_AUTH = os.getenv("GMAIL_AUTH")
MAIL_USER = os.getenv("MAIL_USER")

conf = ConnectionConfig(
    MAIL_USERNAME=MAIL_USER,
    MAIL_PASSWORD=GMAIL_AUTH,
    MAIL_FROM=MAIL_USER,
    MAIL_PORT=587,
    MAIL_SERVER="smtp.zoho.com",
    MAIL_STARTTLS=True,   
    MAIL_SSL_TLS=False, 
    USE_CREDENTIALS=True
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"],
    allow_credentials = True
)


@app.get("/ssub/projdet/fillinfo")
async def prilim_info():

    collection = db['tcStdDeliverables']

    categories = collection.find({}, {"category": 1, "_id": 0})

    category_services = {}  

    for cat in categories:
        category = cat["category"]

        items = collection.find(
            {"category": category},
            {"services.service_name" : 1,
             "_id" : 0,
             "services.applications": 1,
             "services.supported_sample_types" : 1,
             "services.instrumentation" : 1,
             "services.process_map" : 1,
             "services.standard_deliverables" : 1
                                                   }
        )

        service_list = []

        for doc in items:

            for service in doc.get("services", []):
                service_name = service.get("service_name")
                application = service.get("applications")
                supported_sample_types = service.get("supported_sample_types")
                instrumentation = service.get("instrumentation")
                process_map = service.get("process_map")
                standard_deliverables = service.get("standard_deliverables")

                serv = {
                    "service_name" : service_name,
                    "applications" : application,
                    "supported_sample_types" : supported_sample_types,
                    "instrumentation" : instrumentation,
                    "process_map" : process_map,
                    "standard_deliverables" : standard_deliverables
                }

                service_list.append(serv)

        category_services[category] = service_list
    
    return category_services


class ProjectSubmission(BaseModel):
    project_id: str
    pi_name: str
    email: EmailStr
    phone: str
    institution: str
    labdept: str
    offering_type: str
    service_name: str
    sam_number: int
    duplicates: str
    extraction: str
    sample_type: str
    platform: str
    standard_deliverables: List
    added_deliverables: List

@app.post("/ssub/projdet/submit")
async def form_fetch_mail(payload: ProjectSubmission):

    collection = db['tcProjects']

    std_del_list = []
    added_del_list = []

    for std_deliverables in payload.standard_deliverables:
        std_dict = {
            "label" : std_deliverables,
            "completed" : False,
            "completed_at" : None
        }
        std_del_list.append(std_dict)
    
    for added_deliverables in payload.added_deliverables:
        add_dict = {
            "label" : added_deliverables,
            "completed" : False,
            "completed_at" : None
        }
        added_del_list.append(add_dict)


    document = {
        "project_id": payload.project_id,
        "project_info": {
            "pi_name": payload.pi_name,
            "email": payload.email,
            "phone" : payload.phone,
            "institution": payload.institution,
            "lab_dept": payload.labdept,
        },
        "service_info": {
            "offering_type": payload.offering_type,
            "service_name": payload.service_name,
            "platform": payload.platform,
            "sample_type": payload.sample_type,
            "sample_number": payload.sam_number,
            "replicates_present": payload.duplicates,
            "extraction_needed": payload.extraction,
        },
        "project_details": {
            "standard_deliverables": std_del_list ,
            "added_deliverables": added_del_list,
        },
        "audit": {
            "created_at": datetime.now()
        }
    }

    try:
        collection.insert_one(document)

        template = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:Arial, Helvetica, sans-serif;">

            <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px;">
                <tr>
                    <td align="center">

                        <table width="600" cellpadding="0" cellspacing="0"
                            style="background:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                            <!-- Header -->
                            <tr>
                                <td style="padding:20px 30px; background:#1f2937; color:#ffffff; border-radius:8px 8px 0 0;">
                                    <h2 style="margin:0; font-size:20px;">Project Created Successfully</h2>
                                    <p style="margin:5px 0 0; font-size:13px; color:#cbd5e1;">
                                        Project ID: <strong>{payload.project_id}</strong>
                                    </p>
                                </td>
                            </tr>

                            <!-- Body -->
                            <tr>
                                <td style="padding:30px; color:#111827; font-size:14px; line-height:1.6;">
                                    <p>
                                        Hi <strong>{payload.pi_name}</strong>,
                                    </p>

                                    <p>
                                        Thank you for submitting your project. Below are the details of your submission:
                                    </p>

                                    <!-- Details Table -->
                                    <table width="100%" cellpadding="8" cellspacing="0"
                                        style="border-collapse:collapse; margin-top:15px; font-size:13px;">

                                        <tr style="background:#f9fafb;">
                                            <td style="border:1px solid #e5e7eb;"><strong>Offering Type</strong></td>
                                            <td style="border:1px solid #e5e7eb;">{payload.offering_type}</td>
                                        </tr>

                                        <tr>
                                            <td style="border:1px solid #e5e7eb;"><strong>Service Name</strong></td>
                                            <td style="border:1px solid #e5e7eb;">{payload.service_name}</td>
                                        </tr>

                                        <tr style="background:#f9fafb;">
                                            <td style="border:1px solid #e5e7eb;"><strong>Platform</strong></td>
                                            <td style="border:1px solid #e5e7eb;">{payload.platform}</td>
                                        </tr>

                                        <tr>
                                            <td style="border:1px solid #e5e7eb;"><strong>Sample Type</strong></td>
                                            <td style="border:1px solid #e5e7eb;">{payload.sample_type}</td>
                                        </tr>

                                        <tr style="background:#f9fafb;">
                                            <td style="border:1px solid #e5e7eb;"><strong>Number of Samples</strong></td>
                                            <td style="border:1px solid #e5e7eb;">{payload.sam_number}</td>
                                        </tr>

                                        <tr>
                                            <td style="border:1px solid #e5e7eb;"><strong>Duplicates Present</strong></td>
                                            <td style="border:1px solid #e5e7eb;">{payload.duplicates}</td>
                                        </tr>

                                        <tr style="background:#f9fafb;">
                                            <td style="border:1px solid #e5e7eb;"><strong>Extraction Needed</strong></td>
                                            <td style="border:1px solid #e5e7eb;">{payload.extraction}</td>
                                        </tr>


                                    </table>

                                    <!-- Description -->
                                    <p style="margin-top:20px;">
                                        <strong>Project Description:</strong>
                                    </p>

                                    <div style="
                                        background:#f9fafb;
                                        border:1px solid #e5e7eb;
                                        padding:12px;
                                        border-radius:6px;
                                        white-space:pre-wrap;
                                        font-size:13px;
                                    ">
                                        {payload.standard_deliverables}
                                    </div>
                                    <div style="
                                        background:#f9fafb;
                                        border:1px solid #e5e7eb;
                                        padding:12px;
                                        border-radius:6px;
                                        white-space:pre-wrap;
                                        font-size:13px;
                                    ">
                                        {payload.added_deliverables}
                                    </div>

                                    <p>
                                        Best regards,<br>
                                        <strong>Theracues Project Team</strong>
                                    </p>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td style="padding:15px 30px; background:#f3f4f6; font-size:12px; color:#6b7280; text-align:center; border-radius:0 0 8px 8px;">
                                    This is an automated email. Please do not reply.
                                </td>
                            </tr>

                        </table>

                    </td>
                </tr>
            </table>

        </body>
        </html>
        """

        message = MessageSchema(
            subject="Project Created Successfully",
            recipients=[payload.email],
            cc=["itsmeakshay8055@theracues.com"],
            body=template,
            subtype="html",
        )

        fm = FastMail(conf)

        try:
            await fm.send_message(message)
        except Exception as mail_error:
            print("Email failed:", mail_error)

        return {
            "project_id": payload.project_id,
            "status": "success"
        }

    except Exception as e:
        print("DB Error:", e)
        raise HTTPException(
            status_code=500,
            detail="Project submission failed"
        )

