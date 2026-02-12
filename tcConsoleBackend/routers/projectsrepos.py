from fastapi import APIRouter, Response
from pymongo import MongoClient
from pydantic import BaseModel
from utils.dbfunc import qc_temp_bytes, lib_qc_bytes
from schemas.schema import ProjId, EmailCont
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
import os
import tempfile
from dotenv import load_dotenv

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

router = APIRouter(prefix= "/reports")



@router.post("/genqcreportpdf")
async def gen_qcreport(payload : ProjId):
    
    project_id = payload.project_id.strip()

    qc_bytes = qc_temp_bytes(project_id= project_id)

    return Response(
        content=qc_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=qc_report_{project_id}.pdf"}
    )
    



@router.post("/genlibqcreportpdf")
async def lib_qcgen(payload : ProjId):

    project_id = payload.project_id

    libqc_bytes = lib_qc_bytes(project_id= project_id)

    return Response(
        content= libqc_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=libqc_report_{project_id}.pdf"}
    )



@router.post("/samplesubreportpdf")
async def samsub_gen(payload : ProjId):

    collections = db["tcProjects"]

    project_id = payload.project_id

    data = collections.find_one({"project_id" : project_id},
                                {
                                    "_id" : 0,
                                    "project_info" : 1,
                                    "service_info" : 1,
                                    "sample_submission" : 1
                                })
    
    project_info = data.get("project_info", {})
    service_info= data.get("service_info", {})
    ss_info = data.get("sample_submission", {})


    name = project_info.get("pi_name")
    institution = project_info.get("institution")
    lab_dept = project_info.get("lab_dept")
    email = project_info.get("email")
    phone = project_info.get("phone")

    service_name = service_info.get("service_name")
    sample_type = service_info.get("sample_type")
    application = data.get("sample_submission").get("details").get("application")
    sample_number = service_info.get("sample_number")
    extraction_needed = service_info.get("extraction_needed").upper()
    replicates = "YES" if ss_info.get("replicates") == True else "NO"
    bin_req  = "YES" if ss_info.get("bioinformatics_required") == True else "NO"


    sample_sub_details = ss_info.get("details").get("sample_details", [])

    env = Environment(loader= FileSystemLoader("../templates"))
    template = env.get_template("samsubtemplate.html")

    html_content = template.render(
        project_id = project_id,
        name = name,
        institution = institution,
        lab_dept = lab_dept,
        email = email,
        phone = phone,

        service_name = service_name,
        sample_type = sample_type,
        application = application,
        sample_number = sample_number,
        extraction_needed = extraction_needed,
        replicates = replicates,
        bin_req = bin_req,

        sample_sub_details = sample_sub_details

    )

    samsub_bytes = HTML(string= html_content).write_pdf()

    return Response(
        content= samsub_bytes,
        media_type= "application/pdf",
        headers={"Content-Disposition": f"attachment; filename=libqc_report_{project_id}.pdf"}
    )




@round.post("/sendemail")
async def send_mail(payload: EmailCont):
    print(payload)
    
    project_id = payload.project_id
    section = payload.section.strip()
    subject = payload.mail_subject
    content = payload.mail_content
    
    temp_file_path = None

    try: 
        collections = db["tcProjects"]

        data = collections.find_one(
            {"project_id": project_id},
            {
                "_id": 0, 
                "project_info.email": 1
            }
        )
        
        
        to_email = data.get("project_info").get("email")
        
        to = [to_email]
        
        if payload.email_cc:
            cc_mails = [payload.email_cc]
        else:
            cc_mails = []

        if section == "qc":

            header = "theraCUES QC Report"
            filename = f"{project_id}_QC_Report.pdf"
            pdf_bytes = qc_temp_bytes(project_id=project_id)
            
        elif section == "library":

            header = "theraCUES Library QC Report"
            filename = f"{project_id}_Library_QC_Report.pdf"
            pdf_bytes = lib_qc_bytes(project_id=project_id)


        env = Environment(loader=FileSystemLoader("../templates"), autoescape=True)
        template = env.get_template("reportsmailtemplate.html")

        mail_html = template.render(
            header=header,
            mail_body=content
        )
        
        with tempfile.NamedTemporaryFile(mode='wb', delete=False, suffix='.pdf') as temp_file:
            temp_file.write(pdf_bytes)
            temp_file_path = temp_file.name

        message = MessageSchema(
            subject=subject,
            recipients=to,
            cc=cc_mails,
            body=mail_html,
            subtype="html",
            attachments=[
                {
                    'file': temp_file_path,      
                    'filename': filename  
                }
            ]
        )

        fastmail = FastMail(conf)
        
        await fastmail.send_message(message)
        
        return {"status": "Mail sent successfully"} 
    
    except Exception as e:
        return {"status": "Mail not sent: Contact admin"} 
    
    finally:
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.unlink(temp_file_path)
            except Exception as e:
                pass