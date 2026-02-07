"use client"

import styles from './ViewComp.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SampleSubDetailsComp, QcSamDetailsComp, LibSamDetailsComp } from './components/elements';

export function ViewComp(){

    const [ projectCont, setProjectCont ] = useState(null)

    return(

        <div className={styles.View}>
            <ViewSideBar setProjectCont={setProjectCont}/>
            <ViewWin projectCont={projectCont}/>
        </div>
    );
}

function ViewSideBar({setProjectCont}){

    const [projectPipeline, setProjectPipeline] = useState([])

    useEffect(() => {
        async function ProjectsPipeline() {
            try{
                const response = await axios.get("http://127.0.0.1:4080/project/projects")
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
            const response = await axios.post("http://127.0.0.1:4080/project/projectcomp",
                {
                    "project_id" : projectId,
                    "project_status" : projectStatus 
                }
            )   
            const data = response.data

            setProjectCont(data.payload)

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


function ViewWin ({projectCont}){
    return(
        <div className={styles.ViewWin}>
            <div className={styles.contentWin}>
                {projectCont && 
                
                    <div className={styles.ProjectView}>
                        <ViewProjDetails projectCont={projectCont} />
                        <StatusPop projectCont={projectCont} />
                        <SampleSubDetails projectCont={projectCont} />
                        <QcSamDetails projectCont={projectCont} />
                        <LibSamDetails projectCont={projectCont} />
                        <BiInfoDetails projectCont={projectCont} />
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


function StatusPop({projectCont}){
    return(

        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Project Tasks</h2>
                <button className={styles.fieldPop}>&#8693;</button>
            </div>

            <div className={styles.GridTwo}>
                <div className={styles.TaskProp}>
                    <div>Standard Tasks</div>
                    {projectCont.std_del.map((stdDel) => {
                        return(
                            <div key={stdDel.label} className={styles.TaskComp}>
                                <div>{stdDel.label}</div>
                                <button className={styles.FalseBtn}>&#10004;</button>
                            </div>
                        );
                    })}
                </div>
                <div className={styles.TaskProp}>
                    <div>Added Tasks</div>
                    {projectCont.add_del.map((addDel) => {
                        return(
                            <div key={addDel.label} className={styles.TaskComp}>
                                <div>{addDel.label}</div>
                                <button className={styles.TrueBtn}>&#10004;</button>
                            </div>
                        );
                    })}             
                </div>
            </div>
        </div>
    );
}


function SampleSubDetails({projectCont}){

    const [samsubDetails, setSamsubDetails] = useState({})

    async function SampleSub(projectId) {
        const response = await axios.post("http://127.0.0.1:4080/project/samsubdetails",
            {"project_id" : projectId}
        )

        const data = response.data
        console.log(data.status)

        setSamsubDetails(data.payload)
    }

    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Sample Submission Details</h2>
                <button className={styles.fieldPop} onClick={() => SampleSub(projectCont.project_id)}>&#8693;</button>
            </div>
            {
                Object.keys(samsubDetails).length > 0 && (
                <SampleSubDetailsComp samsubDetails={samsubDetails} />)
            }
        </div>
    )
}


function QcSamDetails() {
    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>QC Details</h2>
                <button className={styles.fieldPop}>&#8693;</button>
            </div>
        </div>
    )
}

function LibSamDetails() {
    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Library QC Details</h2>
                <button className={styles.fieldPop}>&#8693;</button>
            </div>
        </div>
    )
}


function BiInfoDetails() {
    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Analysis</h2>
                <button className={styles.fieldPop}>&#8693;</button>
            </div>
        </div>
    )
}

function Reports() {
    return(
        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Reports</h2>
                <button className={styles.fieldPop}>&#8693;</button>
            </div>
        </div>
    )
}
