"use client"

import styles from './ViewComp.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { SampleSubDetailsComp, QcSamDetailsComp, LibSamDetailsComp } from './components/elements';

export function ViewComp(){

    return(

        <div className={styles.View}>
            <ViewSideBar/>
            <ViewWin />
        </div>
    );
}

function ViewWin (){
    return(
        <div className={styles.ViewWin}>
            <div className={styles.contentWin}>
                <div className={styles.ProjectView}>
                    <ViewProjDetails />
                    <StatusPop />
                    <SampleSubDetails />
                    <QcSamDetails />
                    <LibSamDetails />
                    <BiInfoDetails />
                    <Reports />
                </div>
            </div>
        </div>
    );
}

function ViewSideBar(){
    return(
        <div className={styles.SideB}>
            <h2>Projects</h2>
                <div className={styles.RecEnt}>
                    <button className={styles.projectBtns}>
                        <div className={styles.BtnsHeader}>
                            <span className={styles.projectId}>TIPL_100</span>
                            <span className={`${styles.statusBadge} ${styles.accepted}`}>Accepted</span>
                        </div>
                        
                        <div className={styles.progressContainer}>
                            <div className={styles.progressText}>
                                <span>Completion</span>
                                <span>70%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </button>
                    <button className={styles.projectBtns}>
                        <div className={styles.BtnsHeader}>
                            <span className={styles.projectId}>TIPL_101</span>
                            <span className={`${styles.statusBadge} ${styles.analysis}`}>Analysis</span>
                        </div>
                        
                        <div className={styles.progressContainer}>
                            <div className={styles.progressText}>
                                <span>Completion</span>
                                <span>10%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '10%' }}></div>
                            </div>
                        </div>
                    </button>
                    <button className={styles.projectBtns}>
                        <div className={styles.BtnsHeader}>
                            <span className={styles.projectId}>TIPL_102</span>
                            <span className={`${styles.statusBadge} ${styles.reporting}`}>Reporting</span>
                        </div>
                        
                        <div className={styles.progressContainer}>
                            <div className={styles.progressText}>
                                <span>Completion</span>
                                <span>60%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '60%' }}></div>
                            </div>
                        </div>
                    </button>
                    <button className={styles.projectBtns}>
                        <div className={styles.BtnsHeader}>
                            <span className={styles.projectId}>TIPL_103</span>
                            <span className={`${styles.statusBadge} ${styles.completed}`}>Completed</span>
                        </div>
                        
                        <div className={styles.progressContainer}>
                            <div className={styles.progressText}>
                                <span>Completion</span>
                                <span>100%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </button>
                    <button className={styles.projectBtns}>
                        <div className={styles.BtnsHeader}>
                            <span className={styles.projectId}>TIPL_104</span>
                            <span className={`${styles.statusBadge} ${styles.closed}`}>Closed</span>
                        </div>
                        
                        <div className={styles.progressContainer}>
                            <div className={styles.progressText}>
                                <span>Completion</span>
                                <span>100%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </button>
                    <button className={styles.projectBtns}>
                        <div className={styles.BtnsHeader}>
                            <span className={styles.projectId}>TIPL_105</span>
                            <span className={`${styles.statusBadge} ${styles.lab_stage}`}>Lab Stage</span>
                        </div>
                        
                        <div className={styles.progressContainer}>
                            <div className={styles.progressText}>
                                <span>Completion</span>
                                <span>35%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '35%' }}></div>
                            </div>
                        </div>
                    </button>
                    <button className={styles.projectBtns}>
                        <div className={styles.BtnsHeader}>
                            <span className={styles.projectId}>TIPL_106</span>
                            <span className={`${styles.statusBadge} ${styles.not_accepted}`}>Not Accepted</span>
                        </div>
                        
                        <div className={styles.progressContainer}>
                            <div className={styles.progressText}>
                                <span>Completion</span>
                                <span>5%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '5%' }}></div>
                            </div>
                        </div>
                    </button>
                    <button className={styles.projectBtns}>
                        <div className={styles.BtnsHeader}>
                            <span className={styles.projectId}>TIPL_200</span>
                            <span className={`${styles.statusBadge} ${styles.accepted}`}>Accepted</span>
                        </div>
                        
                        <div className={styles.progressContainer}>
                            <div className={styles.progressText}>
                                <span>Completion</span>
                                <span>45%</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div className={styles.progressFill} style={{ width: '45%' }}></div>
                            </div>
                        </div>
                    </button>
                </div> 
        </div>
    );
}



function ViewProjDetails() {
    return(
        <>
            <div className={styles.ProjectSection}>
                <div className={styles.IdComponent}>
                    <div>Project ID</div>
                    <div>TIPL_200</div>
                </div>
                <div className={styles.ProjectHealth}>
                    <div>ACCEPTED</div>
                </div>
            </div>

            <div className={styles.ProjectComp}>
                <h2 className={styles.sech}>Client Information</h2>
                <div className={styles.ProjectCustomer}>
                    <div className={styles.ProjecIn}>
                        <div>PI Name</div>
                        <div>Sugunan Varkey</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Client Email</div>
                        <div>sugunan.varkey@iitm.ac.in</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Organization/Institution</div>
                        <div>IIT Madras</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Lab/Department</div>
                        <div>Tomman Memorial Nanobiology Lab</div>
                    </div>
                </div>
            </div>
        </>
    );
}


function StatusPop(){
    return(

        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Project Tasks</h2>
                <button className={styles.fieldPop}>&#8693;</button>
            </div>

            <div className={styles.GridTwo}>
                <div className={styles.TaskProp}>
                    <div>Standard Tasks</div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                </div>
                <div className={styles.TaskProp}>
                    <div>Added Tasks</div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>&#10004;</button>
                    </div>               
                </div>
            </div>
        </div>
    );
}


function SampleSubDetails(){
    return(

        <div className={styles.ProjectComp}>
            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Sample Submission Details</h2>
                <button className={styles.fieldPop}>&#8693;</button>
            </div>
            <SampleSubDetailsComp />
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
