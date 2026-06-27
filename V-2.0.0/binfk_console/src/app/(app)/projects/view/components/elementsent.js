import styles from '../ViewComp.module.css'
import axiosApi from '@/lib/api'
import { toastSet } from '@/components/toastfunc'
import { MessageComp } from '@/components/messageComp'
import { useState } from 'react'
import { X } from 'lucide-react'


export function EmailReports({projectId, sec, flow, subNo, EmailTemp}) {


    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "section" : sec,
        "submission" : subNo,
        "email" : "",
        "mail_subject" : "",
        "mail_content" : ""
    })

    const [toast, setToast] = useState(null)

    const [buttonDis, setButtonDis] = useState(false)

    async function sendEmail() {
 
        if(!formData.mail_subject || !formData.mail_content){

            toastSet(setToast, false, "Missing Mail Subject or Content")
            return
        }

        setButtonDis(true)
        
        try{
            const response = await axiosApi.post('/reports/sendemail',
                formData
            )

            const data = response.data
            toastSet(setToast, data.status, data.message)

            setTimeout(() => EmailTemp(false), 2000)
        }
        catch(error){
            console.log(error)
            toastSet(setToast, false, "Error sending mail")
        }
    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

                <div className={styles.modalHeader}>
                    <h3>Send {flow} Report</h3>
                    <button onClick={() => EmailTemp(false)} >X</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.GridTwo}>
                        <div className={styles.formElem}>
                            <label>Select Email</label>
                            <select onChange={handleChange} name="email">
                                <option value="">--Select--</option>
                                <option value="cuesconsole@theracues.com">Console: cuesconsole@theracues.com</option>
                                <option value="projectmgt@theracues.com">Projects: projectmgt@theracues.com</option>
                                <option value="analysis@theracues.com">Analysis: analysis@theracues.com</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.formElemel}>
                        <label>Enter Subject</label>
                        <textarea onChange={handleChange} name="mail_subject" rows = '2' placeholder="Email Subject"/>
                    </div>
                    <div className={styles.formElemel}>
                        <label>Enter mail content</label>
                        <textarea onChange={handleChange} name="mail_content" rows = '8' placeholder="Email body"/>
                    </div>
                    <div className={styles.formElem}>
                        <button onClick={sendEmail} disabled={buttonDis}>
                            {buttonDis ? <>Processing</> : <>SEND</>}
                        </button>
                    </div>
                    {toast && <MessageComp condition={toast.condition} message={toast.message} />}
                </div>

            </div>
        </div>
    )
}




export function QcEdit({ projectId, current, setEditQc, subNo }) {

    const [toast, setToast]  = useState(null)
    const [disButton, setDisButton] = useState(false)

    const [qcFormData, setQcFormData] = useState({
        project_id : projectId,
        submission_no : subNo,
        qc_application : current?.qc_application || "",
        method_summary : current?.method_summary || "",
        concentration_technology : current?.concentration_technology || "",
        integrity_technology : current?.integrity_technology || "",
        qc_summary : current?.qc_summary || "",
        qc_report : null,
        qc_data : null
    })


    const handleChange = (e) => {
        const { name, value } = e.target
        setQcFormData(prev => ({ 
            ...prev, [name]: value 
        }))
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target
        if (files && files.length > 0) {
            setQcFormData(prev => ({ 
                ...prev, [name]: files[0]
             }))
        }
    }

    async function updateQcData() {
        
        const { method_summary, concentration_technology,
            integrity_technology, qc_summary, qc_application } = qcFormData

        if (!qc_application || !method_summary ||
            !concentration_technology || !integrity_technology || !qc_summary) {
            toastSet(setToast, false, "All text fields are required")
            return
        }

        try {
            setDisButton(true)

            const fd = new FormData()
            Object.entries(qcFormData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    fd.append(key, value)
                }
            })

            const response = await axiosApi.post("/project/qcdataedit", 
                fd
            )

            const data = response.data

            if (!data.status) { toastSet(setToast, false, data.message); return }

            toastSet(setToast, true, data.message)
            setTimeout(() => setEditQc(false), 2000)

        } catch (err) {
            console.error(err)
            toastSet(setToast, false, "QC report can't be updated")
        } finally {
            setDisButton(false)
        }
    }

    return (
        <div className={styles.commentOverlay}>
            <div className={styles.commentModal}>

                <div className={styles.commentModalHead}>
                    <div>
                        <h2 className={styles.commentTitle}>Edit QC Data</h2>
                        <p className={styles.commentSubtitle}>
                            {projectId} · QC Submission {subNo}
                        </p>

                    </div>
                    <button className={styles.CloseBtn} onClick={() => setEditQc(false)}>
                        <X size={14}/>
                    </button>
                </div>

                <div className={styles.SopForm}>
                    <div className={styles.SopFormDiv}>

                        <label>QC Application</label>
                        <select name="qc_application" value={qcFormData.qc_application} onChange={handleChange}>
                            <option value="" disabled>Select</option>
                            <option value="RNA">RNA</option>
                            <option value="DNA">DNA</option>
                        </select>


                        <label>Method Summary</label>
                        <textarea name="method_summary" rows="5" value={qcFormData.method_summary} onChange={handleChange}/>


                        <div className={styles.GridTwo}>
                            <div className={styles.formElemel}>
                                <label>Concentration assessed by</label>
                                <select name="concentration_technology" value={qcFormData.concentration_technology} onChange={handleChange}>
                                    <option value="" disabled>Select</option>
                                    <option value="Qubit">Qubit</option>
                                    <option value="NanoDrop">NanoDrop</option>
                                    <option value="NanoDrop & Qubit">NanoDrop &amp; Qubit</option>
                                </select>
                            </div>
                            <div className={styles.formElemel}>
                                <label>Integrity assessed by</label>
                                <select name="integrity_technology" value={qcFormData.integrity_technology} onChange={handleChange}>
                                    <option value="" disabled>Select</option>
                                    <option value="TapeStation">TapeStation</option>
                                    <option value="BioAnalyzer">BioAnalyzer</option>
                                    <option value="Agarose Gel Electrophoresis">Agarose Gel Electrophoresis</option>
                                </select>
                            </div>
                        </div>

                        <label>QC Summary</label>
                        <textarea name="qc_summary" rows="4" value={qcFormData.qc_summary} onChange={handleChange}/>

                        <div className={styles.GridTwo}>
                            <div className={styles.formElemel}>
                                <label>Replace QC Report</label>
                                <input name="qc_report" type="file" accept=".pdf" onChange={handleFileChange}/>
                            </div>
                            <div className={styles.formElemel}>
                                <label>Replace QC Data</label>
                                <input name="qc_data" type="file" accept=".csv" onChange={handleFileChange}/>
                            </div>
                        </div>

                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button className={styles.submitButton} onClick={updateQcData} disabled={disButton}>
                        {disButton ? 'Updating…' : 'Update QC Data'}
                    </button>
                </div>

            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message}/>}
        </div>
    )
}




export function LibQcEdit({ projectId, current, setEditLibQc, subNo }) {

    const [toast, setToast] = useState(null)
    const [disButton, setDisButton] = useState(false)

    const [libQcFormData, setLibQcFormData] = useState({
        project_id : projectId,
        submission_no : subNo,
        library_method : current?.library_method || "",
        library_summary :current?.library_summary || "",
        library_report : null,  
        library_data : null,   
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setLibQcFormData(prev => ({ 
            ...prev, [name]: value 
        }))
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target
        if (files && files.length > 0) {
            setLibQcFormData(prev => ({ 
                ...prev, [name]: files[0]
             }))
        }
    }

    async function updateLibQcData() {


        const { library_method, library_summary } = libQcFormData

        if (!library_method || !library_summary) {
            toastSet(setToast, false, "Method and summary are required")
            return
        }

        try {
            setDisButton(true)

            const fd = new FormData()
            
            Object.entries(libQcFormData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    fd.append(key, value)
                }
            })

            const response = await axiosApi.post("/project/libqcdataedit", fd)
            const data = response.data

            if (!data.status) { toastSet(setToast, false, data.message); return }

            toastSet(setToast, true, data.message)
            setTimeout(() => setEditLibQc(false), 2000)

        } catch (err) {
            console.error(err)
            toastSet(setToast, false, "Library QC can't be updated")
        } finally {
            setDisButton(false)
        }
    }

    return (
        <div className={styles.commentOverlay}>
            <div className={styles.commentModal}>

                <div className={styles.commentModalHead}>
                    <div>
                        <h2 className={styles.commentTitle}>Edit Library QC</h2>
                        <p className={styles.commentSubtitle}>
                            {projectId} · Library QC {subNo}
                        </p>
                    </div>
                    <button className={styles.CloseBtn} onClick={() => setEditLibQc(false)}>
                        <X size={14}/>
                    </button>
                </div>

                <div className={styles.SopForm}>
                    <div className={styles.SopFormDiv}>

                        <div className={styles.GridTwo}>
                            <div className={styles.formElemel}>
                                <label>Library Method</label>
                                <input name="library_method" value={libQcFormData.library_method} type="text" onChange={handleChange}/>
                            </div>
                            <div className={styles.formElemel}>
                                <label>Library Summary</label>
                                <textarea name="library_summary" rows="5" value={libQcFormData.library_summary} onChange={handleChange}/>
                            </div>
                        </div>

                        <div className={styles.GridTwo}>
                            <div className={styles.formElemel}>
                                <label>Replace Library Report</label>
                                <input name="library_report" type="file" accept=".pdf" onChange={handleFileChange}/>
                            </div>
                            <div className={styles.formElemel}>
                                <label>Replace Library QC Data</label>
                                <input name="library_data" type="file" accept=".csv" onChange={handleFileChange}/>
                            </div>
                        </div>

                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button className={styles.submitButton} onClick={updateLibQcData} disabled={disButton} >
                        {disButton ? 'Updating…' : 'Update Library QC'}
                    </button>
                </div>

            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message}/>}
        </div>
    )
}




export function AnalysisEdit({ projectId, current, setEditBinf, subNo }) {

    const [toast, setToast] = useState(null)
    const [disButton, setDisButton] = useState(false)

    const [analysisFormData, setAnalysisFormData] = useState({
        project_id : projectId,
        submission_no : subNo,
        bioinformatics_summary : current?.bioinformatics_summary || "",
        estimated_hours : current?.estimated_hours || "",
        approximate_hours : current?.approximate_hours || "",
        bioinformatics_report : null
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setAnalysisFormData(prev => ({ 
            ...prev, [name]: value 
        }))
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target
        if (files && files.length > 0) {
            setAnalysisFormData(prev => ({ 
                ...prev, [name]: files[0]
             }))
        }
    }

    async function updateBinfData() {

        const { bioinformatics_summary, estimated_hours, approximate_hours } = analysisFormData

        if (!bioinformatics_summary || !estimated_hours || !approximate_hours) {
            toastSet(setToast, false, "Summary and hours are required")
            return
        }

        try {
            setDisButton(true)

            console.log(analysisFormData)

            const fd = new FormData()
            
            Object.entries(analysisFormData).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    fd.append(key, value)
                }
            })

            const response = await axiosApi.post("/project/binfdataedit", fd)
            const data = response.data

            if (!data.status) { toastSet(setToast, false, data.message); return }

            toastSet(setToast, true, data.message)
            setTimeout(() => setEditBinf(false), 2000)

        } catch (err) {
            console.error(err)
            toastSet(setToast, false, "Analysis data can't be updated")
        } finally {
            setDisButton(false)
        }
    }

    return (
        <div className={styles.commentOverlay}>
            <div className={styles.commentModal}>

                <div className={styles.commentModalHead}>
                    <div>
                        <h2 className={styles.commentTitle}>Edit Analysis Report</h2>
                        <p className={styles.commentSubtitle}>
                            {projectId} · Report {subNo}
                        </p>
                    </div>
                    <button className={styles.CloseBtn} onClick={() => setEditBinf(false)}>
                        <X size={14}/>
                    </button>
                </div>

                <div className={styles.SopForm}>
                    <div className={styles.SopFormDiv}>
                        <label>Analysis Summary</label>
                        <textarea name="bioinformatics_summary" rows="5" value={analysisFormData.bioinformatics_summary} onChange={handleChange} />

                        <div className={styles.GridTwo}>
                            <div className={styles.formElemel}>
                                <label>Estimated Hours</label>
                                <input type="number" name="estimated_hours" value={analysisFormData.estimated_hours} onChange={handleChange} />
                            </div>
                            <div className={styles.formElemel}>
                                <label>Approximate Hours Spent</label>
                                <input type="number" name="approximate_hours" value={analysisFormData.approximate_hours} onChange={handleChange}/>
                            </div>
                        </div>

                        <div className={styles.formElemel}>
                            <label>
                                Replace Analysis Report
                            </label>
                            <input name="bioinformatics_report" type="file" accept=".pdf" onChange={handleFileChange}/>
                        </div>

                    </div>
                </div>

                <div className={styles.buttonContainer}>
                    <button className={styles.submitButton} onClick={updateBinfData} disabled={disButton}>
                        {disButton ? 'Updating…' : 'Update Analysis'}
                    </button>
                </div>

            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message}/>}
        </div>
    )
}

/*
export function SampleSubEdit({setQcDataForm, projectId}){

    const [formData, setFormData] = useState({
        "project_id" : projectId,
        "method_writeup" : "",
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
        if(!formData.method_writeup || !formData.method_summary || !formData.concentration_technology ||  
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


    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Edit Client details</h3>
                <button onClick={() => setQcDataForm(false)} >X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>PI Name</label>
                        <input name="pi_name" onChange={handleChange} />
                    </div>
                    <div className={styles.formElem}>
                        <label>Client Email</label>
                        <input name="email" onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Phone</label>
                        <input name="phone" onChange={handleChange} />
                    </div>
                    <div className={styles.formElem}>
                        <label>Organization/Institution</label>
                        <input name="organization" onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Lab/Department</label>
                        <textarea name="lab_dept" onChange={handleChange} />
                    </div>
                    <div className={styles.formElem}>
                        <label>Offering Type</label>
                        <textarea name="offering" onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.formElem}>
                    <button onClick={updateQcData} disabled={disButton} >{disButton ? <>Processing...</> : <>Update details</>}</button>
                </div>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            </div>
        </div>
    )
}*/