from pymongo import MongoClient
from fastapi import HTTPException
import os
from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
from datetime import date
from pypdf import PdfWriter, PdfReader
from io import BytesIO
from dotenv import load_dotenv
from utils.postgre import engine
from sqlalchemy import text
import pandas as pd
from io import StringIO

load_dotenv()

MONGO_CLIENT = os.getenv("MONGO_CLIENT")



def collections_load(collection: str):
    try:
        CLIENT = MongoClient(MONGO_CLIENT)

        db = CLIENT.tcDBS
        
        
        collection_obj = db[collection]
        
        return collection_obj
    
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {str(e)}"
        )
    

def collections_load_web(collection: str):
    try:
        CLIENT = MongoClient(MONGO_CLIENT)

        db = CLIENT.tcWebDB
        
        
        collection_obj = db[collection]
        
        return collection_obj
    
    except Exception as e:
        print(f"Database connection error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Database connection failed: {str(e)}"
        )
    

def qc_temp_bytes(project_id : str, sub_no : int, sub_format : str):

    collections = collections_load("tcProjects")

    data = next(
        collections.aggregate([
            {
                "$match": {
                    "project_id": project_id
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "project_info": 1,
                    "service_info": 1,
                    "qc": {
                        "$arrayElemAt": [
                            {
                                "$filter": {
                                    "input": "$qc",
                                    "as": "qc",
                                    "cond": {
                                        "$eq": [
                                            "$$qc.submission_number",sub_no
                                        ]
                                    }
                                }
                            },
                            0
                        ]
                    }
                }
            }
        ]),
        None
    )


    project_info = data.get("project_info", {})
    service_info= data.get("service_info", {})
    qc_info  = data.get("qc", {})


    name = project_info.get("pi_name")
    institution = project_info.get("institution")
    lab_dept = project_info.get("lab_dept")
    report_date = date.today().strftime("%B %d, %Y")

    service_name = service_info.get("service_name")
    sample_type = service_info.get("sample_type")
    application = qc_info.get("qc_application")
    platform_conc = qc_info.get("concentration_technology")
    platform_int = qc_info.get("integrity_technology")
    extraction_needed = service_info.get("extraction_needed")
    sample_number = service_info.get("sample_number")
    qc_summary = qc_info.get("qc_summary")
    qc_same_details = qc_info.get("qc_sample_details",[])

    if sub_format == ".pdf": 

        env = Environment(loader=FileSystemLoader('./templates'))

        if application == "RNA":
            template = env.get_template('qctemplate.html')
        if application == "DNA":
            template = env.get_template('qctemplatedna.html')

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


    if sub_format == ".csv":

        df = pd.DataFrame(qc_same_details)
        csvio = StringIO()

        df.to_csv(csvio, index=False)

        inbytes = csvio.getvalue()


    return inbytes


def lib_qc_bytes(project_id : str, sub_no : str, sub_format : str):

    collections = collections_load("tcProjects")

    data = next(
        collections.aggregate([
            {
                "$match": {
                    "project_id": project_id
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "project_info": 1,
                    "service_info": 1,
                    "library": {
                        "$arrayElemAt": [
                            {
                                "$filter": {
                                    "input": "$library",
                                    "as": "library",
                                    "cond": {
                                        "$eq": [
                                            "$$library.submission_number",sub_no
                                        ]
                                    }
                                }
                            },
                            0
                        ]
                    }
                }
            }
        ]),
        None
    )
    
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
    platform = service_info.get("platform")
    #platform_conc = qc_info.get("concentration_technology")
    #platform_int = qc_info.get("integrity_technology")
    extraction_needed = service_info.get("extraction_needed")
    sample_number = service_info.get("sample_number")
    libqc_summary = libqc_info.get("library_summary")
    libqc_same_details = libqc_info.get("qc_sample_details",[])

    if sub_format == ".pdf":

        evv = Environment(loader= FileSystemLoader("./templates"))
        template = evv.get_template("librqctemplate.html")

        html_content = template.render(
            project_id=project_id,
            name = name,
            institution = institution,
            lab_dept = lab_dept,
            date = report_date,
            service_name = service_name,
            sample_type = sample_type,
            application = platform,
            #platform_conc = platform_conc,
            #platform_int = platform_int,
            extraction_needed = extraction_needed,
            sample_number = sample_number,
            qc_same_details = libqc_same_details,
            qc_summary = libqc_summary     
        )

        inbytes = HTML(string=html_content).write_pdf()

    if sub_format == ".csv":

        df = pd.DataFrame(libqc_same_details)
        csvio = StringIO()

        df.to_csv(csvio, index=False)

        inbytes = csvio.getvalue()

    return inbytes


def intqc_libqc_report_collate(project_id : str, sec : str, submission_no : str):
    collection = collections_load("tcProjects")

    try:

        if sec == "qc":

            data = next(
                collection.aggregate([
                    {
                        "$match": {
                            "project_id": project_id
                        }
                    },
                    {
                        "$project": {
                            "_id": 0,
                            "qc": {
                                "$arrayElemAt": [
                                    {
                                        "$filter": {
                                            "input": "$qc",
                                            "as": "qc",
                                            "cond": {
                                                "$eq": [
                                                    "$$qc.submission_number",submission_no
                                                ]
                                            }
                                        }
                                    },
                                    0
                                ]
                            }
                        }
                    }
                ]),
                None
            )

            try : report = qc_temp_bytes(project_id= project_id, sub_no= submission_no, sub_format=".pdf")
            except: report = None
            report_path = data.get(f"qc", {}).get(f"qc_report")

        elif sec == "library":

            data = next(
                collection.aggregate([
                    {
                        "$match": {
                            "project_id": project_id
                        }
                    },
                    {
                        "$project": {
                            "_id": 0,
                            "library": {
                                "$arrayElemAt": [
                                    {
                                        "$filter": {
                                            "input": "$library",
                                            "as": "library",
                                            "cond": {
                                                "$eq": [
                                                    "$$library.submission_number",submission_no
                                                ]
                                            }
                                        }
                                    },
                                    0
                                ]
                            }
                        }
                    }
                ]),
                None
            )
            
            try : report = lib_qc_bytes(project_id= project_id, sub_no= submission_no, sub_format=".pdf")
            except: report = None
            report_path = data.get(f"library", {}).get(f"library_report")

        try:
            with open (report_path, "rb") as f:
                addon_report = f.read()
        except: addon_report = None

        final_report = [report, addon_report]

        A4_WIDTH = 595 
        A4_HEIGHT = 842 

        writer = PdfWriter()

        for pdf_bytes in final_report:
            if not pdf_bytes:
                continue

            reader = PdfReader(BytesIO(pdf_bytes))

            for page in reader.pages:

                new_page = writer.add_blank_page(width=A4_WIDTH, height=A4_HEIGHT)
                or_width = float(page.mediabox.width)
                or_height = float(page.mediabox.height)
                x_scale = A4_WIDTH / or_width
                y_scale = A4_HEIGHT / or_height
                scale = min(x_scale, y_scale)

                page.scale_by(scale)

                x_off = (A4_WIDTH - (or_width * scale)) / 2
                y_off = (A4_HEIGHT - (or_height * scale)) / 2

                new_page.merge_translated_page(page, x_off, y_off)

        output = BytesIO()
        writer.write(output)

        return output.getvalue()

    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail= "Merging failed"
        )




def fin_report_collate(project_id :  str):

    collection = collections_load("tcProjects")


    data = collection.find_one({"project_id" : project_id},
                               {
                                   "_id" : 0,
                                   "bioinformatics.bioinformatics_report" : 1
                               })
    
    analysis_report_path = data.get("bioinformatics", {}).get("bioinformatics_report")

    try:

        with open("./templates/report_front_page.pdf", "rb") as f:
            first_page_bytes = f.read()

        try:
            with open (analysis_report_path, "rb") as f:
                analysis_report = f.read()
        except: analysis_report = None

        try : qc_report = qc_temp_bytes(project_id= project_id)
        except: qc_report = None

        try: libqc_report = lib_qc_bytes(project_id = project_id)
        except: libqc_report = None

        final_report = [first_page_bytes, qc_report, libqc_report, analysis_report]

        A4_WIDTH = 595 
        A4_HEIGHT = 842 

        writer = PdfWriter()

        for pdf_bytes in final_report:
            if not pdf_bytes:
                continue

            reader = PdfReader(BytesIO(pdf_bytes))

            for page in reader.pages:

                new_page = writer.add_blank_page(width=A4_WIDTH, height=A4_HEIGHT)
                or_width = float(page.mediabox.width)
                or_height = float(page.mediabox.height)
                x_scale = A4_WIDTH / or_width
                y_scale = A4_HEIGHT / or_height
                scale = min(x_scale, y_scale)

                page.scale_by(scale)

                x_off = (A4_WIDTH - (or_width * scale)) / 2
                y_off = (A4_HEIGHT - (or_height * scale)) / 2

                new_page.merge_translated_page(page, x_off, y_off)

        output = BytesIO()
        writer.write(output)

        return output.getvalue()


    except Exception as e:
        print(str(e))
        raise HTTPException(
            status_code=500,
            detail= "Merging failed"
        )

    

    
def sop_print(sop_id : str):

    query = """
        SELECT
            v.sopid,
            v.sopnameversion,
            v.sopversion,
            v.sopcreatedby,
            v.sopcreatedat,
            v.sopeffectivedate,
            v.soprevisiondate,
            v.soprevisiongap,
            v.sopstatus,
            v.sopchangesummary,
            m.sopmasterid,
            m.sopname,
            m.soptitle,
            m.sopdescription,
            m.sopdepartment,
            m.sopcategory,
            c.contenthtml,
            r.reviewer,
            r.reviewedby,
            r.reviewedat,
            r.reviewcomments,
            r.approver,
            r.approvedby,
            r.approvedat,
            r.approvecomments
        FROM tcsopversions v
        LEFT JOIN tcsopmaster m ON v.sopmasterid = m.sopmasterid
        LEFT JOIN tcsopreview r ON v.sopid = r.sopid
        LEFT JOIN tcsopcontent c ON v.sopid = c.sopid
        WHERE v.sopid = :sop_id
    """

    with engine.connect() as conn:
        row = conn.execute(text(query), {"sop_id": sop_id}).fetchone()

    
    data = dict(row._mapping)
    

    env = Environment(loader= FileSystemLoader("./templates"))
    template = env.get_template("soptemplate.html")

    html_content = template.render(
        sop_id = data["sopid"],
        sop_title = data["soptitle"],
        sop_version = data["sopversion"],
        sop_category = data["sopcategory"],
        sop_department = data["sopdepartment"],
        sop_status = data["sopstatus"],
        sop_effective_date = data["sopeffectivedate"],
        sop_revision_date = data["soprevisiondate"],
        sop_revision_gap = data["soprevisiongap"],
        sop_description = data["sopdescription"],
        sop_change_summary = data["sopchangesummary"],
        sop_content = data.get("contenthtml") or "<p>No content available</p>",
        created_by = data["sopcreatedby"],
        created_at = data["sopcreatedat"],
        reviewed_by = data["reviewedby"],
        reviewed_at = data["reviewedat"],
        review_comments = data["reviewcomments"],
        approved_by = data["approvedby"],
        approved_at = data["approvedat"],
        approve_comments  = data["approvecomments"]
)

    inbytes = HTML(string=html_content).write_pdf()

    return inbytes