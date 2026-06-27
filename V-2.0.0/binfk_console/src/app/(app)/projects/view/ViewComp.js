"use client"

import styles from './ViewComp.module.css'
import { useState, useEffect, Suspense} from 'react';
import axiosApi from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { MessageComp } from '@/components/messageComp';
import { toastSet } from '@/components/toastfunc';
import { OverView, StatusPop, SampleSubDetails, QcDetails, LibSamDetails, BiInfoDetails, OtherReports} from './components/elements';
import { NewProject, ProjectComments } from './components/elemoptions';
import { MessageSquare, FileDown, Trash2, Upload,} from "lucide-react";
import { X, FolderX, Plus, LayoutDashboard, FileUp, ShieldCheck, TestTube2, FileText, SheetIcon, CheckSquare} from "lucide-react"; 
import { useRouter } from 'next/navigation';


export function ViewComp() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ViewCompInner />
        </Suspense>
    );
}

function ViewCompInner(){

    const [projectCont, setProjectCont] = useState(null)
    const [samsubDetails, setSamsubDetails] = useState({})
    const [qcDetails, setQcDetails] = useState({})
    const [libqcDetails, setLibqcDetails] = useState({})
    const [binfDetails, setBinfDetails] = useState({})

    const searchParameters = useSearchParams()
    const projectId = searchParameters.get("id")

    useEffect(() => {
        
        if (!projectId) return

        async function fetchProject() {
            try {

                const response = await axiosApi.post("/project/projectcomp", { 
                    project_id: projectId,
                    project_status: ""  
                })

                const data = response.data
                console.log(response.data)
                if (data.status) 
                    console.log(data.payload)
                    {setProjectCont(data.payload)}
            } catch(error) {
                console.log(error)
            }
        }

        fetchProject()
    }, [projectId])

    return(
        <div className={styles.View}>
            {projectId 
                ? <ViewWin 
                    projectCont={projectCont}
                    samsubDetails={samsubDetails} setSamsubDetails={setSamsubDetails}
                    qcDetails={qcDetails} setQcDetails={setQcDetails}
                    libqcDetails={libqcDetails} setLibqcDetails={setLibqcDetails}
                    binfDetails={binfDetails} setBinfDetails={setBinfDetails}
                    setProjectCont={setProjectCont}
                  /> 
                : <ViewAllProjects setProjectCont={setProjectCont} projectCont={projectCont ?? []}/>
            }
        </div>
    );
}


function StatusBadge({ status }) {
    const s = (status || "").toLowerCase().trim();

    let badgeClass = styles.BadgeDefault;

    if (s === "completed") {
        badgeClass = styles.BadgeActive;         
    } else if (s === "bioinformatics stage") {
        badgeClass = styles.BadgeInProgress      
    } else if (s === "library stage") {
        badgeClass = styles.BadgeInProgress 
    } else if (s === "in qc stage") {
        badgeClass = styles.BadgePending    
    } else if (s === "accepted") {
        badgeClass = styles.BadgeOnHold        
    } else if (s === "initiated") {
        badgeClass = styles.BadgeDefault        
    } else if (s === "closed") {
        badgeClass = styles.BadgeCancelled    
    }

    return (
        <span className={`${styles.Badge} ${badgeClass}`}>
            {status || "—"}
        </span>
    );
}

function ViewAllProjects({setProjectCont, projectCont}){

    const [search, setSearch] = useState("")
    const [newProject, setNewProject] = useState(false)

    useEffect(() => {

        async function ProjectsPipeline() {

            try {

                const response = await axiosApi.get("/project/projects")
                const data = response.data
                console.log(data.message)
                setProjectCont(data.payload)

            } catch(error) {
                console.log(error)
            }
        }

        ProjectsPipeline()

    }, [])


    const projectSearched = projectCont.filter(
        (proj) => proj.project_id.toLowerCase().includes(search.toLowerCase().trim())
    )

    return(
        <div className={styles.ProjectsAllComp}>
            <div className={styles.SearchDiv}>
                <h2>Projects</h2>
                <div>
                    <input type='search' placeholder='Search by Project ID…' value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <button onClick={() => setNewProject(true)}><Plus/></button>
                </div>
            </div>

            <div className={styles.RecEnt}>
                <div className={styles.ProjectContainer}>
                    <table className={styles.ProjectTable}>
                        <thead>
                            <tr>
                                <th>Project ID</th>
                                <th>PI Name</th>
                                <th>Institution</th>
                                <th>Status</th>
                                <th>Percentage Completed</th>
                                <th>Created BY</th>
                                <th>Created At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {projectSearched.length > 0 ? (
                                projectSearched.map((proj) => (
                                    <tr key={proj.project_id}>
                                        <td><a href={`/projects/view?id=${proj.project_id}`}>{proj.project_id}</a></td>
                                        <td>{proj.pi_name}</td>
                                        <td>{proj.institution}</td>
                                        <td><StatusBadge status={proj.status}/></td>
                                        <td>{proj.percent}</td>
                                        <td>{proj.created_by}</td>
                                        <td>{new Date(proj.created_at).toLocaleString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7}>
                                        <div className={styles.EmptyState}>
                                            Please wait....
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {newProject && <NewProject setNewProject={setNewProject}/>}
        </div>
    );
}



function ViewWin ({projectCont, setProjectCont}){

    const [activeSec, setActiveSec] = useState("Overview")
    const [toast, setToast] = useState(null)
    const [projectComm, setProjectComm] = useState(false)

    const router = useRouter()

    async function closeProject(projectId){

        const confirmAction = window.confirm(
            "You are going to close this project, Do you want to proceed"
        )

        if (!confirmAction) return

        try{
    
            const response = await axiosApi.post("/project/closeproject",
                {"project_id" : projectId}
            )

            const data = response.data
            toastSet(setToast, data.status, data.message)
            return
        }
        catch(error){
            console.log(error)
            toastSet(setToast, false, "Faliled to close project")
        }

    }

    async function deleteProject(projectId){

        const confirmAction = window.confirm(
            "You are going to delete this project, Do you want to proceed"
        )

        if (!confirmAction) return

        try{

            const response = await axiosApi.post("/project/deleteproject",
                {"project_id" : projectId}
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, false, data.message)
                return
            }

            toastSet(setToast, data.status, data.message)
            setTimeout(() => { setProjectCont(null); router.push("/projects/view"); }, 1500)

        }
        catch(err){
            console.log(err)
            toastSet(setToast, false, "Failed to delete the project")
        }
    }


    return(
        <div className={styles.ViewWin}>

            {projectCont && 
            <>
            
                <div className={styles.ProjectSideBar}>
                    <div className={styles.ProjectSideBarTop}>
                        <div>theraCUES Projects</div>
                        <div>{projectCont.project_id}</div>
                    </div>
                    <div className={styles.ProjectSideBarBottom}>
                        <div>Navigation</div>
                        <div>
                            <button className={activeSec === "Overview" ? styles.HoverSideButton : ""} onClick={() => setActiveSec("Overview")}><LayoutDashboard/> Overview</button>
                            <button className={activeSec === "Tasks" ? styles.HoverSideButton : ""} onClick={() => setActiveSec("Tasks")}><CheckSquare/> Tasks</button>
                            <button className={activeSec === "Sample Submission" ? styles.HoverSideButton : ""} onClick={() => setActiveSec("Sample Submission")}><FileUp/> Sample Submission</button>
                            <button className={activeSec === "QC" ? styles.HoverSideButton : ""} onClick={() => setActiveSec("QC")}><ShieldCheck/> QC</button>
                            <button className={activeSec === "Library QC" ? styles.HoverSideButton : ""} onClick={() => setActiveSec("Library QC")}><TestTube2/> Library QC</button>
                            <button className={activeSec === "Analysis" ? styles.HoverSideButton : ""} onClick={() => setActiveSec("Analysis")}><FileText/> Analysis</button>
                            <button className={activeSec === "Other Reports" ? styles.HoverSideButton : ""} onClick={() => setActiveSec("Other Reports")}><SheetIcon/> Other Reports</button>
                        </div>
                    </div>
                    
                </div>

                <div className={styles.ProjectMainContent}>
                    <div className={styles.ProjectMainHeader}>
                        <div className={styles.ProjectMainHeaderIn}>
                            <div>{activeSec}</div>
                        </div>
                            <div className={styles.ProjectMainHeaderBtns}>

                                <button className={styles.FinReportBtn} title="Download the finalized project report" disabled>
                                    <FileDown size={16} /> Download Final Report
                                </button>

                                <button onClick={() => setProjectComm(true)} className={styles.CommentsBtn} title="View project discussions and feedback">
                                    <MessageSquare size={16} /> Project Comments
                                </button>

                                <button className={styles.DeleteProjBtn} onClick={() => deleteProject(projectCont.project_id)} title="Permanently delete this project">
                                    <Trash2 size={16} /> Delete
                                </button>

                                <button className={styles.CloseProjBtn} onClick={() => closeProject(projectCont.project_id)} title="Close Project">
                                    <FolderX size={16} /> Close Project
                                </button>

                                <button onClick={() => {window.location.href = "/projects/view";}} className={styles.BackBtn} title="Close Tab">
                                    <X size={16} />
                                </button>
                            </div>
                    </div>
                    <div className={styles.ProjectMainContentShow}>
                        
                        {activeSec === "Overview" && (<OverView projectCont={projectCont}/>) }
                        {activeSec === "Tasks" && (<StatusPop projectCont={projectCont}/>)}
                        {activeSec === "Sample Submission" && (<SampleSubDetails projectCont={projectCont}/>)}
                        {activeSec === "QC" && (<QcDetails projectCont={projectCont}/>)}
                        {activeSec === "Library QC" && (<LibSamDetails projectCont={projectCont}/>)}
                        {activeSec === "Analysis" && (<BiInfoDetails projectCont={projectCont}/>)}
                        {activeSec === "Other Reports" && (<OtherReports projectCont={projectCont}/>)}
                        {toast && <MessageComp condition={toast.condition} message={toast.message} />}
                        
                    </div>
                </div>
            
            </>}
            {projectComm && <ProjectComments projectId = {projectCont.project_id} setProjectComm={setProjectComm}/>}
        </div>
    );
}





    async function downlFinalRep(projectId) {
        try{

            const response = await axiosApi.post("/reports/genfinreportpdf",
                {"project_id" : projectId},
                {responseType : "blob"}
            )

            const blob = new Blob([response.data], {type : "application/pdf"})
            const url = window.URL.createObjectURL(blob)

            window.open(url, "_blank")

            setTimeout(() => {
                window.URL.revokeObjectURL(url)
            })

        }
        catch(error){

            console.log(error)
            toastSet(setToast, false, "Downloading failed")

        }
    }

   





















