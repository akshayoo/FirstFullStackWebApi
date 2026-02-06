import styles from '../ViewComp.module.css'

export function ViewWin (){
    return(
        <div className={styles.ViewWin}>
            <div className={styles.contentWin}>
                <div className={styles.ProjectView}>
                    <ViewProjDetails/>
                    <StatusPop />
                    <SampleSubDetails />
                    <QcSamDetails />
                    <LibSamDetails />
                </div>
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
                <h2 className={styles.sech}>Sample Submission Details</h2>
                <button className={styles.fieldPop}>&#8693;</button>
            </div>

            <div className={styles.GridTwo}>
                <div className={styles.TaskProp}>
                    <div>Standard Tasks</div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                </div>
                <div className={styles.TaskProp}>
                    <div>Added Tasks</div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
                    </div>
                    <div className={styles.TaskComp}>
                        <div>Number of Samples</div>
                        <button>Mark Done</button>
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

            <div className={styles.GridThree}>
                <div className={styles.ProjecIn}>
                    <div>Service Name</div>
                    <div>Exome Sequeiehrwereijijncing - Standard (Germline)</div>
                </div>
                <div className={styles.ProjecIn} >
                    <div>Technology</div>
                    <div>NGS</div>
                </div>
                <div className={styles.ProjecIn}>
                    <div>Application</div>
                    <div>DNA</div>
                </div>
            </div>

            <div className={styles.GridTwo}>
                <div>
                    <div className={styles.ProjecIn}>
                        <div>Number of Samples</div>
                        <div>3,653</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Replicates Present</div>
                        <div>Yes</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Extraction Needed</div>
                        <div>No</div>
                    </div>
                </div>
                <div>
                    <div className={styles.ProjecIn}>
                        <div>Treated with RNAase</div>
                        <div>Yes</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Name of the Kit</div>
                        <div>NEB Ultra DNA Detection Kit</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Bioinformatics Analysis</div>
                        <div>Required</div>
                    </div>                    
                </div>
            </div>

            <div>
                <div>
                    <div className={styles.ProjecIn}>
                        <div>Key Objectives</div>
                        <div>Comprhjedbnfjfnjvkrfn gkjnt gkbg   ain sigtgrtnthyitftihcrtahnrchtrehrh.rh</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Comparisons for Differential Analysis</div>
                        <div>Casecekjfh ij3hfnij4nfij4hi nmkf nieh  okerkjfokemekojoi joitjrui9tyrtn nerns.</div>
                    </div>
                </div>
                <div>
                    <div className={styles.ProjecIn}>
                        <div>Additional Analysis</div>
                        <div>Paejfijrebn ihbiuhngirjutgnr iujhnrhni jnijrnijn gijrnhtij nmntgirjngiur jirntgijrh abagfbfgse.</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Reference Studies</div>
                        <div>www.theracues.com, www.tutu.com</div>
                    </div>
                </div>
            </div>
            <div className={styles.ProjecTabView}>
                <div>Sample Submission Table</div>
                <div className={styles.SamSubTables}>
                    <div>
                        <table className={styles.TableCont}>
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
                                    <td>Sam_001</td>
                                    <td>Blood sample from proband - Family A</td>
                                    <td>8.14</td>
                                    <td>High quality extraction</td>
                                    <td>GP_1</td>
                                </tr>
                                <tr>
                                    <td>Sam_001</td>
                                    <td>Blood sample from proband - Family A</td>
                                    <td>8.14</td>
                                    <td>High quality extraction</td>
                                    <td>GP_1</td>
                                </tr>
                                <tr>
                                    <td>Sam_001</td>
                                    <td>Blood sample from proband - Family A</td>
                                    <td>8.14</td>
                                    <td>High quality extraction</td>
                                    <td>GP_1</td>
                                </tr>
                                <tr>
                                    <td>Sam_001</td>
                                    <td>Blood sample from proband - Family A</td>
                                    <td>8.14</td>
                                    <td>High quality extraction</td>
                                    <td>GP_1</td>
                                </tr>
                                <tr>
                                    <td>Sam_001</td>
                                    <td>Blood sample from proband - Family A</td>
                                    <td>8.14</td>
                                    <td>High quality extraction</td>
                                    <td>GP_1</td>
                                </tr>
                                <tr>
                                    <td>Sam_001</td>
                                    <td>Blood sample from proband - Family A</td>
                                    <td>8.14</td>
                                    <td>High quality extraction</td>
                                    <td>GP_1</td>
                                </tr>
                                <tr>
                                    <td>Sam_001</td>
                                    <td>Blood sample from proband - Family A</td>
                                    <td>8.14</td>
                                    <td>High quality extraction</td>
                                    <td>GP_1</td>
                                </tr>
                                <tr>
                                    <td>Sam_001</td>
                                    <td>Blood sample from proband - Family A</td>
                                    <td>8.14</td>
                                    <td>High quality extraction</td>
                                    <td>GP_1</td>
                                </tr>
                                <tr>
                                    <td>Sam_001</td>
                                    <td>Blood sample from proband - Family A</td>
                                    <td>8.14</td>
                                    <td>High quality extraction</td>
                                    <td>GP_1</td>
                                </tr>
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
                                    <td>Sam_002</td>
                                    <td>Blood sample from mother - Family A</td>
                                    <td>7.92</td>
                                    <td>Optimal concentration</td>
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
                                    <td>Sam_002</td>
                                    <td>Blood sample from mother - Family A</td>
                                    <td>7.92</td>
                                    <td>Optimal concentration</td>
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
            </div>
            <div className={styles.GridTwo}>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Download Form (.pdf)`}</button>
                </div>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Download Form (.csv)`}</button>
                </div>
            </div>
        </div>
    );
}











function QcSamDetails() {
    return(
        <div className={styles.ProjectComp}>

            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Sample Submission Details</h2>
                <button className={styles.fieldPop}>&#8693;</button>
            </div>

            <div className={styles.GridTwo}>
                <div className={styles.ProjecIn}>
                    <div>Method Writeup</div>
                    <div>DNA extraction wergrtyhrthrthtrhthtyllowed by ethanohhntglity asswekfhweifbjewr yurgfiuhbfijehfiueh ibiue hfuehfuj iorhniegrity.</div>
                </div>
                <div className={styles.ProjecIn}>
                    <div>Method Summary</div>
                    <div>High-throughnghhnghnghngh coverage. Libredgjbjgjhga II kiwkhfgejf ehe bfejrfejf jefeilities.</div>
                </div>
            </div>
            <div className={styles.ProjecIn}>
                <div>QC Summary</div>
                <div>Awkjhfbejif efehifbiebniejonoeijrgnirgnjrokjgnro rnoijhjnrio0jmrpk ri0jrijrpgoikroi0ru oirjkpoijhiohjojkfnhfoijh oighnogh jiofnjnhf ihjifhiujn fnions.</div>
            </div>
            <div className={styles.ProjecIn}>
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
                        <div style={{fontSize: '0.85rem'}}>Quality control reporty</div>
                    </div>
                </div>
            </div>

            <div className={styles.ProjecTabView}>
                <div>QC Table</div>
                <div className={styles.SamSubTables}>
                    <div>
                        <table className={styles.TableCont}>
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
            </div>
            <div className={styles.GridFour}>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Download Template (.csv)`}</button>
                </div>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Upload QC Data`}</button>
                </div>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Download QC Report (.pdf)`}</button>
                </div>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Send QC Report`}</button>
                </div>
            </div>
        </div>
    );
}





function LibSamDetails() {
    return(
        <div className={styles.ProjectComp}>

            <div className={styles.HeadComp}>
                <h2 className={styles.sech}>Sample Submission Details</h2>
                <button className={styles.fieldPop}>&#8693;</button>
            </div>
            
            <div className={styles.ProjecIn}>
                <div>Library QC Summary</div>
                <div>Library preparation successful with optimal fragment size distribution (300-400bp). Adequate library concentration achieved for sequencing platform. Quality metrics meet all specified thresholds.</div>
            </div>
            <div className={styles.ProjecIn}>
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
                        <div style={{fontSize: '0.85rem'}}>Library qc rwport will be here</div>
                    </div>
                </div>
            </div>
            <div className={styles.GridThree}>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Upload Lib QC Data`}</button>
                </div>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Download Lib QC Report (.pdf)`}</button>
                </div>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Send Lib QC Report`}</button>
                </div>
            </div>
        </div>
    );
}
