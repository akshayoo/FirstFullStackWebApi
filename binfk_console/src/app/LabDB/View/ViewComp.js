"use client"

import styles from './ViewComp.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SampleSubDetailsComp, QcSamDetailsComp, LibSamDetailsComp, BiinfoDetailsComp } from './components/elements';
import { QcReportPushForm, LibQcReportPushForm, BinfReportPushForm } from './components/elemoptions';
import { EmailReports } from './components/elementsent';

export function ViewComp(){

    const [ projectCont, setProjectCont ] = useState(null)
    const [samsubDetails, setSamsubDetails] = useState({})
    const [qcDetails, setQcDetails] = useState({})
    const [libqcDetails, setLibqcDetails] = useState({})
    const [binfDetails, setBinfDetails] = useState({})

    return(
        <>

            <div className={styles.View}>
                <ViewSideBar setProjectCont={setProjectCont} 
                setSamsubDetails={setSamsubDetails}
                setQcDetails={setQcDetails}
                setLibqcDetails = {setLibqcDetails}
                setBinfDetails ={setBinfDetails}/>


                <ViewWin projectCont={projectCont} 
                samsubDetails ={samsubDetails} 
                setSamsubDetails = {setSamsubDetails}
                qcDetails = {qcDetails}
                setQcDetails = {setQcDetails}
                libqcDetails={libqcDetails}
                setLibqcDetails={setLibqcDetails}
                binfDetails ={binfDetails}
                setBinfDetails = {setBinfDetails}/>

            </div>
        </>
    );
}

function ViewSideBar({setProjectCont, setSamsubDetails, setQcDetails, setLibqcDetails, setBinfDetails}){

    const [projectPipeline, setProjectPipeline] = useState([])

    useEffect(() => {
        async function ProjectsPipeline() {
            try{
                const response = await axios.get("http://localhost:6050/project/projects")
                const data = await response.data
                console.log(data.status)

                setProjectPipeline(data.payload)

            }
            catch(error) {
                console.log(error)
            }
        }
        ProjectsPipeline()
    }, [])

    const ProjectPop = async(projectId, projectStatus) => {

        if(!projectId) return
        if(!projectStatus) return

        try{
            const response = await axios.post("http://localhost:6050/project/projectcomp",
                {
                    "project_id" : projectId,
                    "project_status" : projectStatus 
                }
            )   
            const data = response.data

            setProjectCont(data.payload)
            setSamsubDetails({})
            setQcDetails({})
            setLibqcDetails({})
            setBinfDetails({})

        }
        catch {
            alert("Could not connect to the server")
        }
    }

    return(
        <div className={styles.SideB}>
            <h2>Projects</h2>
            <div className={styles.RecEnt}>
                {
                    projectPipeline.map((project) => {
                        const percent = project.percent
                        return(
                            <button key={project.project_id} className={styles.projectBtns} onClick={() => ProjectPop(project.project_id, project.status)}>
                                <div className={styles.BtnsHeader}>
                                    <span id='projectId' className={styles.projectId}>{project.project_id}</span>
                                    <span className={`${styles.statusBadge} ${styles.accepted}`}>{project.status}</span>
                                </div>
                                
                                <div className={styles.progressContainer}>
                                    <div className={styles.progressText}>
                                        <span>Completion</span>
                                        <span>{`${project.percent}%`}</span>
                                    </div>
                                    <div className={styles.progressBar}>
                                        <div className={styles.progressFill} style={{ width: `${percent}%` }}></div>
                                    </div>
                                </div>
                            </button>
                        )
                    })
                }
            </div> 
        </div>
    );
}


function ViewWin ({projectCont, samsubDetails, setSamsubDetails, 
    qcDetails, setQcDetails, libqcDetails, setLibqcDetails, binfDetails, setBinfDetails}){
    return(
        <div className={styles.ViewWin}>
            <div className={styles.contentWin}>
                {projectCont && 
                
                    <div className={styles.ProjectView}>
                        <ViewProjDetails projectCont={projectCont} />
                        <StatusPop projectCont={projectCont} />
                        <SampleSubDetails projectCont={projectCont} samsubDetails ={samsubDetails} setSamsubDetails={setSamsubDetails} />
                        <QcSamDetails projectCont={projectCont} qcDetails ={qcDetails} setQcDetails = {setQcDetails} />
                        <LibSamDetails projectCont={projectCont} libqcDetails={libqcDetails} setLibqcDetails={setLibqcDetails} />
                        <BiInfoDetails projectCont={projectCont} binfDetails={binfDetails} setBinfDetails={setBinfDetails}/>
                        <Reports projectCont={projectCont} />
                    </div>
                
                }
            </div>
        </div>
    );
}


function ViewProjDetails({projectCont}) {
    return(
        <>
            <div className={styles.ProjectSection}>
                <div className={styles.IdComponent}>
                    <div>Project ID</div>
                    <div>{projectCont.project_id}</div>
                </div>
                <div className={styles.ProjectHealth}>
                    <div>{projectCont.project_status}</div>
                </div>
            </div>

            <div className={styles.ProjectComp}>
                <h2 className={styles.sech}>Client Information</h2>
                <div className={styles.GridTwo}>
                    <div className={styles.ProjecIn}>
                        <div>PI Name</div>
                        <div>{projectCont.pi_name}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Client Email</div>
                        <div>{projectCont.email}</div>
                    </div>
                </div>
                <div className={styles.ProjectCustomer}>
                    <div className={styles.ProjecIn}>
                        <div>Phone</div>
                        <div>{projectCont.phone}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Organization/Institution</div>
                        <div>{projectCont.institution}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Lab/Department</div>
                        <div>{projectCont.lab_dept}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Offering Type</div>
                        <div>{projectCont.offering_type}</div>
                    </div>
                </div>
            </div>
        </>
    );
}


function StatusPop({projectCont, setProjectCont}){

    async function updateTaskstage(sec, projectId, task){

        try {

            alert("You are about to mark this task completed")

            const response = await axios.post("http://localhost:6050/project/taskstatusupdate",
                {
                    "project_id" : projectId,
                    "task" : task,
                    "sec" : sec
                }, {withCredentials : true}
            )

            const data = response.data
            
            alert(data.status)
        }

        catch(err) {
            console.log(err)
            alert("Trouble updating task update")
        }

    }

    return(

        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Project Tasks</h2>
                <button className={styles.fieldPop}>&#8693;</button>
            </div>

            <div >
                <div className={styles.TaskProp}>
                    <div>Standard Tasks</div>
                    {projectCont.std_del.map((stdDel) => {
                        return(
                            <div key={stdDel.task_number} className={styles.TaskComp}>
                                <div>{stdDel.label}</div>
                                <button onClick={() => updateTaskstage("std", projectCont.project_id, stdDel.task_number)} className={styles.TrueBtn} disabled={stdDel.completed}>&#10004;</button>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.TaskProp}>
                    <div>Added Tasks</div>
                    {projectCont.add_del.map((addDel) => {
                        return(
                            <div key={addDel.task_number} className={styles.TaskComp}>
                                <div>{addDel.label}</div>
                                <button onClick={() => updateTaskstage("adel", projectCont.project_id, addDel.task_number)} className={styles.TrueBtn} disabled={addDel.completed}>&#10004;</button>
                            </div>
                        );
                    })}             
                </div>
            </div>
        </div>
    );
}


function SampleSubDetails({projectCont, samsubDetails, setSamsubDetails}){


    async function SampleSub(projectId) {

        try {
            const response = await axios.post("http://localhost:6050/project/samsubdetails",
                {"project_id" : projectId}
            )

            const data = response.data
            if (data.status === "NoSubmission"){
                alert(data.payload)
                return
            } 
            else{
                console.log(data.status)
                setSamsubDetails(data.payload)
            }
            }
        catch{
            alert("Error contacting the server")
        }
    }

    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Sample Submission Details | {`${projectCont.project_id}`}</h2>
                <button className={styles.fieldPop} onClick={() => SampleSub(projectCont.project_id)}>&#8693;</button>
            </div>
            {
                Object.keys(samsubDetails).length > 0 && (
                <SampleSubDetailsComp samsubDetails={samsubDetails} projectId={projectCont.project_id}/>)
            }
        </div>
    )
}


function QcSamDetails({projectCont, qcDetails, setQcDetails}) {

    const [qcDataForm, setQcDataForm] = useState(false)

    async function QcSub(projectId){
        
        try{

            const response = await axios.post("http://localhost:6050/project/qcsubdetails",
                {"project_id" : projectId}
            )

            const data = response.data

            if (data.status === "NoSubmission" ){
                alert("No QC files found, please upload")
                return
            }
            else{
                console.log(data.status)
                console.log(data.payload)
                setQcDetails(data.payload)
            }

        }

        catch(error) {
            console.log(error)
            alert("Error contacting the server")
        }
    }

    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>QC Details | {`${projectCont.project_id}`}</h2>
                <button className={styles.fieldPop} onClick={() => QcSub(projectCont.project_id)}>&#8693;</button>
            </div>
            {
                Object.keys(qcDetails).length > 0 && (
                    <QcSamDetailsComp qcDetails = {qcDetails} projectId = {projectCont.project_id} />
                )
            }
            <div className={styles.GridThree}>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecInBtn}>{`Download Template (.csv)`}</button>
                </div>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecInBtn} onClick={() => setQcDataForm(true)}>{`Upload QC Report`}</button>
                    {qcDataForm && <QcReportPushForm projectId={projectCont.project_id} setQcDataForm={setQcDataForm}/>}
                </div>
            </div>
        </div>
    )
}


function LibSamDetails({projectCont, libqcDetails, setLibqcDetails}) {

    const [ libQcDataFrom , setLibQcDataForm] = useState(false)

    async function LibSub(projectId){

        try{

            const response = await axios.post("http://localhost:6050/project/libqcsubdetails",
                {"project_id" : projectId}
            )

            const data = response.data

            if(data.status ===  "NoSubmission"){
                alert(data.payload)
                return
            }

            else{
                console.log("fetch successfull")
                setLibqcDetails(data.payload)
            }
        }

        catch{
            alert("Error contacting the server")
        }
    }

    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Library QC Details | {`${projectCont.project_id}`}</h2>
                <button className={styles.fieldPop} onClick={() => LibSub(projectCont.project_id)}>&#8693;</button>
            </div>
            {
                Object.keys(libqcDetails).length > 0 && (<LibSamDetailsComp libqcDetails = {libqcDetails} projectId={projectCont.project_id} />)
            }
            <div className={styles.GridThree}>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecInBtn}>{`Download Template (.csv)`}</button>
                </div>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecInBtn} onClick={() => setLibQcDataForm(true)}>{`Upload Lib QC Data`}</button>
                    {libQcDataFrom && <LibQcReportPushForm projectId={projectCont.project_id} setLibQcDataForm ={setLibQcDataForm} />}
                </div>
            </div>
        </div>
    )
}


function BiInfoDetails({projectCont, binfDetails, setBinfDetails}) {

    const [ binfDataForm, setBinfDataForm] = useState(false)

    async function BinfSub(projectId) {
        try{
            const response = await axios.post("http://localhost:6050/project/binfsubdetails",
                {"project_id" : projectId}
            )

            const data = response.data
            if(data.status === "NoSubmission"){
                alert(data.payload)
                return
            }

            else{
                console.log("fetch successfull")
                setBinfDetails(data.payload)
            }

        }
        catch(error){
            console.log(error)
            alert("Error contacting the server")
        }
    }

    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Analysis Details | {`${projectCont.project_id}`}</h2>
                <button className={styles.fieldPop} onClick={() => BinfSub(projectCont.project_id)} >&#8693;</button>
            </div>
            {
                Object.keys(binfDetails).length > 0 && (<BiinfoDetailsComp binfDetails={binfDetails} projectId={projectCont.project_id} />)
            }
            <div className={styles.GridThree}>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecInBtn} onClick={() => setBinfDataForm(true)}>{`Upload Analysis Data`}</button>
                    {binfDataForm && <BinfReportPushForm setBinfDataForm={setBinfDataForm} projectId = {projectCont.project_id} />}
                </div>
            </div>
        </div>
    )
}

function Reports({projectCont}) {

    const [finreportEmailTemp, setfinreportEmailTemp] = useState(false)

    async function downlFinalRep(projectId) {
        try{

            const response = await axios.post("http://localhost:6050/reports/genfinreportpdf",
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
            alert("Downloading failed")

        }
    }

    async function closeProject(projectId){
        try{
            
            alert("You are going to perform a sensitive action. Do you wnat to continue")
            
            const response = await axios.post("http://localhost:6050/project/closeproject",
                {"project_id" : projectId}
            )

            const data = response.data
            alert(data.status)
        }
        catch(error){
            console.log(error)
            alert("Faliled to close project")
        }

    }

    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Reports | {`${projectCont.project_id}`}</h2>
            </div>
            <div className={styles.GridThree}>
                <div className={styles.ProjecInOnBtn}>
                    <button onClick={() => downlFinalRep(projectCont.project_id)} className={styles.ProjecInBtn}>{`Download Final Report (.pdf)`}</button>
                </div>
                <div className={styles.ProjecInOnBtn}>
                    <button onClick={()=>setfinreportEmailTemp(true)} className={styles.ProjecInBtn}>{`Send Final Report`}</button>
                    {finreportEmailTemp && <EmailReports projectId={projectCont.project_id} sec="finalreport" flow={"Final Project Report"} EmailTemp={setfinreportEmailTemp} />}
                </div>
                <div className={styles.ProjecIn}>
                    <button onClick={() => closeProject(projectCont.project_id)}>{`Close Project`}</button>
                </div>
            </div>
        </div>
        
    )
}


