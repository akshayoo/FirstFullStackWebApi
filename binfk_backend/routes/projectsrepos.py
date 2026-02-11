from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from jinja2 import Environment, FileSystemLoader
from weasyprint import HTML
from datetime import date

CLIENT = MongoClient("mongodb://localhost:27017")
db = CLIENT.tcDB

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_methods = ["*"],
    allow_headers = ["*"],
    allow_credentials = True
)

class projectId(BaseModel):
    project_id : str

@app.post("/reports/genqcreportpdf")
async def gen_qcreport(payload : projectId):

    collections = db["tcProjects"]
    
    project_id = payload.project_id.strip()

    data = collections.find_one({"project_id" : project_id },
                                {
                                    "_id" : 0,
                                    "project_info" : 1,
                                    "service_info" : 1,
                                    "qc" : 1,
                                    "sample_submission.service_technology" : 1,
                                    "sample_submission.details.application" : 1
                                })

    project_info = data.get("project_info", {})
    service_info= data.get("service_info", {})
    qc_info  = data.get("qc", {})


    name = project_info.get("pi_name")
    institution = project_info.get("institution")
    lab_dept = project_info.get("lab_dept")
    report_date = date.today().strftime("%B %d, %Y")

    service_name = service_info.get("service_name")
    sample_type = service_info.get("sample_type")
    application = data.get("sample_submission").get("application")
    platform_conc = qc_info.get("concentration_technology")
    platform_int = qc_info.get("integrity_technology")
    extraction_needed = service_info.get("extraction_needed").upper()
    sample_number = service_info.get("sample_number")
    qc_summary = qc_info.get("qc_summary")
    qc_same_details = qc_info.get("qc_sample_details",[])

    env = Environment(loader=FileSystemLoader('../templates'))
    template = env.get_template('qctemplate.html')

    html_content = template.render(
        project_id=project_id,
        name = name,
        institution = institution,
        lab_dept = lab_dept,
        date = report_date,
        service_name = service_name,
        sample_type = sample_type,
        application = application,
        platform_conc = platform_conc,
        platform_int = platform_int,
        extraction_needed = extraction_needed,
        sample_number = sample_number,
        qc_same_details = qc_same_details,
        qc_summary = qc_summary
    )

    qc_bytes = HTML(string=html_content).write_pdf()

    return Response(
        content=qc_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=qc_report_{project_id}.pdf"}
    )
    



@app.post("/reports/genlibqcreportpdf")
async def lib_qcgen(payload : projectId):

    collections = db["tcProjects"]

    project_id = payload.project_id

    data = collections.find_one({"project_id" : project_id},
                                {
                                    "_id" : 0,
                                    "project_info" : 1,
                                    "service_info" : 1,
                                    "qc" : 1,
                                    "library" : 1,
                                    "sample_submission.service_technology" : 1,
                                    "sample_submission.details.application" : 1
                                })
    
    project_info = data.get("project_info", {})
    service_info= data.get("service_info", {})
    qc_info = data.get("qc", {})
    libqc_info  = data.get("library", {})

    name = project_info.get("pi_name")
    institution = project_info.get("institution")
    lab_dept = project_info.get("lab_dept")
    report_date = date.today().strftime("%B %d, %Y")

    service_name = service_info.get("service_name")
    sample_type = service_info.get("sample_type")
    application = data.get("sample_submission").get("application")
    platform_conc = qc_info.get("concentration_technology")
    platform_int = qc_info.get("integrity_technology")
    extraction_needed = service_info.get("extraction_needed").upper()
    sample_number = service_info.get("sample_number")
    libqc_summary = libqc_info.get("library_summary")
    libqc_same_details = libqc_info.get("qc_sample_details",[])

    evv = Environment(loader= FileSystemLoader("../templates"))
    template = evv.get_template("librqctemplate.html")

    html_content = template.render(
        project_id=project_id,
        name = name,
        institution = institution,
        lab_dept = lab_dept,
        date = report_date,
        service_name = service_name,
        sample_type = sample_type,
        application = application,
        platform_conc = platform_conc,
        platform_int = platform_int,
        extraction_needed = extraction_needed,
        sample_number = sample_number,
        qc_same_details = libqc_same_details,
        qc_summary = libqc_summary     
    )

    libqc_bytes = HTML(string=html_content).write_pdf()

    return Response(
        content= libqc_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=libqc_report_{project_id}.pdf"}
    )



@app.post("/reports/samplesubreportpdf")
async def samsub_gen(payload : projectId):

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


    sample_sub_details = ss_info.get("sample_details", [])

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



    







