import styles from '../ViewComp.module.css'
import axiosApi from '@/lib/api';
import { useState, useEffect } from 'react';
import { EmailReports, QcEdit, LibQcEdit, AnalysisEdit } from './elementsent';
import { MessageComp } from '@/components/messageComp';
import { toastSet } from '@/components/toastfunc';
import { QcReportPushForm, LibQcReportPushForm, BinfReportPushForm, 
    ReportUploadForm, AddTask, AddStakeHolder, DeleteStakeHolder, 
    EditClientData, EditServiceData } from './elemoptions'
import { Pencil, UserPlus, User, Mail, Phone, Building2, FlaskConical, Cpu, Layers, Hash, CalendarDays, CircleDot, Pen} from 'lucide-react'
import { CheckSquare, Trash2, Check } from 'lucide-react'
import { RefreshCw, Send, Download } from 'lucide-react'
import { Microscope, Upload, Plus, File, FileText  } from 'lucide-react'
import { Library } from 'lucide-react'
import { BrainCircuit,Clock } from 'lucide-react'
import {  Files } from 'lucide-react'



function Field({ label, value, mono = false, icon: Icon, deleteBtn, projId }) {

    const [deleteSH, setDeleteSH] = useState(false) 

    return (
        <div className={styles.OvField}>
            <div className={styles.OvFieldLabel}>
                {Icon && <Icon size={10} className={styles.OvFieldLabelIcon} />}
                {label}
                {deleteBtn ? <button title='Delete' onClick={() => setDeleteSH(true)} className={styles.OvEditBtn}>{deleteBtn}</button> : ``}
            </div>
            <div className={`${styles.OvFieldValue} ${mono ? styles.OvFieldValueMono : ''}`}>
                {value || '—'}
            </div>
            {deleteSH && <DeleteStakeHolder projId={projId} name={label} email={value} setDeleteSH={setDeleteSH}/>}
        </div>
  )
}
 
function SectionCard({ title, icon: Icon, onEdit, children, action }) {
  return (
    <div className={styles.OvCard}>
        <div className={styles.OvCardHeader}>
            <div className={styles.OvCardHeaderLeft}>
                <div className={styles.OvCardIcon}><Icon size={14} /></div>
                    <span className={styles.OvCardTitle}>{title}</span>
                </div>
                <div className={styles.OvCardHeaderRight}>
                    {action}
                    {onEdit && (
                        <button className={styles.OvEditBtn} onClick={onEdit}>
                            <Pencil size={12} /> Edit
                        </button>
                    )}
                </div>
            </div>
        <div className={styles.OvCardBody}>{children}</div>
    </div>
  )
}
 
function StatusPill({ status }) {
    const s = (status || '').toLowerCase()
    let cls = styles.PillDefault
    if (s === 'completed') cls = styles.PillGreen
    else if (s.includes('qc')) cls = styles.PillAmber
    else if (s.includes('library')) cls = styles.PillBlue
    else if (s.includes('bio')) cls = styles.PillPurple
    else if (s === 'accepted') cls = styles.PillIndigo
    else if (s === 'closed') cls = styles.PillRed
    return <span className={`${styles.Pill} ${cls}`}><CircleDot size={9}/>{status || '—'}</span>
}
 

export function OverView({ projectCont, onEditClient, onEditService }) {
 
    const createdAt = projectCont.created_at? new Date(projectCont.created_at).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        }) : '—'

    const [addStakeHolder, setAddStakeHolder] = useState(false)
    const [editClient, setEditClient] = useState(false)
    const [editService, setEditService] = useState(false)


    return (
            <div className={styles.OvRoot}>
        

                <div className={styles.OvHero}>
                    <div className={styles.OvHeroLeft}>
                    <div className={styles.OvHeroIdLabel}>Project ID</div>
                    <div className={styles.OvHeroId}>{projectCont.project_id}</div>
                    <StatusPill status={
                        typeof projectCont.project_status === 'string'
                        ? projectCont.project_status
                        : '—'
                    } />
                    </div>
            
                    <div className={styles.OvHeroMeta}>
                    <div className={styles.OvHeroMetaItem}>
                        <div className={styles.OvHeroMetaLabel}>Offering</div>
                        <div className={styles.OvHeroMetaValue}>{projectCont.offering_type || '—'}</div>
                    </div>
                    <div className={styles.OvHeroMetaItem}>
                        <div className={styles.OvHeroMetaLabel}>Service</div>
                        <div className={styles.OvHeroMetaValue}>{projectCont.service_name || '—'}</div>
                    </div>
                    <div className={styles.OvHeroMetaItem}>
                        <div className={styles.OvHeroMetaLabel}>Platform</div>
                        <div className={styles.OvHeroMetaValue}>{projectCont.platform || '—'}</div>
                    </div>
                    <div className={styles.OvHeroMetaItem}>
                        <div className={styles.OvHeroMetaLabel}>Completion</div>
                        <div className={styles.OvHeroMetaValue}>{projectCont.project_completion ?? '—'}</div>
                    </div>
                    </div>
            
                    <div className={styles.OvHeroAudit}>
                    <div className={styles.OvAuditRow}>
                        <User size={11} />
                        <span>{projectCont.created_by || '—'}</span>
                    </div>
                    <div className={styles.OvAuditRow}>
                        <Mail size={11} />
                        <span className={styles.OvAuditMono}>{projectCont.created_by_email || '—'}</span>
                    </div>
                    <div className={styles.OvAuditRow}>
                        <CalendarDays size={11} />
                        <span className={styles.OvAuditMono}>{createdAt}</span>
                    </div>
                    </div>
                </div>
        

                <SectionCard title="Client Information" icon={User} onEdit={onEditClient} action={
                    <button className={styles.OvStakeholderBtn} onClick={() => setEditClient(true)}>
                        <Pencil size={12} /> Edit Client Details
                    </button>
                    }>
                    <div className={`${styles.OvGrid} ${styles.OvGrid2}`} style={{ marginBottom: 10 }}>
                    <Field label="PI Name" value={projectCont.pi_name} icon={User} />
                    <Field label="Email" value={projectCont.email} icon={Mail} mono />
                    </div>
                    <div className={`${styles.OvGrid} ${styles.OvGrid4}`}>
                    <Field label="Phone" value={projectCont.phone} icon={Phone} mono />
                    <Field label="Institution" value={projectCont.institution} icon={Building2} />
                    <Field label="Lab / Dept." value={projectCont.lab_dept} />
                    <Field label="Offering Type" value={projectCont.offering_type} />
                    </div>
                </SectionCard>


                <SectionCard
                    title="Service Information"
                    icon={FlaskConical}
                    onEdit={onEditService}
                    action={
                    <button className={styles.OvStakeholderBtn} onClick={() => setEditService(true)}>
                        <Pencil size={12} /> Edit Service Details
                    </button>
                    }
                >
                    <div className={`${styles.OvGrid} ${styles.OvGrid3}`}>
                    <Field label="Service Name" value={projectCont.service_name} icon={Layers} />
                    <Field label="Platform" value={projectCont.platform} icon={Cpu} />
                    {projectCont.sample_class? <Field label="Sample Class" value={projectCont.sample_class}/> : null}
                    <Field label="Sample Type" value={projectCont.sample_type} />
                    <Field label="Sample Count" value={projectCont.sample_number} icon={Hash} mono />
                    <Field label="Extraction" value={projectCont.sample_extraction_needed.charAt(0).toUpperCase() + projectCont.sample_extraction_needed.slice(1)} />
                    </div>
                </SectionCard>

                <SectionCard
                    title="Stake holders"
                    icon={FlaskConical}
                    onEdit={onEditService}
                    action={
                        <>
                            <button className={styles.OvStakeholderBtn} onClick={() => setAddStakeHolder(true)}>
                                <UserPlus size={12} /> Add Stakeholder
                            </button>
                        </>
                    }
                >
                    <div className={`${styles.OvGrid} ${styles.OvGrid4}`}>
                        {
                        projectCont.project_stakeholders.map((stakeh, ids) => (
                            <Field 
                                key={ids} label={stakeh.name} value={stakeh.email} icon={Mail} mono deleteBtn={<Trash2 size={9}/>} projId={projectCont.project_id} />
                        ))
                        }
                    </div>
                </SectionCard>
                {addStakeHolder && <AddStakeHolder projectId={projectCont.project_id} setAddStakeHolder={setAddStakeHolder}/>}
                {editClient && <EditClientData projectCont={projectCont} setEditClient={setEditClient}/>}
                {editService && <EditServiceData projectCont={projectCont} setEditService={setEditService}/>}
            </div>
    )
}



export function StatusPop({ projectCont }) {

    const [toast, setToast] = useState(null)
    const [taskAdd, setTaskAdd] = useState(false)

    async function updateTaskstage(sec, projectId, task) {

        try { 

            const response = await axiosApi.post("/project/taskstatusupdate", {
                "project_id": projectId,
                "task": task,
                "sec": sec
            })

            const data = response.data

            if (!data.status) {
                setToast({ condition: false, message: data.message })
                setTimeout(() => setToast(null), 2000)
                return
            }

            setToast({ condition: true, message: data.message })
            setTimeout(() => setToast(null), 2000)

        } catch (err) {

            console.log(err)
            setToast({ condition: false, message: "Updating task failed" })
            setTimeout(() => setToast(null), 2000)
        }
    }

    async function deleteTask(sec, projectId, task) {

        const confirmAction = window.confirm("You are going to delete this task, Do you want to proceed")
        if (!confirmAction) return

        try {

            const response = await axiosApi.post("/project/taskdelete", {
                "project_id": projectId,
                "task": task,
                "sec": sec
            })

            const data = response.data
            toastSet(setToast, data.status, data.message)

        } catch (er) {

            console.log(er)
            toastSet(setToast, false, "Error deleting the task")
        }
    }

    const stdDone = projectCont.std_del.filter(t => t.completed).length
    const addDone = projectCont.add_del.filter(t => t.completed).length

    return (
        <div className={styles.TasksRoot}>

            <div className={styles.TasksPanel}>
                <div className={styles.TasksPanelHeader}>
                    <div className={styles.TasksPanelHeaderLeft}>
                        <CheckSquare size={14} className={styles.TasksPanelIcon} />
                        <span className={styles.TasksPanelTitle}>Standard Deliverables</span>
                    </div>
                    <span className={styles.TasksCounter}>
                        {stdDone}/{projectCont.std_del.length}
                    </span>
                </div>

                <div className={styles.TasksList}>
                    {projectCont.std_del.map((stdDel) => (
                        <div
                            key={stdDel.task_number}
                            className={`${styles.TaskRow} ${stdDel.completed ? styles.TaskRowDone : ''}`}
                        >
                            <span className={styles.TaskRowNum}>{stdDel.task_number + 1}</span>
                            <span className={`${styles.TaskRowLabel} ${stdDel.completed ? styles.TaskRowLabelDone : ''}`}>
                                {stdDel.label}
                            </span>
                            <div className={styles.TaskRowBtns}>
                                <button
                                    className={styles.TaskDelBtn}
                                    onClick={() => deleteTask("std", projectCont.project_id, stdDel.task_number)}
                                    disabled={stdDel.completed}
                                    title="Delete task"
                                >
                                    <Trash2 size={13} />
                                </button>
                                <button
                                    className={`${styles.TaskCheckBtn} ${stdDel.completed ? styles.TaskCheckBtnDone : ''}`}
                                    onClick={() => updateTaskstage("std", projectCont.project_id, stdDel.task_number)}
                                    disabled={stdDel.completed}
                                    title="Mark complete"
                                >
                                    <Check size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.TasksPanel}>
                <div className={styles.TasksPanelHeader}>
                    <div className={styles.TasksPanelHeaderLeft}>
                        <Plus size={14} className={styles.TasksPanelIconGreen} />
                        <span className={styles.TasksPanelTitle}>Added Tasks</span>
                    </div>
                    <div className={styles.TasksPanelHeaderRight}>
                        <span className={styles.TasksCounter}>
                            {addDone}/{projectCont.add_del.length}
                        </span>
                        <button className={styles.TasksAddBtn} onClick={() => setTaskAdd(true)}>
                            <Plus size={12} /> Add
                        </button>
                    </div>
                </div>

                <div className={styles.TasksList}>
                    {projectCont.add_del.length === 0 ? (
                        <div className={styles.TasksEmpty}>
                            No additional tasks yet
                        </div>
                    ) : (
                        projectCont.add_del.map((addDel) => (
                            <div
                                key={addDel.task_number}
                                className={`${styles.TaskRow} ${addDel.completed ? styles.TaskRowDone : ''}`}
                            >
                                <span className={`${styles.TaskRowLabel} ${addDel.completed ? styles.TaskRowLabelDone : ''}`}>
                                    {addDel.label}
                                </span>
                                <div className={styles.TaskRowBtns}>
                                    <button
                                        className={styles.TaskDelBtn}
                                        onClick={() => deleteTask("adel", projectCont.project_id, addDel.task_number)}
                                        disabled={addDel.completed}
                                        title="Delete task"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                    <button
                                        className={`${styles.TaskCheckBtn} ${addDel.completed ? styles.TaskCheckBtnDone : ''}`}
                                        onClick={() => updateTaskstage("adel", projectCont.project_id, addDel.task_number)}
                                        disabled={addDel.completed}
                                        title="Mark complete"
                                    >
                                        <Check size={13} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {taskAdd && <AddTask projectId={projectCont.project_id} setTaskAdd={setTaskAdd} />}
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}

        </div>
    )
}


function Fields({ label, value }) {
    const display = value === true ? 'Yes'
        : value === false ? 'No'
        : (value === '' || value === null || value === undefined) ? '—'
        : String(value)
 
    return (
        <div className={styles.OvField}>
            <div className={styles.OvFieldLabel}>{label}</div>
            <div className={styles.OvFieldValue}>{display}</div>
        </div>
    )
}
 
 
export function SampleSubDetails({ projectCont}) {
 
    const [toast, setToast] = useState(null)
    const [disButton, setDisButton] = useState(false)
    const [activeIdx, setActiveIdx] = useState(0)
    const [samsubDetails, setSamsubDetails] = useState([])
 
    const submissions = Array.isArray(samsubDetails) ? samsubDetails : []
    const current = submissions[activeIdx] ?? null
    const details = current?.details ?? {}
 
    const submittedAt = details?.audit?.submitted_at ? new Date(details.audit.submitted_at).toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
          }): null

    useEffect(() => {
        SampleSub(projectCont.project_id)
    }, [projectCont?.project_id])
 
    async function SampleSub(projectId) {

        try {

            const response = await axiosApi.post("/project/samsubdetails", { project_id: projectId })
            const data = response.data

            if (!data.status) {
                setToast({ condition: false, message: data.message })
                setTimeout(() => setToast(null), 3000)
                return
            }

            setSamsubDetails(data.payload)
            setActiveIdx(0)

        } catch (error) {

            console.log(error)
            setToast({ condition: false, message: "Error fetching sample submission details" })
            setTimeout(() => setToast(null), 3000)

        }
    }
 
    async function SamSubResend(projectId) {

        if (!window.confirm("Do you want to resend the submission link to the client?")) return

        setDisButton(true)

        try {

            const response = await axiosApi.post("/initialization/samsubresend", { project_id: projectId })
            const data = response.data
            toastSet(setToast, data.status, data.message)

        } catch (err) {

            console.log(err)
            toastSet(setToast, false, "Error sending sample submission form")

        } finally {
            setDisButton(false)
        }
    }
 
    async function samsubFetch(projectId, submissionNo, formatReq) {

        if (!projectId) { toastSet(setToast, false, "Please restart the page"); return }

        try {

            const response = await axiosApi.post("/reports/samplesubreportpdf",
                { 
                    project_id: projectId,
                    submission_number : submissionNo,
                    format_req : formatReq

                }, { responseType: "blob" })

            if (formatReq === ".pdf"){

                const blob = new Blob([response.data], { type: "application/pdf" })
                const url  = window.URL.createObjectURL(blob)

                window.open(url, "_blank")
                setTimeout(() => window.URL.revokeObjectURL(url), 1000)
            }

            if (formatReq === ".csv") {

                const blob = new Blob([response.data], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = `samplesubmission_${projectId}_${submissionNo}.csv`;

                document.body.appendChild(a);
                a.click();
                a.remove();

                window.URL.revokeObjectURL(url);
            }

        } catch {
            toastSet(setToast, false, "Cannot connect to the server")
        }
    }
 
    return (
        <div className={styles.SsRoot}>
 
            <div className={styles.SsTopBar}>
                <div className={styles.SsTopBarLeft}>
                    <FlaskConical size={15} className={styles.SsTopBarIcon} />
                    <div>
                        <div className={styles.SsTopBarTitle}>Sample Submission</div>
                        <div className={styles.SsTopBarSub}>
                            {submissions.length > 0
                                ? `${submissions.length} submission${submissions.length > 1 ? 's' : ''} found for the project`
                                : 'Nothing here yet. Try refreshing, or check back later'}
                        </div>
                    </div>
                </div>
                <div className={styles.SsTopBarActions}>
                    <button className={styles.SsBtn} onClick={() => SampleSub(projectCont.project_id)}>
                        <RefreshCw size={12} /> Refresh
                    </button>
                    <button className={`${styles.SsBtn} ${styles.SsBtnBlue}`} onClick={() => SamSubResend(projectCont.project_id)} disabled={disButton}>
                        <Send size={12} /> {disButton ? 'Sending…' : 'Resend Link'}
                    </button>
                </div>
            </div>

            {submissions.length === 0 ? (
                <div className={styles.SsEmpty}>
                    <FlaskConical size={34} className={styles.SsEmptyIcon} />
                    <span>Nothing here yet. <strong>Refresh</strong>, or check back later</span>
                </div>
            ) : (
                <div className={styles.SsBody}>
 
                    <div className={styles.SsVersionBar}>
                        <div className={styles.SsVersionBarLabel}>Submissions</div>
                        {submissions.map((sub, i) => (
                            <button
                                key={i}
                                className={`${styles.SsVersionBtn} ${i === activeIdx ? styles.SsVersionBtnActive : ''}`}
                                onClick={() => setActiveIdx(i)}
                            >
                                <span className={styles.SsVersionNum}>Submission {sub.submission_number ?? i + 1}</span>
                                <span className={styles.SsVersionSub}>{sub.service_technology || '—'}</span>
                            </button>
                        ))}
                    </div>
 
                    <div className={styles.SsDetail}>
 
                        <div className={styles.SsDetailStrip}>
                            <div className={styles.SsDetailStripLeft}>
                                <span className={styles.SsDetailV}>
                                    Submission number {current?.submission_number ?? activeIdx + 1}
                                </span>
                            </div>
                            {submittedAt && (
                                <div className={styles.SsDetailDate}>
                                    <CalendarDays size={11} /> {submittedAt}
                                </div>
                            )}
                            <div className={styles.SsDetailFooter}>
                                <button className={styles.SsBtn}onClick={() => samsubFetch(projectCont.project_id, activeIdx+1, ".pdf")}><Download size={12} /> Download Form</button>
                                <button className={styles.SsBtn}onClick={() => samsubFetch(projectCont.project_id, activeIdx+1, ".csv")}><Download size={12} /> Download .csv</button>
                            </div>
                        </div>
 
                        {current?.project_description && (
                            <div className={styles.SsDesc}>{current.project_description}</div>
                        )}
 
                        <div className={`${styles.OvGrid} ${styles.OvGrid3}`}>
                            <Fields label="Application" value={details.application} />
                            <Fields label="Technology" value={current?.service_technology} />
                            <Fields label="Total RNA Prep" value={details.total_rna_prep} />
                        </div>
 
                        <div className={`${styles.OvGrid} ${styles.OvGrid3}`}>
                            <Fields label="Replicates" value={details.replicates} />
                            <Fields label="Extraction Needed" value={details.extraction_needed} />
                            <Fields label="Bioinformatics" value={details.bioinformatics_required} />
                            <Fields label="Nucleases" value={details.nucleases} />
                            <Fields label="Kit Name" value={details.kit_name} />
                            <Fields label="QC Assessed" value={details.qc_assessed} />
                        </div>
 
                        {(details.key_objectives || details.comparisons ||
                          details.additional_analysis || details.reference_studies) && (
                            <div className={`${styles.OvGrid} ${styles.OvGrid2}`}>
                                <Fields label="Key Objectives" value={details.key_objectives} />
                                <Fields label="Comparisons (DE)" value={details.comparisons} />
                                <Fields label="Additional Analysis" value={details.additional_analysis} />
                                <Fields label="Reference Studies" value={details.reference_studies} />
                            </div>
                        )}

                        {details.sample_details?.length > 0 && (
                            <div className={styles.SsTableWrap}>
                                <div className={styles.SsTableLabel}>
                                    Sample Details
                                    <span className={styles.SsTableCount}>
                                        {details.sample_details.length} samples
                                    </span>
                                </div>
                                <div className={styles.SsTableScroll}>
                                    <table className={styles.SsTable}>
                                        <thead>
                                            <tr>
                                                <th>Sample ID</th>
                                                {details.sample_details.some(s => s.tc_sample_id) ? <th>tC Sample ID</th> : null}
                                                <th>Organism and Sample Orgin</th>
                                                <th>Conc.</th>
                                                <th>Notes</th>
                                                <th>Replicate Group</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {details.sample_details.map((s, i) => (
                                                <tr key={i}>
                                                    <td className={styles.SsTdMono}>{s.sample_id}</td>
                                                    {s.tc_sample_id ? <td className={styles.SsTdMono}>{s.tc_sample_id}</td> : ``}
                                                    <td>{s.description}</td>
                                                    <td className={styles.SsTdMono}>{s.concentration}</td>
                                                    <td>{s.notes}</td>
                                                    <td className={styles.SsTdMono}>{s.replicate_group}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
 
 
                    </div>
                </div>
            )}
 
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}


export function QcDetails({ projectCont }) {
 
    const [qcDataForm, setQcDataForm] = useState(false)
    const [qcEmailTemp, setQcEmailTemp] = useState(false)
    const [toast, setToast] = useState(null)
    const [activeIdx, setActiveIdx] = useState(0)
    const[qcDetails, setQcDetails] = useState([])
    const [editQc, setEditQc] = useState(false)
 
    const reports   = Array.isArray(qcDetails) ? qcDetails : []
    const current   = reports[activeIdx] ?? null

    useEffect(() => {
        QcSub(projectCont.project_id)
    }, [projectCont?.project_id])
 

    async function QcSub(projectId) {

        try {

            const response = await axiosApi.post("/project/qcsubdetails", { project_id: projectId })
            const data = response.data

            if (!data.status){ 
                toastSet(setToast, false, data.message); 
                return 
            }

            setQcDetails(data.payload)
            setActiveIdx(0)

        } catch (error) {
            console.log(error)
            toastSet(setToast, false, "Error fetching QC details")
        }
    }
 
    async function qcReportsFetch(projectId, subNo, formatReq) {

        if (!projectId){ 
            toastSet(setToast, false, "Please refresh the page"); 
            return 
        }
        try {

            const response = await axiosApi.post("/reports/genqcreportpdf",
                { 
                    project_id: projectId,
                    submission_number : subNo,
                    format_req : formatReq

                }, { responseType: "blob" })

            if(formatReq === ".pdf"){

                const blob = new Blob([response.data], { type: "application/pdf" })
                const url  = window.URL.createObjectURL(blob)

                window.open(url, "_blank")
                setTimeout(() => window.URL.revokeObjectURL(url), 1000)

            }

            if (formatReq === ".csv") {

                const blob = new Blob([response.data], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = `qc_${projectId}_${subNo}.csv`;

                document.body.appendChild(a);
                a.click();
                a.remove();

                window.URL.revokeObjectURL(url);
            }

        } catch (error) {
            console.log(error)
            toastSet(setToast, false, "Error downloading report")
        }
    }
 
   
    const auditDate = current?.qc_audit?.completed_at? new Date(current.qc_audit.completed_at).toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
    }) : null
 

 
    return (
        <div className={styles.SsRoot}>
 
            <div className={styles.SsTopBar}>
                <div className={styles.SsTopBarLeft}>
                    <Microscope size={15} className={styles.SsTopBarIcon} />
                    <div>
                        <div className={styles.SsTopBarTitle}>QC Details</div>
                        <div className={styles.SsTopBarSub}>
                            {reports.length > 0
                                ? `${reports.length} QC run${reports.length > 1 ? 's' : ''}`
                                : 'Nothing here yet. Try refreshing to check'}
                        </div>
                    </div>
                </div>
                <div className={styles.SsTopBarActions}>
                    <button className={styles.SsBtn} onClick={() => QcSub(projectCont.project_id)}><RefreshCw size={12} /> Refresh</button>
                    <button className={`${styles.SsBtn} ${styles.SsBtnPrimary}`} onClick={() => setQcDataForm(true)}><Upload size={12} /> Upload QC</button>
                    <a href='/sample-submission-templates/qc_template.csv' download>
                        <button className={styles.SsBtn}><Download size={12} /> RNA Template</button>
                    </a>
                    <a href='/sample-submission-templates/qc_template_dna.csv' download>
                        <button className={styles.SsBtn}><Download size={12} /> DNA Template</button>
                    </a>
                </div>
            </div>
 
            {reports.length === 0 ? (
                <div className={styles.SsEmpty}>
                    <Microscope size={34} className={styles.SsEmptyIcon} />
                    <span>Nothing here yet <strong>Refresh</strong>, to fetch QC data</span>
                </div>
            ) : (
                <div className={styles.SsBody}>
                    <div className={styles.SsVersionBar}>
                        <div className={styles.SsVersionBarLabel}>Runs</div>
                        {reports.map((r, i) => {
                            const label = r.qc_audit?.completed_at
                                ? new Date(r.qc_audit.completed_at).toLocaleDateString('en-IN', {day: '2-digit', month: 'short'}) : `QC Submission ${i + 1}`
                            return (
                                <button key={i} className={`${styles.SsVersionBtn} ${i === activeIdx ? styles.SsVersionBtnActive : ''}`} onClick={() => setActiveIdx(i)}>
                                    <span className={styles.SsVersionNum}>QC {i + 1}</span>
                                    <span className={styles.SsVersionSub}>{label}</span>
                                </button>
                            )
                        })}
                    </div>
 
                    <div className={styles.SsDetail}>
                        <div className={styles.SsDetailStrip}>
                            <div className={styles.SsDetailStripLeft}>
                                <span className={styles.SsDetailV}>QC N0: {activeIdx + 1}</span>
                            </div>
                            {auditDate && (
                                <div className={styles.SsDetailDate}>
                                    <CalendarDays size={11} /> {auditDate}
                                    {current?.qc_audit?.updated_user && (
                                        <span style={{ marginLeft: 6 }}>· {current.qc_audit.updated_user}</span>
                                    )}
                                </div>
                            )}
                        <div className={styles.SsDetailFooter}>
                            <button className={styles.SsBtn} onClick={() => setEditQc(true) }><Pen size={12} /> Edit</button>
                            <button className={styles.SsBtn} onClick={() => qcReportsFetch(projectCont.project_id, activeIdx+1, ".pdf")}><Download size={12} /> Download QC .pdf</button>
                            <button className={styles.SsBtn} onClick={() => qcReportsFetch(projectCont.project_id, activeIdx+1, ".csv")}><Download size={12} /> Download QC .csv</button>
                            <button className={`${styles.SsBtn} ${styles.SsBtnBlue}`} onClick={() => setQcEmailTemp(true)}><Mail size={12} /> Send QC Report</button>
                        </div>
                        </div>
                        
 

                        <div className={`${styles.OvGrid} ${styles.OvGrid2}`}>
                            <Fields label="Qc Application" value={current?.qc_application} />
                            <Fields label="Method Summary" value={current?.method_summary} />
                        </div>
 
                        <div className={`${styles.OvGrid} ${styles.OvGrid3}`}>
                            <Fields label="Concentration measured by" value={current?.concentration_technology} />
                            <Fields label="Integrity measured by" value={current?.integrity_technology} />
                            <Fields label="QC Summary" value={current?.qc_summary} />
                        </div>

                        {current?.qc_report && (
                            <div className={styles.QcPdfWrap}>
                                <div className={styles.QcPdfLabel}>
                                    <FileText size={12} /> QC Report
                                </div>
                                <div className={styles.QcPdfEmbed}>
                                    <iframe
                                        src={`${process.env.NEXT_PUBLIC_TCONSOLE_API_BASE_URL}${current.qc_report_url}`}
                                        width="100%"
                                        height="480px"
                                        style={{ border: 'none', borderRadius: '6px', display: 'block' }}
                                        title="QC Report PDF"
                                    />
                                </div>
                            </div>
                        )}
 
                        {current?.qc_sample_details?.length > 0 && (
                            <div className={styles.SsTableWrap}>
                                <div className={styles.SsTableLabel}>
                                    QC Sample Data
                                    <span className={styles.SsTableCount}>
                                        {current.qc_sample_details.length} samples
                                    </span>
                                </div>
                                <div className={styles.SsTableScroll}>
                                    {
                                        current?.qc_application === "RNA" ?
                                        <>
                                            <table className={styles.SsTable}>
                                                <thead>
                                                    <tr>
                                                        <th>Sample ID</th>
                                                        <th>theraCUES ID</th>
                                                        <th>Conc. (ng/µl)</th>
                                                        <th>Integrity</th>
                                                        <th>Comments</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {current.qc_sample_details.map((s, i) => (
                                                        <tr key={i}>
                                                            <td className={styles.SsTdMono}>{s.sample_id}</td>
                                                            <td className={styles.SsTdMono}>{s.tcues_sample_id}</td>
                                                            <td className={styles.SsTdMono}>{s.nucleic_acid_conc}</td>
                                                            <td className={styles.SsTdMono}>{s.integrity}</td>
                                                            <td className={styles.SsTdMono}>{s.comments}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                        :
                                        current?.qc_application === "DNA" ?
                                        <>
                                            <table className={styles.SsTable}>
                                                <thead>
                                                    <tr>
                                                        <th>Sample ID</th>
                                                        <th>theraCUES ID</th>
                                                        <th>Nanodrop Conc. (ng/µl)</th>
                                                        <th>A 260/280</th>
                                                        <th>A 230/260</th>
                                                        <th>Quibit Conc. (ng/µl)</th>
                                                        <th>Comments</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {current.qc_sample_details.map((s, i) => (
                                                        <tr key={i}>
                                                            <td className={styles.SsTdMono}>{s.sample_id}</td>
                                                            <td className={styles.SsTdMono}>{s.tcues_sample_id}</td>
                                                            <td className={styles.SsTdMono}>{s.conc_f}</td>
                                                            <td className={styles.SsTdMono}>{s.purity_ratio_f}</td>
                                                            <td className={styles.SsTdMono}>{s.purity_ratio_s}</td>
                                                            <td className={styles.SsTdMono}>{s.conc_s}</td>
                                                            <td className={styles.SsTdMono}>{s.comments}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </>
                                        :
                                        ``
                                    }
                                </div>
                            </div>
                        )}
 
 
                    </div>
                </div>
            )}
            {qcDataForm && <QcReportPushForm projectId={projectCont.project_id} setQcDataForm={setQcDataForm} />}
            {qcEmailTemp && <EmailReports projectId={projectCont.project_id} sec="qc" flow="QC" subNo ={activeIdx+1} EmailTemp={setQcEmailTemp} />}
            {editQc && <QcEdit projectId={projectCont.project_id} current={current} setEditQc={setEditQc} subNo={activeIdx+1}/>}
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    )
}







export function LibSamDetails({ projectCont }) {
 
    const [libQcDataForm, setLibQcDataForm] = useState(false)
    const [libqcEmailTemp, setLibqcEmailTemp] = useState(false)
    const [libqcDetails, setLibqcDetails] = useState([])
    const [toast, setToast]   = useState(null)
    const [activeIdx, setActiveIdx] = useState(0)
    const [editLibQc, setEditLibQc] = useState(false)
 
    const reports  = Array.isArray(libqcDetails) ? libqcDetails : []
    const current  = reports[activeIdx] ?? null
 

    const audit    = current?.lib_audit ?? {}
    const auditDate = audit?.completed_at ? new Date(audit.completed_at).toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
          }) : null

    useEffect(() => {
        LibSub(projectCont.project_id)
    }, [projectCont?.project_id])
 

    async function LibSub(projectId) {

        try {

            const response = await axiosApi.post("/project/libqcsubdetails", { project_id: projectId })
            const data = response.data

            if (!data.status) {
                 toastSet(setToast, false, data.message); 
                 return 
            }

            setLibqcDetails(data.payload)
            setActiveIdx(0)

        } catch (err) {
            console.log(err)
            toastSet(setToast, false, "Error fetching library QC details")
        }
    }
 
    async function libqcReportsFetch(projectId, subNo, formatReq) {

        if (!projectId) { toastSet(setToast, false, "Please refresh the page"); return }

        try {

            const response = await axiosApi.post("/reports/genlibqcreportpdf",
                { 
                    project_id: projectId,
                    submission_number : subNo,
                    format_req : formatReq

                }, { responseType: "blob" })

            if(formatReq === ".pdf"){

                const blob = new Blob([response.data], { type: "application/pdf" })
                const url  = window.URL.createObjectURL(blob)
                window.open(url, "_blank")
                setTimeout(() => window.URL.revokeObjectURL(url), 1000)
            }

            if (formatReq === ".csv") {

                const blob = new Blob([response.data], { type: "text/csv" });
                const url = window.URL.createObjectURL(blob);

                const a = document.createElement("a");
                a.href = url;
                a.download = `libqc_${projectId}_${subNo}.csv`;

                document.body.appendChild(a);
                a.click();
                a.remove();

                window.URL.revokeObjectURL(url);
            }

        } catch (error) {
            console.log(error)
            toastSet(setToast, false, "Error downloading report")
        }
    }
 
    return (
        <div className={styles.SsRoot}>
 
            <div className={styles.SsTopBar}>
                <div className={styles.SsTopBarLeft}>
                    <Library size={15} className={styles.SsTopBarIcon} />
                    <div>
                        <div className={styles.SsTopBarTitle}>Library QC</div>
                        <div className={styles.SsTopBarSub}>
                            {reports.length > 0
                                ? `${reports.length} run${reports.length > 1 ? 's' : ''} library QC's found`
                                : 'Nothing here yet. Try refreshing to check'}
                        </div>
                    </div>
                </div>
                <div className={styles.SsTopBarActions}>
                    <button className={styles.SsBtn} onClick={() => LibSub(projectCont.project_id)}>
                        <RefreshCw size={12} /> Refresh
                    </button>
                    <button
                        className={`${styles.SsBtn} ${styles.SsBtnPrimary}`}
                        onClick={() => setLibQcDataForm(true)}
                    >
                        <Upload size={12} /> Upload Lib QC
                    </button>
                    <a href='/sample-submission-templates/lib_qc_template.csv' download>
                        <button className={styles.SsBtn}>
                            <Download size={12} /> Template
                        </button>
                    </a>
                </div>
            </div>
 
            {reports.length === 0 ? (
                <div className={styles.SsEmpty}>
                    <Library size={34} className={styles.SsEmptyIcon} />
                    <span>Nothing here yet. <strong>Refresh</strong>, to fetch Library QC data</span>
                </div>
            ) : (
                <div className={styles.SsBody}>
 
                    <div className={styles.SsVersionBar}>
                        <div className={styles.SsVersionBarLabel}>Runs</div>
                        {reports.map((r, i) => {
                            const a = r.lib_audit ?? {}
                            const label = a.completed_at
                                ? new Date(a.completed_at).toLocaleDateString('en-IN', {
                                      day: '2-digit', month: 'short'
                                  })
                                : `Run ${i + 1}`
                            return (
                                <button
                                    key={i}
                                    className={`${styles.SsVersionBtn} ${i === activeIdx ? styles.SsVersionBtnActive : ''}`}
                                    onClick={() => setActiveIdx(i)}
                                >
                                    <span className={styles.SsVersionNum}>Lib QC {i + 1}</span>
                                    <span className={styles.SsVersionSub}>{label}</span>
                                </button>
                            )
                        })}
                    </div>
 
                    <div className={styles.SsDetail}>
 
                        <div className={styles.SsDetailStrip}>
                            <div className={styles.SsDetailStripLeft}>
                                <span className={styles.SsDetailV}>Library QC {activeIdx + 1}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                                {auditDate && (
                                    <div className={styles.SsDetailDate}>
                                        <CalendarDays size={11} /> {auditDate}
                                    </div>
                                )}
                                {audit.updated_user && (
                                    <div className={styles.SsDetailDate}>
                                        <User size={11} /> {audit.updated_user}
                                    </div>
                                )}
                            </div>
                        <div className={styles.SsDetailFooter}>
                            <button className={styles.SsBtn} onClick={() => setEditLibQc(true)}><Pen size={12} /> Edit</button>
                            <button className={styles.SsBtn} onClick={() => libqcReportsFetch(projectCont.project_id, activeIdx+1, ".pdf")}>
                                <Download size={12} /> Download .pdf
                            </button>
                            <button className={styles.SsBtn} onClick={() => libqcReportsFetch(projectCont.project_id, activeIdx+1, ".csv")}>
                                <Download size={12} /> Download .csv
                            </button>
                            <button className={`${styles.SsBtn} ${styles.SsBtnBlue}`} onClick={() => setLibqcEmailTemp(true)} >
                                <Mail size={12} /> Send Lib QC
                            </button>
                        </div>
                        </div>
 
                        <div className={`${styles.OvGrid} ${styles.OvGrid2}`}>
                            <Fields label="Library Method"  value={current?.library_method} />
                            <Fields label="Library Summary" value={current?.library_summary} />
                        </div>
 
                        {current?.library_report && (
                            <div className={styles.QcPdfWrap}>
                                <div className={styles.QcPdfLabel}>
                                    <FileText size={12} /> Library QC Report
                                </div>
                                <div className={styles.QcPdfEmbed}>
                                    <iframe
                                        src={`${process.env.NEXT_PUBLIC_TCONSOLE_API_BASE_URL}${current.lib_report_url}`}
                                        width="100%"
                                        height="480px"
                                        style={{ border: 'none', borderRadius: '6px', display: 'block' }}
                                        title="Library QC Report PDF"
                                    />
                                </div>
                            </div>
                        )}

                        {current?.qc_sample_details?.length > 0 && (
                            <div className={styles.SsTableWrap}>
                                <div className={styles.SsTableLabel}>
                                    Library QC Sample Data
                                    <span className={styles.SsTableCount}>
                                        {current.qc_sample_details.length} samples
                                    </span>
                                </div>
                                <div className={styles.SsTableScroll}>
                                    <table className={styles.SsTable}>
                                        <thead>
                                            <tr>
                                                <th>Sample ID</th>
                                                <th>theraCUES ID</th>
                                                <th>Conc. (ng/µl)</th>
                                                <th>Comments</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {current.qc_sample_details.map((s, i) => (
                                                <tr key={i}>
                                                    <td className={styles.SsTdMono}>{s.sample_id}</td>
                                                    <td className={styles.SsTdMono}>{s.tcues_sample_id}</td>
                                                    <td className={styles.SsTdMono}>{s.nucleic_acid_conc}</td>
                                                    <td className={styles.SsTdMono}>{s.comments}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
 
                    </div>
                </div>
            )}
 
            {libQcDataForm && <LibQcReportPushForm projectId={projectCont.project_id} setLibQcDataForm={setLibQcDataForm} />}
            {libqcEmailTemp && <EmailReports projectId={projectCont.project_id} sec="library" flow="Library QC" subNo ={activeIdx+1} EmailTemp={setLibqcEmailTemp} />}
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            {editLibQc && <LibQcEdit projectId={projectCont.project_id} current={current} setEditLibQc={setEditLibQc} subNo={activeIdx+1}/>}
        </div>
    )
}
 


export function BiInfoDetails({ projectCont }) {
 
    const [binfDataForm, setBinfDataForm] = useState(false)
    const [bioinfoEmailTemp, setBioinfoEmailTemp] = useState(false)
    const [toast, setToast] = useState(null)
    const [activeIdx, setActiveIdx] = useState(0)
    const [binfDetails, setBinfDetails] = useState([])
    const [editBinf, setEditBinf] = useState(false)

    const reports = Array.isArray(binfDetails) ? binfDetails : []
    const current = reports[activeIdx] ?? null
 
    const audit    = current?.binf_audit ?? {}
    const auditDate = audit?.completed_at ? new Date(audit.completed_at).toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
          }) : null

    useEffect(() => {
        BinfSub(projectCont.project_id)
    }, [projectCont?.project_id])
 
    async function BinfSub(projectId) { 

        try {

            const response = await axiosApi.post("/project/binfsubdetails", { project_id: projectId })
            const data = response.data
            
            if (!data.status) { toastSet(setToast, false, data.message); return }
            
            setBinfDetails(data.payload)
            setActiveIdx(0)
        
        } catch (error) {
            
            console.log(error)
            toastSet(setToast, false, "Error fetching bioinformatics details")
        }
    }
 
    return (
        <div className={styles.SsRoot}>
 
            <div className={styles.SsTopBar}>
                <div className={styles.SsTopBarLeft}>
                    <BrainCircuit size={15} className={styles.SsTopBarIcon} />
                    <div>
                        <div className={styles.SsTopBarTitle}>Bioinformatics Analysis</div>
                        <div className={styles.SsTopBarSub}>
                            {reports.length > 0
                                ? `${reports.length} analysis run${reports.length > 1 ? 's' : ''} on record`
                                : 'Nothing here yet. Try refreshing to check'}
                        </div>
                    </div>
                </div>
                <div className={styles.SsTopBarActions}>
                    <button className={styles.SsBtn} onClick={() => BinfSub(projectCont.project_id)}>
                        <RefreshCw size={12} /> Refresh
                    </button>
                    <button
                        className={`${styles.SsBtn} ${styles.SsBtnPrimary}`}
                        onClick={() => setBinfDataForm(true)}
                    >
                        <Upload size={12} /> Upload Analysis
                    </button>
                </div>
            </div>
 
            {reports.length === 0 ? (
                <div className={styles.SsEmpty}>
                    <BrainCircuit size={34} className={styles.SsEmptyIcon} />
                    <span>Nothing here yet. <strong>Refresh</strong>, to fetch analysis data</span>
                </div>
            ) : (
                <div className={styles.SsBody}>
 
                    <div className={styles.SsVersionBar}>
                        <div className={styles.SsVersionBarLabel}>Runs</div>
                        {reports.map((r, i) => {
                            const a = r.binf_audit ?? {}
                            const label = a.completed_at
                                ? new Date(a.completed_at).toLocaleDateString('en-IN', {
                                      day: '2-digit', month: 'short'
                                  })
                                : `Run ${i + 1}`
                            return (
                                <button
                                    key={i}
                                    className={`${styles.SsVersionBtn} ${i === activeIdx ? styles.SsVersionBtnActive : ''}`}
                                    onClick={() => setActiveIdx(i)}
                                >
                                    <span className={styles.SsVersionNum}>Report No: {i + 1}</span>
                                    <span className={styles.SsVersionSub}>{label}</span>
                                </button>
                            )
                        })}
                    </div>
 
                    <div className={styles.SsDetail}>
 
                        <div className={styles.SsDetailStrip}>
                            <div className={styles.SsDetailStripLeft}>
                                <span className={styles.SsDetailV}>Analysis Report {activeIdx + 1}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                                {auditDate && (
                                    <div className={styles.SsDetailDate}>
                                        <CalendarDays size={11} /> {auditDate} 
                                    </div>
                                )}
                                {audit.updated_user && (
                                    <div className={styles.SsDetailDate}>
                                        <User size={11} /> {audit.updated_user}
                                    </div>
                                )}
                            </div>
                            <div className={styles.SsDetailFooter}>
                                <button className={styles.SsBtn} onClick={() => setEditBinf(true)}><Pen size={12} /> Edit</button>
                                <button className={`${styles.SsBtn} ${styles.SsBtnBlue}`} onClick={() => setBioinfoEmailTemp(true)}>
                                    <Mail size={12} /> Send Analysis Report
                                </button>
                            </div>
                        </div>

                        {current?.bioinformatics_summary && (
                            <div className={styles.SsDesc}>{current.bioinformatics_summary}</div>
                        )}
 
                        <div className={`${styles.OvGrid} ${styles.OvGrid2}`}>
                            <div className={styles.OvField}>
                                <div className={styles.OvFieldLabel}>
                                    <Clock size={10} style={{ marginRight: 4, verticalAlign: 'middle' }}/>
                                    Estimated Hours
                                </div>
                                <div className={styles.BinfHours}>
                                    {current?.estimated_hours ?? '—'}
                                    {current?.estimated_hours && <span className={styles.BinfHoursUnit}>hrs</span>}
                                </div>
                            </div>
                            <div className={styles.OvField}>
                                <div className={styles.OvFieldLabel}>
                                    <Clock size={10} style={{ marginRight: 4, verticalAlign: 'middle' }}/>
                                    Approximate Hours Spent
                                </div>
                                <div className={styles.BinfHours}>
                                    {current?.approximate_hours ?? '—'}
                                    {current?.approximate_hours && <span className={styles.BinfHoursUnit}>hrs</span>}
                                </div>
                            </div>
                        </div>
 
                        {current?.bioinformatics_report && (
                            <div className={styles.QcPdfWrap}>
                                <div className={styles.QcPdfLabel}>
                                    <FileText size={12} /> Analysis Report
                                </div>
                                <div className={styles.QcPdfEmbed}>
                                    <iframe
                                        src={`${process.env.NEXT_PUBLIC_TCONSOLE_API_BASE_URL}${current.binf_url}`}
                                        width="100%"
                                        height="480px"
                                        style={{ border: 'none', borderRadius: '6px', display: 'block' }}
                                        title="Bioinformatics Analysis Report"
                                    />
                                </div>
                            </div>
                        )}
 
                    </div>
                </div>
            )}
 
            {binfDataForm && <BinfReportPushForm setBinfDataForm={setBinfDataForm} projectId={projectCont.project_id} />}
            {bioinfoEmailTemp && <EmailReports projectId={projectCont.project_id} sec="analysis" flow="Analysis" subNo ={activeIdx+1} EmailTemp={setBioinfoEmailTemp} />}
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            {editBinf && <AnalysisEdit projectId={projectCont.project_id} current={current} setEditBinf={setEditBinf} subNo={activeIdx+1}/>}
        </div>
    )
}


export function OtherReports({ projectCont }) {

    const [reportUploadForm, setReportUploadForm] = useState(false)
    const [toast, setToast] = useState(null)
    const [activeIdx, setActiveIdx] = useState(0)
    const [reportDetails, setReportDetails] = useState([])
    const [reportadEmailTemp, setReportadEmailTemp] = useState(false)

    const reports = Array.isArray(reportDetails) ? reportDetails : []
    const current = reports[activeIdx] ?? null

    const audit  = current?.audit ?? {}
    const auditDate = audit?.created_at
        ? new Date(audit.created_at).toLocaleString('en-IN', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
          }): null

    useEffect(() => {
        fetchReports(projectCont.project_id)
    }, [projectCont?.project_id])

    async function fetchReports(projectId) {

        try {

            const response = await axiosApi.post("/projects/getadditional", 
                { project_id: projectId })
            const data = response.data

            if (!data.status) { 
                toastSet(setToast, false, data.message)
                return 
            }

            setReportDetails(data.payload)
            setActiveIdx(0)

        } catch (error) {
            console.log(error)
            toastSet(setToast, false, "Error fetching reports")
        }
    }

    async function deleteReport(projectId, reportId) {

        const confirmed = window.confirm(
            "You are about to delete this report?"
        );

        if (!confirmed) return;


        try {

            const response = await axiosApi.post("/projects/deleteadditionalreport", {
                project_id: projectId,
                report_id: reportId
            })
            const data = response.data

            if (!data.status){ 
                toastSet(setToast, false, data.message)
                return 
            }
            
            fetchReports(projectId)
            toastSet(setToast, true, "Report deleted")
        } catch (error) {

            console.log(error)
            toastSet(setToast, false, "Error deleting report")
        }
    }

    function downloadReport(reportPath, reportName) {
        const url = `${process.env.NEXT_PUBLIC_TCONSOLE_API_BASE_URL}/projects/reports/download?path=${encodeURIComponent(reportPath)}`
        const a = document.createElement('a')
        a.href = url
        a.download = reportName
        a.click()
    }

    const PREVIEW_TYPES = ['pdf', 'png', 'jpg', 'jpeg']

    const FILE_ICONS = {
        pdf: <FileText size={12} />,
        csv: <FileText size={12} />,
        xlsx: <FileText size={12} />,
        xls: <FileText size={12} />,
        docx: <FileText size={12} />,
        pptx: <FileText size={12} />,
        png: <FileText size={12} />,
        jpg: <FileText size={12} />,
        jpeg: <FileText size={12} />,
    }

    const fileType = current?.file_type ?? 'unknown'

    return (
        <div className={styles.SsRoot}>

            <div className={styles.SsTopBar}>
                <div className={styles.SsTopBarLeft}>
                    <Files size={15} className={styles.SsTopBarIcon} />
                    <div>
                        <div className={styles.SsTopBarTitle}>Additional Reports</div>
                        <div className={styles.SsTopBarSub}>
                            {reports.length > 0
                                ? `${reports.length} report${reports.length > 1 ? 's' : ''} on record`
                                : 'Nothing here yet. Try refreshing to check'}
                        </div>
                    </div>
                </div>
                <div className={styles.SsTopBarActions}>
                    <button className={styles.SsBtn} onClick={() => fetchReports(projectCont.project_id)}>
                        <RefreshCw size={12} /> Refresh
                    </button>
                    <button
                        className={`${styles.SsBtn} ${styles.SsBtnPrimary}`}
                        onClick={() => setReportUploadForm(true)}
                    >
                        <Upload size={12} /> Upload Report
                    </button>
                </div>
            </div>

            {reports.length === 0 ? (
                <div className={styles.SsEmpty}>
                    <Files size={34} className={styles.SsEmptyIcon} />
                    <span>Nothing here yet. <strong>Refresh</strong> to fetch reports</span>
                </div>
            ) : (
                <div className={styles.SsBody}>

                    <div className={styles.SsVersionBar}>
                        <div className={styles.SsVersionBarLabel}>Reports</div>
                        {reports.map((r, i) => {
                            const a = r.audit ?? {}
                            const label = a.created_at
                                ? new Date(a.created_at).toLocaleDateString('en-IN', {
                                      day: '2-digit', month: 'short'
                                  })
                                : `Report ${i + 1}`
                            return (
                                <button
                                    key={i}
                                    className={`${styles.SsVersionBtn} ${i === activeIdx ? styles.SsVersionBtnActive : ''}`}
                                    onClick={() => setActiveIdx(i)}
                                >
                                    <span className={styles.SsVersionNum}>Report No: {i + 1}</span>
                                    <span className={styles.SsVersionSub}>{label}</span>
                                </button>
                            )
                        })}
                    </div>

                    <div className={styles.SsDetail}>

                        <div className={styles.SsDetailStrip}>
                            <div className={styles.SsDetailStripLeft}>
                                <span className={styles.SsDetailV}>{current?.report_name ?? `Report ${activeIdx + 1}`}</span>
                                {fileType !== 'unknown' && (
                                    <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 3 }}>
                                        .{fileType.toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                                {auditDate && (
                                    <div className={styles.SsDetailDate}>
                                        <CalendarDays size={11} /> {auditDate}
                                    </div>
                                )}
                                {audit.name && (
                                    <div className={styles.SsDetailDate}>
                                        <User size={11} /> {audit.name}
                                    </div>
                                )}
                            </div>
                            <div className={styles.SsDetailFooter}>
                                <button
                                    className={styles.SsBtn}
                                    onClick={() => deleteReport(projectCont.project_id, current?._id)}
                                >
                                    <Trash2 size={12} /> Delete
                                </button>
                                <button className={`${styles.SsBtn} ${styles.SsBtnBlue}`} onClick={() => setReportadEmailTemp(true)}>
                                    <Mail size={12} /> Send This Report
                                </button>
                                <button
                                    className={`${styles.SsBtn} ${styles.SsBtnBlue}`}
                                    onClick={() => downloadReport(current?.report_path, current?.report_name)}
                                >
                                    <Download size={12} /> Download
                                </button>
                            </div>
                        </div>

                        {current?.report_description && (
                            <div className={styles.SsDesc}>{current.report_description}</div>
                        )}

                        {current?.report_path && (
                            <div className={styles.QcPdfWrap}>
                                <div className={styles.QcPdfLabel}>
                                    {FILE_ICONS[fileType] ?? <FileText size={12} />}
                                    {current.report_name ?? 'Report'}
                                </div>
                                <div className={styles.QcPdfEmbed}>
                                    {PREVIEW_TYPES.includes(fileType) ? (
                                        <iframe
                                            src={`${process.env.NEXT_PUBLIC_TCONSOLE_API_BASE_URL}/projects/reports/preview?path=${encodeURIComponent(current.report_path)}`}
                                            width="100%"
                                            height="480px"
                                            style={{ border: 'none', borderRadius: '6px', display: 'block' }}
                                            title="Report Preview"
                                        />
                                    ) : (
                                        <div className={styles.SsEmpty} style={{ padding: '2rem' }}>
                                            <FileText size={28} className={styles.SsEmptyIcon} />
                                            <span>Preview not available for <strong>.{fileType.toUpperCase()}</strong> files</span>
                                            <button
                                                className={`${styles.SsBtn} ${styles.SsBtnBlue}`}
                                                onClick={() => downloadReport(current.report_path, current.report_name)}
                                                style={{ marginTop: 8 }}
                                            >
                                                <Download size={12} /> Download to view
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {reportUploadForm && (
                <ReportUploadForm
                    setReportUploadForm={setReportUploadForm}
                    projectId={projectCont.project_id}
                    onSuccess={() => fetchReports(projectCont.project_id)}
                />
            )}
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
            {reportadEmailTemp && <EmailReports projectId={projectCont.project_id} sec="addreports" flow="Additional Report" subNo ={current?._id} EmailTemp={setReportadEmailTemp} />}
        </div>
    )
}