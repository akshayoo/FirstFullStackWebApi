"use client"

import styles from './ViewComp.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { ViewWin } from './components/components';

export function ViewComp(){

    return(

        <div className={styles.View}>
            <ViewSideBar/>
            <ViewWin />
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





