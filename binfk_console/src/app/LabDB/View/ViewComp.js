"use client"

import styles from './ViewComp.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

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


function ViewWin (){
    return(
        <div className={styles.ViewWin}>
            <div className={styles.contentWin}>
                <div className={styles.ProjectView}>
                    <div>
                        <div>
                            <div>Project ID</div>
                            <div>TIPL_200</div>
                        </div>
                        <div>
                            <div>Status</div>
                            <div>Accepted</div>
                        </div>
                    </div>

                    <div>
                        <h2>Client Information</h2>
                        <div>
                            <div>PI Name</div>
                            <div>Sugunan Varkey</div>
                        </div>
                        <div>
                            <div>Client Email</div>
                            <div>sugunan.varkey@iitm.ac.in</div>
                        </div>
                        <div>
                            <div>Organization/Institution</div>
                            <div>IIT Madras</div>
                        </div>
                        <div>
                            <div>Lab/Department</div>
                            <div>Tomman Memorial Nanobiology Lab</div>
                        </div>
                    </div>

                    <div>
                        <h2>Sample Submission Details</h2>
                        <div>
                            <div>Service Name</div>
                            <div>Exome Sequencing - Standard (Germline)</div>
                        </div>
                        <div>
                            <div>Technology</div>
                            <div>NGS</div>
                        </div>
                        <div>
                            <div>Application</div>
                            <div>DNA</div>
                        </div>
                        <div>
                            <div>Number of Samples</div>
                            <div>3,653</div>
                        </div>
                        <div>
                            <div>Replicates Present</div>
                            <div>Yes</div>
                        </div>
                        <div>
                            <div>Extraction Needed</div>
                            <div>No</div>
                        </div>
                        <div>
                            <div>Treated with RNAase</div>
                            <div>Yes</div>
                        </div>
                        <div>
                            <div>Name of the Kit</div>
                            <div>NEB Ultra DNA Detection Kit</div>
                        </div>
                        <div>
                            <div>QC Assessed By</div>
                            <div>Nanodrop</div>
                        </div>
                        <div>
                            <div>Bioinformatics Analysis</div>
                            <div>Required</div>
                        </div>
                        <div>
                            <div>Key Objectives</div>
                            <div>Comprehensive genomic analysis to identify germline variants associated with hereditary conditions. Focus on exonic regions to detect pathogenic mutations and variants of uncertain significance.</div>
                        </div>
                        <div>
                            <div>Comparisons for Differential Analysis</div>
                            <div>Case-control comparison between affected individuals and healthy controls. Family-based segregation analysis to track variant inheritance patterns.</div>
                        </div>
                        <div>
                            <div>Additional Analysis</div>
                            <div>Pathway enrichment analysis, variant annotation with clinical databases (ClinVar, OMIM), and population frequency assessment using gnomAD database.</div>
                        </div>
                        <div>
                            <div>Reference Studies</div>
                            <div>www.theracues.com, www.tutu.com</div>
                        </div>
                        <div>
                            <div>Sample Submission Table</div>
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Sample ID</th>
                                            <th>Description</th>
                                            <th>RNA Conc.</th>
                                            <th>Notes</th>
                                            <th>Replicate (Group Name)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Sam_001</td>
                                            <td>Blood sample from proband - Family A</td>
                                            <td>8.14</td>
                                            <td>High quality extraction</td>
                                            <td>GP_1</td>
                                        </tr>
                                        <tr>
                                            <td>Sam_002</td>
                                            <td>Blood sample from mother - Family A</td>
                                            <td>7.92</td>
                                            <td>Optimal concentration</td>
                                            <td>GP_1</td>
                                        </tr>
                                        <tr>
                                            <td>Sam_003</td>
                                            <td>Blood sample from father - Family A</td>
                                            <td>8.45</td>
                                            <td>High quality extraction</td>
                                            <td>GP_1</td>
                                        </tr>
                                        <tr>
                                            <td>Sam_004</td>
                                            <td>Blood sample from sibling - Family A</td>
                                            <td>7.68</td>
                                            <td>Good quality</td>
                                            <td>GP_1</td>
                                        </tr>
                                        <tr>
                                            <td>Sam_005</td>
                                            <td>Control sample - unaffected</td>
                                            <td>8.21</td>
                                            <td>Reference sample</td>
                                            <td>GP_2</td>
                                        </tr>
                                        <tr>
                                            <td>Sam_006</td>
                                            <td>Control sample - unaffected</td>
                                            <td>7.95</td>
                                            <td>Reference sample</td>
                                            <td>GP_2</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <div>
                                <button>Upload QC Report - New and Existing</button>
                                <button>Download Sample Submission Report</button>
                                <button>Send QC Report</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2>QC and Other Details</h2>
                        <div>
                            <div>Method Writeup</div>
                            <div>DNA extraction was performed using standard phenol-chloroform protocol followed by ethanol precipitation. Quality assessment was conducted using spectrophotometry and gel electrophoresis to ensure sample integrity.</div>
                        </div>
                        <div>
                            <div>Method Summary</div>
                            <div>High-throughput exome sequencing using Illumina platform with 100x average coverage. Library preparation using NEB Ultra II kit with dual indexing for multiplexing capabilities.</div>
                        </div>
                        <div>
                            <div>QC Summary</div>
                            <div>All samples passed quality control metrics with A260/A280 ratios between 1.8-2.0 and RNA integrity numbers above 7.5. Samples exhibit optimal concentration and purity for downstream sequencing applications.</div>
                        </div>
                        <div>
                            <div>QC Report</div>
                            <div>
                                <div style={{
                                    background: '#f9fafb',
                                    padding: '48px',
                                    borderRadius: '8px',
                                    border: '2px dashed #cbd5e1',
                                    textAlign: 'center',
                                    color: '#6b7280',
                                    fontStyle: 'italic',
                                    minHeight: '300px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '16px'
                                }}>
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                        <path d="M12 3v6h6"/>
                                    </svg>
                                    <div>PDF Report Viewer</div>
                                    <div style={{fontSize: '0.85rem'}}>Quality control report will be displayed here</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>QC Table</div>
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Sample ID</th>
                                            <th>theraCUES Sample ID</th>
                                            <th>Qubit RNA Conc. (ng/ul)</th>
                                            <th>Integrity Number</th>
                                            <th>Comments</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Sam_001</td>
                                            <td>SAMBA_734847</td>
                                            <td>167</td>
                                            <td>8.14</td>
                                            <td>Optimal</td>
                                        </tr>
                                        <tr>
                                            <td>Sam_002</td>
                                            <td>SAMBA_734848</td>
                                            <td>152</td>
                                            <td>7.92</td>
                                            <td>Optimal</td>
                                        </tr>
                                        <tr>
                                            <td>Sam_003</td>
                                            <td>SAMBA_734849</td>
                                            <td>178</td>
                                            <td>8.45</td>
                                            <td>Excellent</td>
                                        </tr>
                                        <tr>
                                            <td>Sam_004</td>
                                            <td>SAMBA_734850</td>
                                            <td>145</td>
                                            <td>7.68</td>
                                            <td>Good</td>
                                        </tr>
                                        <tr>
                                            <td>Sam_005</td>
                                            <td>SAMBA_734851</td>
                                            <td>163</td>
                                            <td>8.21</td>
                                            <td>Optimal</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div>
                            <div>
                                <button>Download QC Report</button>
                                <button>Send QC Report</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2>Library QC Details</h2>
                        <div>
                            <div>Library QC Summary</div>
                            <div>Library preparation successful with optimal fragment size distribution (300-400bp). Adequate library concentration achieved for sequencing platform. Quality metrics meet all specified thresholds.</div>
                        </div>
                        <div>
                            <div>Library QC Report</div>
                            <div>
                                <div style={{
                                    background: '#f9fafb',
                                    padding: '48px',
                                    borderRadius: '8px',
                                    border: '2px dashed #cbd5e1',
                                    textAlign: 'center',
                                    color: '#6b7280',
                                    fontStyle: 'italic',
                                    minHeight: '300px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '16px'
                                }}>
                                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                                        <path d="M12 3v6h6"/>
                                    </svg>
                                    <div>PDF Report Viewer</div>
                                    <div style={{fontSize: '0.85rem'}}>Library QC report will be displayed here</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <button>Upload Library Report - New and Existing</button>
                                <button>Download Library Report</button>
                                <button>Send Library QC Report</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}