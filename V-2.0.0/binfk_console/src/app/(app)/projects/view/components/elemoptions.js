import { useState, useEffect } from 'react'
import axiosApi from '@/lib/api';
import styles from '../ViewComp.module.css'
import { toastSet } from '@/components/toastfunc';
import { MessageComp } from '@/components/messageComp';
import { X, Plus, Trash2 } from 'lucide-react'

export function QcReportPushForm({setQcDataForm, projectId}){

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "qc_application" : "",
        "method_summary" : "",
        "concentration_technology" : "",
        "integrity_technology" : "",
        "qc_summary" : "",
        "qc_report" : null,
        "qc_data" : null
    })

    const[toast, setToast] = useState(null)
    
    const[disButton, setDisButton] = useState(false)

    async function updateQcData(){
        if(!formData.qc_application || !formData.method_summary || !formData.concentration_technology ||  
            !formData.integrity_technology || !formData.qc_summary || !formData.qc_report || !formData.qc_data)

            {
                toastSet(setToast, false, "All entries are mandatory, Please fill the missing fields")
                return
            }


        try {

            setDisButton(true)

            const fd = new FormData();

            Object.entries(formData).forEach(([key,value])=>{
                fd.append(key, value);
            })

            const response = await axiosApi.post("/project/qcdataupdate", 
                fd
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            toastSet(setToast, true, data.message)
            setTimeout(() => setQcDataForm(false), 2000 ) 

        }
        catch (err){
            console.error(err);
            toastSet(setToast, false, "QC report can't be updated")
        }
        finally{
            setDisButton(false)
        }
    }

    const handleChange = (e) => {

        const{name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const handleFileChange = (e) => {
        const{name, files} = e.target
        setFormData(prev => ({
            ...prev, [name] : files[0]
        }))
    }


    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Upload QC and Method Data</h3>
                <button onClick={() => setQcDataForm(false)} >X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>QC Application</label>
                        <select name="qc_application" onChange={handleChange}>
                            <option>--Select--</option>
                            <option value="DNA">DNA</option>
                            <option value="RNA">RNA</option>
                        </select>
                    </div>
                    <div className={styles.formElem}>
                        <label>Method Summary</label>
                        <textarea name="method_summary" rows ='6' onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <div className={styles.formElemel}>
                            <label>Concentration assessed by</label>
                            <select name="concentration_technology" onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="Qubit">Qubit</option>
                                <option value="NanoDrop">NanoDrop</option>
                                <option value="NanoDrop">NanoDrop & Qubit</option>
                            </select>
                        </div>
                        <div className={styles.formElemel}>
                            <label>Integrity assessed by</label>
                            <select name="integrity_technology" onChange={handleChange}>
                                <option value="">Select</option>
                                <option value="TapeStation">TapeStation</option>
                                <option value="BioAnalyzer">BioAnalyzer</option>
                                <option value="Agarose Gel Electrophoresis">Agarose Gel Electrophoresis</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formElem}>
                        <label>QC Summary</label>
                        <textarea name="qc_summary" rows='6' onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>{`Upload QC Report(.pdf)`}</label>
                        <input name="qc_report" type='file' accept='.pdf' onChange={handleFileChange}/>
                    </div>
                    <div className={styles.formElem}>
                        <label>{`Upload QC data(.csv)`}</label>
                        <input name="qc_data" type='file' accept='.csv' onChange={handleFileChange}/>
                    </div>
                </div>
                <div className={styles.formElem}>
                    <button onClick={updateQcData} disabled={disButton} >{disButton ? <>Processing...</> : <>Submit</>}</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>
    )
}





export function LibQcReportPushForm({setLibQcDataForm, projectId}){

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "library_method" : "",
        "library_summary" : "",
        "library_report" : null,
        "library_data" : null
    })

    const [toast, setToast] = useState(null)

    const[disButton, setDisButton] = useState(false)


    async function updateLibQcData() {
        
        
        if (!formData.library_method || !formData.library_summary || !formData.library_report
            || !formData.library_data)
            {
                toastSet(setToast, false, "All entries are mandatory, Please fill the missing fields")
                return
            }

        try {

            setDisButton(true)

            const formd = new FormData()

            Object.entries(formData).forEach(([key, value]) => {
                formd.append(key, value)
            })
            
            const response = await axiosApi.post("/project/libqcdataupdate",
                formd
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            toastSet(setToast, true, data.message)
            setTimeout(() => setLibQcDataForm(false), 2000)
        }
        catch(error){
            console.log(error)
            toastSet(setToast, false, "Library QC report can't be updated")
        }
        finally{
            setDisButton(false)
        }
        
    }

    const handleChange = (e) => {

        const{name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const handleFileChange = (e) => {
        const {name, files} = e.target
        setFormData(prev => ({
            ...prev, [name] : files[0]
        }))
    }


    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

                <div className={styles.modalHeader}>
                    <h3>Upload QC and Method Data</h3>
                    <button onClick={() => setLibQcDataForm(false)} >X</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.GridTwo}>
                        <div className={styles.formElem}>
                            <label>Lib Method</label>
                            <input name="library_method" onChange={handleChange}/>
                        </div>
                        <div className={styles.formElem}>
                            <label>Library Summary</label>
                            <textarea name="library_summary" rows ='6' onChange={handleChange} />
                        </div>
                    </div>
                    <div className={styles.GridTwo}>
                        <div className={styles.formElem}>
                            <label>{`Upload Lib Report(.pdf)`}</label>
                            <input name="library_report" type='file' accept='.pdf' onChange={handleFileChange} />
                        </div>
                        <div className={styles.formElem}>
                            <label>{`Upload Lib QC data(.csv)`}</label>
                            <input name="library_data" type='file' accept='.csv' onChange={handleFileChange} />
                        </div>
                    </div>    
                    <div className={styles.formElem}>
                        <button onClick={updateLibQcData} disabled={disButton} >{disButton ? <>Processing...</> : <>Submit</>}</button>
                    </div>  
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}





export function BinfReportPushForm({setBinfDataForm, projectId}){

    const [toast, setToast] = useState(null)

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "bioinformatics_summary" : "",
        "estimated_hours" : "",
        "approximate_hours" : "",
        "bioinformatics_report" : null
    })

    const[disButton, setDisButton] = useState(false)

    async function updateBinfData() {

        if(!formData.bioinformatics_summary || !formData.estimated_hours || !formData.approximate_hours || !formData.bioinformatics_report)            
            {
                toastSet(setToast, false, "All entries are mandatory, Please fill the missing fields")
                return
            }
        try {

            setDisButton(true)

            const binff = new FormData()

            Object.entries(formData).forEach(([key, value]) =>{
                binff.append(key, value)
            })

            const response = await axiosApi.post("/project/binfkilldataupdate",
                binff
            )
            
            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            toastSet(setToast, true, data.message)
            setTimeout(() => setBinfDataForm(false), 2000)

        }
        catch(error){
            console.log(error)
            alert("Analysis report can't be updated")
        }
        finally{
            setDisButton(false)
        }
    }

    const handleChange = (e) => {
        const{name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const handleFileChange = (e) => {
        const{name, files} = e.target
        setFormData(prev => ({
            ...prev, [name] : files[0]
        }))
    }

    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Upload Analysis Data</h3>
                <button onClick={() => setBinfDataForm(false)} >X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Analysis Summary</label>
                        <textarea name="bioinformatics_summary" rows='6' onChange={handleChange}/>
                    </div>
                </div>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Expected hours spend for the analysis</label>
                        <input type='number' name= "estimated_hours" onChange={handleChange} />
                    </div>
                    <div className={styles.formElem}>
                        <label>Approximate hours spend for the analysis</label>
                        <input type='number' name="approximate_hours" onChange={handleChange} />
                    </div>
                </div>
                <div className={styles.formElem}>
                    <label>{`Upload Final Analysis Report(.pdf)`}</label>
                    <input name="bioinformatics_report" type='file' accept='.pdf' onChange={handleFileChange}/>
                </div>
                <div className={styles.formElem}>
                    <button onClick={updateBinfData} disabled={disButton} >{disButton ? <>Processing...</> : <>Submit</>}</button>
                </div>  
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>
    )
}


export function ProjectCommentsForm({projectId, setProjectComments}){

    const [toast, setToast] = useState(null)

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "project_comments" : ""
    })

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    async function updateProjectComments() {
        if(!formData.project_comments){
            toastSet(setToast, false, "Missing fields")
            return
        }

        if(formData.project_comments.length > 500){
            toastSet(setToast, false, "Exceeded character limit make the comments short")
            return
        }

        try {
            const response = await axiosApi.post("/project/projcommupdate",
                formData
            )
            
            const data = response.data

            toastSet(setToast, data.status, data.message)
            setTimeout(() => setProjectComments(false), 2000)

        }
        catch(err){
            console.log(err)
            toastSet(setToast, false, "Failed to update comments")
        }
    }

    return(

        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
                <div className={styles.modalHeader}>
                    <h3>Update a new project comment for {projectId}</h3>
                    <button onClick={() => setProjectComments(false)} >X</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.formElem}>
                        <label>Update comment</label>
                        <textarea name="project_comments" placeholder='Maximum 500 charecters' rows='12' onChange={handleChange}/>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "13px" }}>
                        {formData.project_comments.length}/500
                    </div>
                    <div className={styles.formElem}>
                        <button onClick={updateProjectComments} >Submit</button>
                    </div>  
                </div>
                {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>
    );
}


export function AddTask({projectId, setTaskAdd}){

    const [toast, setToast] = useState(null)

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "project_task" : ""
    })

    const [disBtn, setDisBtn] = useState(false)

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    async function addNewTask() {
        if(!formData.project_task.trim()){
            toastSet(setToast, false, "Missing fields")
            return
        }

        if(formData.project_task.length > 200){
            toastSet(setToast, false, "Exceeded character counts >> Keep it under 200 chars")
            return
        }

        setDisBtn(true)

        try {
            const response = await axiosApi.post("/project/addtask",
                formData
            )
            
            const data = response.data

            toastSet(setToast, data.status, data.message)
            setTimeout(() => setTaskAdd(false), 2000)

        }
        catch(err){
            console.log(err)
            toastSet(setToast, false, "Failed to add task")
        }

        finally{
            setDisBtn(false)
        }
    }

    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
                <div className={styles.modalHeader}>
                    <h3>Add a task for {projectId}</h3>
                    <button onClick={() => setTaskAdd(false)} >X</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.formElem}>
                        <label>Task Name</label>
                        <textarea name="project_task" placeholder='Maximum 200 charecters' rows='6' onChange={handleChange}/>
                    </div>
                    <div style={{ textAlign: "right", fontSize: "13px" }}>
                        {formData.project_task.length}/200
                    </div>
                    <div className={styles.formElem}>
                        <button onClick={addNewTask} disabled={disBtn} >{disBtn ? <>Please wait</> : <>Add task</>}</button>
                    </div>  
                </div>
                {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>     
    )
}


export function NewProject({setNewProject}) {

    const [servicesClass, setServicesClass] = useState({})
    const [sampleClass, setSampleclass] = useState({})
    const [classServices, setClassServices] = useState([])
    const [selectedServProps, setSelectedServProps] = useState(null)
    const [projectDesc, setProjectDesc] = useState("")
    const [toast, setToast] = useState(null)
    const [submitDis, setSubmitDis] = useState(false)
    const [standardDesc, setStandardDesc] = useState("")


    const [formData, setFormData] = useState({
        project_id: "",
        pi_name: "",
        email: "",
        phone: "",
        institution: "",
        labdept: "",
        stakeholders: [], 
        offering_type: "",
        service_name: "",
        sam_number: "",
        extraction: "",
        sample_class: "",
        sample_type: "",
        platform: "",
        standard_deliverables: [],
        added_deliverables: []
    })

    useEffect(() => {

        async function DataLoad() {

            try {

                const response = await axiosApi.get("/initialization/popservices")
                setServicesClass(response.data)

            } catch (error) { 
                console.log(error) 
            }
        }

        async function sampelClassLoad() {
            try {

                const response = await axiosApi.get("/project/sampleclasspop")
                setSampleclass(response.data)

            } catch (error) { 
                console.log(error) 
            }
        }
        DataLoad()
        sampelClassLoad()
    }, [])


    const handleChange = (e) => {

        const { name, value } = e.target

        setFormData(
            prev => ({ ...prev, [name]: value })
        )

    }

    const handleRadioChange = (e) => {

        setFormData(
            prev => ({ ...prev, [e.target.name]: e.target.value })
        )
    }

    const onClassChange = (e) => {

        const value = e.target.value

        setClassServices(servicesClass[value] || [])
        setFormData(
            prev => ({ ...prev, offering_type: value })
        )
    }

    const onServiceSelct = (e) => {

        const serv_value = e.target.value
        const obj = classServices.find(s => s.service_name === serv_value) || null
        setSelectedServProps(obj)

        if (obj) {
            const sd = obj.standard_deliverables || {}
            const standardDeliverables = [...(sd.reports || []), ...(sd["add-ons"] || [])]

            setProjectDesc("")

            setFormData(prev => ({
                ...prev,
                service_name:          serv_value,
                platform:              obj.instrumentation?.platform || "",
                standard_deliverables: standardDeliverables,
                added_deliverables:    []
            }))
        }
    }

    const addStakeholder = () =>
        setFormData(prev => ({
             ...prev, 
             stakeholders: [...prev.stakeholders, { name: "", email: "" }] 
            }))

    const removeStakeholder = (idx) =>
        setFormData(prev => ({ 
            ...prev, 
            stakeholders: prev.stakeholders.filter((_, i) => i !== idx) 
        }))

    const handleStakeholderChange = (idx, field, value) =>

        setFormData(prev => ({
            ...prev,
            stakeholders: prev.stakeholders.map((s, i) => i === idx ? { ...s, [field]: value } : s)
        }))


    async function getProjectId() {

        try {

            const response = await axiosApi.post("/initialization/genprojectid")
            const data = response.data

            setFormData(
                prev => ({ ...prev, project_id: data.payload.project_id })
            )

            toastSet(setToast, data.status, data.message)

        } catch (err) {

            console.log(err)
            toastSet(setToast, false, "Unable to process request")
        }
    }


    const validateForm = () => {

        const required = ['project_id', 'pi_name', 'email', 'institution', 'labdept',
                          'offering_type', 'service_name', 'sam_number',
                          'extraction', 'sample_type', 'platform']

        for (const key of required) {

            if (!formData[key] || formData[key].toString().trim() === "") {
                toastSet(setToast, false, `Missing: ${key.replaceAll("_", " ")}`)
                return false
            }
        }
        return true
    }


    const SendProjectInfo = async () => {

        if (!validateForm()) return
        const addedDeliverablesArray = projectDesc
            .split('\n').map(l => l.trim()).filter(l => l.length > 0)



        const standardDeliverablesArray = formData.offering_type === "Custom services"
            ? standardDesc.split('\n').map(l => l.trim()).filter(l => l.length > 0)
            : formData.standard_deliverables

        const payload = {
            ...formData,
            standard_deliverables: standardDeliverablesArray,
            added_deliverables: addedDeliverablesArray,
        }


        setSubmitDis(true)

        try {
            const response = await axiosApi.post("/initialization/startproject", payload,
                { headers: { "Content-Type": "application/json" } })

            const data = response.data

            if (!data.status) { toastSet(setToast, false, data.message); setSubmitDis(false); return }

            toastSet(setToast, true, data.message)
            setTimeout(() => window.location.reload(), 2000)

        } catch (error) {
            console.error(error)
            toastSet(setToast, false, "Submission failed")
            setSubmitDis(false)
        }
    }

    const getStandardDeliverables = () => {

        if (!selectedServProps?.standard_deliverables) return []

        const sd = selectedServProps.standard_deliverables
        return [...(sd.reports || []), ...(sd["add-ons"] || [])]

    }


    return (
        <div className={styles.NewSopComp}>

            <div className={styles.FormHeader}>
                <div>
                    <h2 className={styles.FormTitle}>Add New Project</h2>
                </div>
                <div>
                    <button onClick={() => setNewProject(false)} className={styles.CloseBtn}>X</button>
                </div>
            </div>

            <div className={styles.FormSection}>
                <div className={styles.FormSectionLabel}>Client Information</div>
                <div className={styles.SopForm}>
                    <div className={styles.SopFormDiv}>

                        <label>
                            Project ID
                            <button type="button" className={styles.InlinePillBtn} onClick={getProjectId}>
                                Generate
                            </button>
                        </label>
                        <input name="project_id" value={formData.project_id} type="text" onChange={handleChange} />

                        <label>PI Name</label>
                        <input name="pi_name" type="text" onChange={handleChange} />

                        <div className={styles.SopFormGrid2}>
                            <div>
                                <label>Email</label>
                                <input name="email" type="email" onChange={handleChange} />
                            </div>
                            <div>
                                <label>Phone</label>
                                <input name="phone" type="tel" onChange={handleChange} />
                            </div>
                        </div>

                        <div className={styles.SopFormGrid2}>
                            <div>
                                <label>Institution</label>
                                <input name="institution" type="text" onChange={handleChange} />
                            </div>
                            <div>
                                <label>Lab / Department</label>
                                <input name="labdept" type="text" onChange={handleChange} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className={styles.FormSection}>
                <div className={styles.FormSectionLabel}>Stakeholders</div>
                <div className={styles.SopForm}>
                    <div className={styles.SopFormDiv}>
                        {formData.stakeholders.map((s, idx) => (
                            <div key={idx} className={styles.StakeholderRow}>
                                <div className={styles.StakeholderFields}>
                                    <div>
                                        <label>Name</label>
                                        <input type="text" placeholder="Full name" value={s.name} onChange={e => handleStakeholderChange(idx, "name", e.target.value)}/>
                                    </div>
                                    <div>
                                        <label>Email</label>
                                        <input type="email" placeholder="blabla@example.com" value={s.email} onChange={e => handleStakeholderChange(idx, "email", e.target.value)}/>
                                    </div>
                                </div>
                                {formData.stakeholders.length > 1 && (
                                    <button type="button" className={styles.StakeholderRemoveBtn} onClick={() => removeStakeholder(idx)}>
                                        <Trash2 size={13} />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className={styles.StakeholderAddBtn} onClick={addStakeholder}>
                            <Plus size={13} /> Add Stakeholder
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.FormSection}>
                <div className={styles.FormSectionLabel}>Service Information</div>
                <div className={styles.SopForm}>
                    <div className={styles.SopFormDiv}>

                        <label>Offering Type</label>
                        <select name="offering_type" onChange={onClassChange}>
                            <option value="">--Select offering type--</option>
                            {Object.keys(servicesClass).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>

                        <label>Service / Application</label>

                        {formData.offering_type === "Custom services" ? (
                            <input type="text" name="service_name" placeholder="Type custom service name" value={formData.service_name} onChange={handleChange}      />
                        ) : (
                            <select name="service_name" onChange={onServiceSelct}>
                                <option value="">--Select service--</option>
                                {classServices.map((s) => (
                                    <option key={s.service_name} value={s.service_name}>{s.service_name}</option>
                                ))}
                            </select>
                        )}

                        <label>Platform</label>
                        <select name="platform" onChange={handleChange}>
                            <option value="">--Select--</option>
                            <option value="Illumina">Illumina</option>
                            <option value="ONT Promethion">ONT Promethion</option>
                            <option value="nCounter">nCounter</option>
                            <option value="MGI DNBESEQ">MGI DNBESEQ</option>
                            <option value="10X Genomics Visium">10X Genomics Visium</option>
                            <option value="GeoMX">GeoMX</option>
                            <option value="Visium/Visium HD">Visium/Visium HD</option>
                            <option value="Xenium">Xenium</option>
                            <option value="Atera">Atera</option>
                        </select>

                        <div className={styles.SopFormGrid2}>
                            <div>
                                <label>Sample Class</label>
                                <select
                                    name="sample_class"
                                    value={formData.sample_class || ""}
                                    onChange={handleChange}
                                >
                                    <option value="">--Select Class--</option>

                                    {Object.keys(sampleClass || {}).map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label>Sample Type</label>
                                <select
                                    name="sample_type"
                                    value={formData.sample_type || ""}
                                    onChange={handleChange}
                                >
                                    <option value="">--Select Type--</option>

                                    {(sampleClass?.[formData.sample_class] || []).map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className={styles.SopFormGrid2}>
                            <div>
                                <label>Number of Samples</label>
                                <input name="sam_number" type="number" onChange={handleChange} />
                            </div>
                            <div>
                                <label>Extraction Needed</label>
                                <div className={styles.RadioGroup}>
                                    <label className={styles.RadioLabel}>
                                        <input type="radio" name="extraction" value="yes" onChange={handleRadioChange} /> Yes
                                    </label>
                                    <label className={styles.RadioLabel}>
                                        <input type="radio" name="extraction" value="no" onChange={handleRadioChange} /> No
                                    </label>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className={styles.FormSection}>
                <div className={styles.FormSectionLabel}>Deliverables</div>
                <div className={styles.SopForm}>
                    <div className={styles.SopFormDiv}>

                        {formData.offering_type != "Custom services" ? (
                            <>
                                <label>Standard Deliverables</label>
                                <div className={styles.DeliverablesList}>
                                    {getStandardDeliverables().map((item, idx) => (
                                        <div key={idx} className={styles.DeliverableItem}>
                                            <span className={styles.DeliverableDot} />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </>
                        ):
                            <>
                                <label>Standard Deliverables</label>
                                <textarea rows={5} value={standardDesc} placeholder="Enter standard deliverables, one per line" onChange={e => setStandardDesc(e.target.value)}/>
                            </>
                        }

                        {formData.offering_type != "Custom services" &&
                            <>
                                <label>Additional Deliverables,<span className={styles.LabelHint}> one deliverable per line</span></label>
                                <textarea rows={5} value={projectDesc} placeholder="Enter additional deliverables, one per line" onChange={e => setProjectDesc(e.target.value)}/>
                            </>
                        }
                    </div>
                </div>
            </div>

            <div className={styles.FormSubmitRow}>
                <button className={styles.SubmitBtn} onClick={SendProjectInfo} disabled={submitDis}>
                    {submitDis ? <span className={styles.loader} /> : 'Add Project'}
                </button>
            </div>

            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}


export function AddStakeHolder({projectId, setAddStakeHolder}){

    const[toast, setToast] = useState(null)
    const [formData, setFormData] = useState({
        name : "",
        email : ""
    })

    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const addStakeholder = async () => {

        if (!formData.name.trim() || !formData.email.trim()) {
            toastSet(setToast, false, "Name and email are required")
            return
        }

        try {

            const response = await axiosApi.post("/projects/addstakeholder", {
                project_id: projectId,
                name:       formData.name.trim(),
                email:      formData.email.trim()
            })

            const data = response.data
            toastSet(setToast, data.status, data.message)

            if (data.status) setTimeout(() => setAddStakeHolder(false), 2000)

        } catch (err) {

            console.log(err)
            toastSet(setToast, false, "Failed to add stakeholder")
        }
    }

    return(
        <div className={styles.commentOverlay}>
            <div className={styles.commentModal}>
                <div className= {styles.commentModalHead}>
                    <div>
                        <h2 className={styles.commentTitle}>Add Stakeholder</h2>

                        <p className={styles.commentSubtitle}>
                            Enter the persons name and email
                        </p>
                    </div>
                    <div>
                        <button onClick={() => setAddStakeHolder(false)}>X</button>
                    </div>
                </div>
                <div className={styles.SopFormDiv}>
                    <label>Name</label>
                    <input name='name' value={formData.name} type='text' onChange={handleChange}/>
                </div>
                <div className={styles.SopFormDiv}>
                    <label>Email</label>
                    <input name='email' value={formData.email} type='text' onChange={handleChange}/>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.submitButton} onClick={() => addStakeholder()}>Add Stakeholder</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}


export function EditClientData({ projectCont, setEditClient }) {
 
    const [toast, setToast] = useState(null)
    const [formData, setFormData] = useState({
        project_id: projectCont.project_id,
        pi_name: projectCont.pi_name || "",
        email: projectCont.email || "",
        phone: projectCont.phone || "",
        institution: projectCont.institution || "",
        lab_dept: projectCont.lab_dept || "",
        offering_type: projectCont.offering_type || "",
    })
 
    const handleChange = (e) => {

        const { name, value } = e.target
        setFormData(prev => 
            ({ ...prev, [name]: value })
        )
    }
 
    async function handleSubmit() {

        const { pi_name, email, phone, institution, lab_dept } = formData

        if (!pi_name || !email || !phone || !institution || !lab_dept) {
            toastSet(setToast, false, "All fields are required")
            return
        }

        try{

            const response = await axiosApi.post("/projects/editclientdata", formData)
            const data = response.data

            toastSet(setToast, data.status, data.message)
            if (data.status) setTimeout(() => onClose(false), 2000)
        }
        catch(err){
            console.error(error)
            toastSet(setToast, false, "Submission failed")
        }

    }
 
    return (
        <div className={styles.commentOverlay}>
            <div className={styles.commentModal}>
                <div className={styles.commentModalHead}>
                    <div>
                        <h2 className={styles.commentTitle}>Edit Client Details</h2>
                        <p className={styles.commentSubtitle}>{projectCont.project_id}</p>
                    </div>
                    <button onClick={() => setEditClient(false)} className={styles.CloseBtn}>
                        <X size={14}/>
                    </button>
                </div>
 
                <div className={styles.SopForm}>
                    <div className={styles.SopFormDiv}>
                        <label>PI Name</label>
                        <input name="pi_name" value={formData.pi_name} type="text" onChange={handleChange}/>
 
                        <label>Email</label>
                        <input name="email" value={formData.email} type="email" onChange={handleChange}/>
 
                        <label>Phone</label>
                        <input name="phone" value={formData.phone} type="tel" onChange={handleChange}/>
 
                        <label>Institution</label>
                        <input name="institution" value={formData.institution} type="text" onChange={handleChange}/>
 
                        <label>Lab / Department</label>
                        <input name="lab_dept" value={formData.lab_dept} type="text" onChange={handleChange}/>
 
                        <label>Offering Type</label>
                        <input name="offering_type" value={formData.offering_type} type="text" onChange={handleChange}/>
                    </div>
                </div>
 
                <div className={styles.buttonContainer}>
                    <button className={styles.submitButton} onClick={handleSubmit}>
                        Update Client Details
                    </button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message}/>}
        </div>
    )
}




export function EditServiceData({ projectCont, setEditService }) {
 
    const [toast, setToast] = useState(null)
    const [formData, setFormData] = useState({
        project_id: projectCont.project_id,
        service_name: projectCont.service_name || "",
        platform: projectCont.platform || "",
        sample_type: projectCont.sample_type || "",
        sample_number: projectCont.sample_number || "",
        sample_extraction_needed: projectCont.sample_extraction_needed || "",
    })
 
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => (
            { ...prev, [name]: value })
        )
    }
 
    async function handleSubmit() {

        const { service_name, platform, sample_type, sample_number } = formData
        if (!service_name || !platform || !sample_type || !sample_number) {
            toastSet(setToast, false, "All fields are required")
            return
        }

        try {

            const response = await axiosApi.post("/projects/editservicedata", formData)
            const data = response.data

            toastSet(setToast, data.status, data.message)
            if (data.status) setTimeout(() => onClose(false), 2000)

        } catch (error) {
            console.error(error)
            toastSet(setToast, false, "Submission failed")
        }
    }
 
    return (
        <div className={styles.commentOverlay}>
            <div className={styles.commentModal}>
                <div className={styles.commentModalHead}>
                    <div>
                        <h2 className={styles.commentTitle}>Edit Service Details</h2>
                        <p className={styles.commentSubtitle}>{projectCont.project_id}</p>
                    </div>
                    <button onClick={() => setEditService(false)} className={styles.CloseBtn}>
                        <X size={14}/>
                    </button>
                </div>
 
                <div className={styles.SopForm}>
                    <div className={styles.SopFormDiv}>
                        <label>Service Name</label>
                        <input name="service_name" value={formData.service_name} type="text" onChange={handleChange}/>
 
                        <label>Platform</label>
                        <select name="platform" value={formData.platform} onChange={handleChange}>
                            <option value="" disabled>Select platform</option>
                            <option value="Illumina">Illumina</option>
                            <option value="ONT Promethion">ONT Promethion</option>
                            <option value="nCounter">nCounter</option>
                            <option value="MGI DNBESEQ">MGI DNBESEQ</option>
                            <option value="10X Genomics Visium">10X Genomics Visium</option>
                            <option value="GeoMX">GeoMX</option>
                            <option value="Visium/Visium HD">Visium/Visium HD</option>
                            <option value="Xenium">Xenium</option>
                            <option value="Atera">Atera</option>
                        </select>
 
                        <label>Sample Type</label>
                        <input name="sample_type" value={formData.sample_type} type="text" onChange={handleChange}/>
 
                        <label>Number of Samples</label>
                        <input name="sample_number" value={formData.sample_number} type="number" onChange={handleChange}/>
 
                        <label>Extraction Needed</label>
                        <div className={styles.RadioGroup}>
                            <label className={styles.RadioLabel}>
                                <input
                                    type="radio" name="sample_extraction_needed"
                                    value="yes"
                                    checked={formData.sample_extraction_needed === "yes"}
                                    onChange={handleChange}
                                /> Yes
                            </label>
                            <label className={styles.RadioLabel}>
                                <input
                                    type="radio" name="sample_extraction_needed"
                                    value="no"
                                    checked={formData.sample_extraction_needed === "no"}
                                    onChange={handleChange}
                                /> No
                            </label>
                        </div>
                    </div>
                </div>
 
                <div className={styles.buttonContainer}>
                    <button className={styles.submitButton} onClick={handleSubmit}>
                        Update Service Details
                    </button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message}/>}
        </div>
    )
}



export function DeleteStakeHolder({projId, name, email, setDeleteSH}){

    const [toast, setToast] = useState(null)


    async function shDelete(){
        try{

            const response = await axiosApi.post("/projects/deletesh", {
                project_id : projId,
                name : name,
                email : email,
            })

            const data = response.data

            if(!data.status){
                toastSet(setToast, data.status, data.message)
                return
            }

            toastSet(setToast, data.status, data.message)
            setTimeout(() => {setDeleteSH(null)}, 2000);

        }
        catch(error){
            console.log(error)
            toastSet(setToast, false, "Unable to delete Stakeholder")
        }
    }

    return(
        <div className={styles.commentOverlay}>
            <div className={styles.commentModal}>
                <div className= {styles.commentModalHead}>
                    <div>
                        <h2 className={styles.commentTitle}>Delete Stakeholder from {projId}</h2>
                        <p>...</p>
                        <p>{name}: {email}</p>
                    </div>
                    <div>
                        <button onClick={() => setDeleteSH(false)}>X</button>
                    </div>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.submitButton} onClick={() => setDeleteSH(false)}>Cancel</button>
                    <button className={styles.deleteButton} onClick={() => shDelete()}>Delete</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}




export function ProjectComments({ projectId, setProjectComm }){

    const[toast, setToast] = useState(null)

    const [formData, setFormData] = useState({
        comments : ""
    })

    const handleChange = (e) =>{
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const [comments, setComments] = useState([])

    useEffect(() => {
        async function getProjectComments() {

            try {

                const response = await axiosApi.get(`/projects/getcomments/${projectId}`)
                if (!response.data.status) { console.log(response.data.message); return }
                setComments(response.data.payload)

            } catch (err) {
                console.log(err)
            }
        }

        if (projectId) getProjectComments()

    }, [projectId])


    const addProjectComments = async () => {
        try {

            if (!formData.comments.trim()) {
                toastSet(setToast, false, "Comment cannot be empty")
                return
            }

            const response = await axiosApi.post("/projects/addcomment", {
                project_id: projectId,
                comment:    formData.comments.trim(),
            })

            if (!response.data.status) {
                toastSet(setToast, response.data.status, response.data.message)
                return
            }

            toastSet(setToast, response.data.status, response.data.message)
            setFormData({ comments: "" })

            const refresh = await axiosApi.get(`/projects/getcomments/${projectId}`)

            if (refresh.data.status) setComments(refresh.data.payload); return

        } catch (err) {

            console.log(err)
            toastSet(setToast, false, "Failed to submit comment")
            console.log(JSON.stringify(err.response?.data, null, 2))
        }
    }
    return(
        <div className={styles.commentOverlay}>
            <div className={styles.commentModal}>
                <div className={styles.commentModalHead}>
                    <div>
                        <h2 className={styles.commentTitle}>Project Comments</h2>
                        <p className={styles.commentSubtitle}>
                            Add comment to notify team
                        </p>
                    </div>
                    <div>
                        <button onClick={() => setProjectComm(false)}>X</button>
                    </div>
                </div>

                <div className={styles.acknoListBox}>
                    <div className={styles.acknoListTitle}>Project Comments</div>
                    {comments && comments.length > 0 ? (
                        comments.map((comm, index) => (
                            <div className={styles.acknoItem} key={index}>
                                <div className={styles.acknoItemHead}>
                                    <span className={styles.acknoBy}>{comm.commented_by}</span>
                                    <span className={styles.acknoDate}>{new Date(comm.created_at).toLocaleDateString("en-IN", {
                                        day:"2-digit", month:"short", year:"numeric", hour: "2-digit", minute: "2-digit", hour12: true})}</span>
                                </div>
                                <div className={styles.acknoComment}>{comm.comment || "No comment provided"}</div>
                            </div>
                        ))
                    ) : (
                        <div className={styles.acknoEmpty}>No comments yet</div>
                    )}
                </div>

                <div className={styles.SopFormDiv}>
                    <textarea name='comments' value={formData.comments} rows={2} onChange={handleChange}/>
                </div>
                <div className={styles.buttonContainer}>
                    <button className={styles.submitButton} onClick={() => addProjectComments()}>Add project comment</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}



export function ReportUploadForm({ setReportUploadForm, projectId, onSuccess }) {

    const [loading, setLoading] = useState(false)
    const [toast, setToast]     = useState(null)
    const [form, setForm]       = useState({
        report_name: '',
        report_description: '',
        submission_number: '',
        file: null
    })

    function handleChange(e) {

        const { name, value, files } = e.target
        setForm(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }))
    }

    async function addReport() {
        const { report_name, file } = form

        if (!report_name || !file) {
            toastSet(setToast, false, "Report name and file are required")
            return
        }

        const formData = new FormData()

        formData.append("project_id", projectId)
        formData.append("report_name", form.report_name)
        formData.append("report_description", form.report_description)
        formData.append("file", form.file)

        try {

            setLoading(true)

            const response = await axiosApi.post("/projects/upploadaddreport", formData, 
                {
                    headers: { "Content-Type": "multipart/form-data" }
                })

            const data = response.data
            toastSet(setToast, data.status, data.message)

            if (data.status) {
                onSuccess()
                setTimeout(() => setReportUploadForm(false), 2000)
            }

        } 
        catch (error) {
            console.error(error)
            toastSet(setToast, false, "Upload failed")

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.commentOverlay}>
            <div className={styles.commentModal}>

                <div className={styles.commentModalHead}>
                    <div>
                        <h2 className={styles.commentTitle}>Upload Report</h2>
                        <p className={styles.commentSubtitle}>{projectId}</p>
                    </div>
                    <button onClick={() => setReportUploadForm(false)} className={styles.CloseBtn}>
                        <X size={14} />
                    </button>
                </div>

                <div className={styles.SopForm}>
                    <div className={styles.SopFormDiv}>

                        <label>Report Name</label>
                        <input name="report_name" value={form.report_name} type="text" placeholder="e.g. Gel Run Image" onChange={handleChange}/>

                        <label>Report Description</label>
                        <textarea name="report_description" value={form.report_description} placeholder="Brief description of this report..." onChange={handleChange} rows={3}/>

                        <label>File</label>
                        <input name="file" type="file" accept=".pdf,.csv,.xlsx,.xls,.docx,.pptx,.png,.jpg,.jpeg" onChange={handleChange} />

                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button className={styles.submitButton} onClick={addReport} disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload Report'}
                    </button>
                </div>

            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}


