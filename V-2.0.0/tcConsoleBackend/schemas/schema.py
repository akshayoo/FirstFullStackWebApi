from pydantic import BaseModel, EmailStr
from typing import List, Dict, Optional, Any

class ProjectSubmission(BaseModel):
    project_id: str
    pi_name: str
    email: EmailStr
    phone: str
    institution: str
    labdept: str
    stakeholders: List[dict] = []
    offering_type: str
    service_name: str
    sam_number: int
    extraction: str
    sample_class : str
    sample_type: str
    platform: str
    standard_deliverables: List[str]
    added_deliverables: List[str]

class ProjIdSubnoFormat(BaseModel):
    project_id : str
    submission_number : int 
    format_req : str 

class ProjIdSubno(BaseModel):
    project_id : str
    submission_number : int 

class ProjId(BaseModel):
    project_id : str

class ProjToken(BaseModel):
    project_token : str

class ProjIdStatus(BaseModel):
    project_id : str
    project_status : str

class DeleetAddReport(BaseModel):
    project_id: str
    report_id: str

class NgsForm(BaseModel):
    project_id: str
    technology: str
    application: str
    replicates: str
    extraction_needed: str

    dnase_treated: Optional[str] = None
    rna_kit_name: Optional[str] = None
    rna_assessment: Optional[str] = None

    rnase_treated: Optional[str] = None
    dna_kit_name: Optional[str] = None
    dna_assessment: Optional[str] = None

    bioinformatics_needed: str
    key_objectives: Optional[str] = None
    differential_comparisons: Optional[str] = None
    additional_analysis: Optional[str] = None
    reference_study: Optional[str] = None

    project_description : str

    table: List[Dict[str, Any]]


class NcounterForm(BaseModel):
    project_id: str
    technology : str
    application: str
    replicates: str
    extraction_needed: str

    rna_prep: Optional[str] = None 
    rna_kit_name: Optional[str] = None
    dnase_treated: Optional[str] = None
    rna_assessment: Optional[str] = None


    bioinformatics_needed: str
    key_objectives: Optional[str] = None
    differential_comparisons: Optional[str] = None
    additional_analysis: Optional[str] = None
    reference_study: Optional[str] = None

    project_description : str

    table: List[Dict[str, Any]]

class EmailCont(BaseModel):
    project_id : str
    section : str
    submission : int | str
    email : EmailStr
    mail_subject : str
    mail_content : str

class ProjComments(BaseModel):
    project_id : str
    project_comments : str

class StakeholderPayload(BaseModel):
    project_id: str
    name: str
    email: EmailStr

class EditClientPayload(BaseModel):
    project_id: str
    pi_name: str
    email: EmailStr
    phone: str
    institution: str
    lab_dept: str
    offering_type: str


class EditServicePayload(BaseModel):
    project_id: str
    service_name: str
    platform: str
    sample_type: str
    sample_number: int
    sample_extraction_needed: str

class CommentPayload(BaseModel):
    project_id: str
    comment: str

class TaskUpdate(BaseModel):
    project_id : str
    task : int
    sec : str

class TaskAdd(BaseModel):
    project_id : str
    project_task : str

class AuthLogin(BaseModel):
    username : str
    password : str

class AuthSignup(BaseModel):
    name : str
    username : str
    password : str
    password_re : str

class CustomServics(BaseModel):
    category : str
    service_name : str
    catalog_number : str
    application : str
    platform : str
    sam_types : str
    standard_deliverables : str

class ConversationPop(BaseModel):
    convo_id : str

class Inference(BaseModel):
    new_chat : bool 
    convo_id : Optional[str] = None
    user_message: str

class Email(BaseModel):
    email : EmailStr

class ValidateSignup(BaseModel):
    name : str
    username : EmailStr
    code : str


class GenCatNo(BaseModel):
    category : str
    service_name : str

class EditCheck(BaseModel):
    project_id : str
    meta : str

class SopStart(BaseModel):
    sop_id : str
    sop_title : str
    sop_desc : str
    sop_category : str
    sop_dept : str
    sop_rev_period : int
    sop_reviewer : str

class PipeSopId(BaseModel):
    sop_uid : str
    sop_name : str

class SopContent(BaseModel):
    process : str
    sop_id : str
    sop_contentid : str | None = None
    sop_nameversion : str
    sop_content  : str

class SopFate(BaseModel):
    sop_id : str
    process : str
    comments : str

class PipeSopDel(BaseModel):
    sop_uid : str
    sop_name : str
    sop_ver : int

class PipeChangeOwner(BaseModel):
    sop_id: str
    sop_new_owner: str

class SopEdit(BaseModel):
    sop_id : str
    sop_title : str
    sop_desc : str
    sop_category : str
    sop_dept : str
    sop_rev_period : int
    sop_reviewer : str
    sop_uid : str

class SopDwnld(BaseModel):
    sop_id : str

class SopShare(BaseModel):
    sop_id : str
    share_email : EmailStr

class SopAck(BaseModel):
    sop_id : str
    acknowledge_comm : str

class SopExtend(BaseModel):
    sop_id: str
    extend_period: int 

class InventoryItems(BaseModel):
    item_name : str
    catalogue_num : str
    description : str
    category : str
    sub_category : List[str]
    unit_of_measure : str
    min_stock_qty : int


class InventoryVendors(BaseModel):
    vendor_name : str
    contact_name : str
    contact_email : EmailStr
    contact_phone : str
    supply_source : str
    currency : str
    address : str | None = None