from pymongo import MongoClient
from fastapi import HTTPException
from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
from datetime import date

def collections_load(collection: str):
    try:
        CLIENT = MongoClient("mongodb://localhost:27017")

        db = CLIENT.tcDB
        
        
        collection_obj = db[collection]
        
        return collection_obj
    
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {str(e)}"
        )
    

def qc_temp_bytes(project_id : str):

    collections = collections_load("tcProjects")

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

    inbytes = HTML(string=html_content).write_pdf()

    return inbytes


def lib_qc_bytes(project_id : str):

    collections = collections_load("tcProjects")

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

    inbytes = HTML(string=html_content).write_pdf()

    return inbytes

