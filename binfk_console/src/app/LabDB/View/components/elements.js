import styles from '../ViewComp.module.css'
import { QcReportPushForm, LibQcReportPushForm, BinfReportPushForm } from './elemoptions';



export function SampleSubDetailsComp({samsubDetails}){
    return(

        <>
            <div className={styles.GridThree}>
                <div className={styles.ProjecIn}>
                    <div>Service Name</div>
                    <div>{samsubDetails.service_name}</div>
                </div>
                <div className={styles.ProjecIn} >
                    <div>Technology</div>
                    <div>{samsubDetails.service_technology}</div>
                </div>
                <div className={styles.ProjecIn}>
                    <div>Application</div>
                    <div>{samsubDetails.application}</div>
                </div>
            </div>

            <div className={styles.GridTwo}>
                <div>
                    <div className={styles.ProjecIn}>
                        <div>Number of Samples</div>
                        <div>{samsubDetails.sample_number}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Replicates Present</div>
                        <div>{samsubDetails.replicates}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Extraction Needed</div>
                        <div>{samsubDetails.extraction_needed}</div>
                    </div>
                </div>
                <div>
                    <div className={styles.ProjecIn}>
                        <div>Treated with RNAase</div>
                        <div>{samsubDetails.nucleases}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Name of the Kit</div>
                        <div>{samsubDetails.kit_name}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Bioinformatics Analysis</div>
                        <div>{samsubDetails.bioinformatics_required}</div>
                    </div>                    
                </div>
            </div>

            <div>
                <div>
                    <div className={styles.ProjecIn}>
                        <div>Key Objectives</div>
                        <div>{samsubDetails.key_objectives}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Comparisons for Differential Analysis</div>
                        <div>{samsubDetails.comparisons}</div>
                    </div>
                </div>
                <div>
                    <div className={styles.ProjecIn}>
                        <div>Additional Analysis</div>
                        <div>{samsubDetails.additional_analysis}</div>
                    </div>
                    <div className={styles.ProjecIn}>
                        <div>Reference Studies</div>
                        <div>{samsubDetails.reference_studies}</div>
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
                                    <th>Conc.</th>
                                    <th>Notes</th>
                                    <th>{`Replicate (Group Name)`}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {samsubDetails.sample_details.map((comp, index) => (
                                    <tr key={index}>
                                        <td>{comp["sample_id"]}</td>
                                        <td>{comp["description"]}</td>
                                        <td>{comp["concentration"]}</td>
                                        <td>{comp["notes"]}</td>
                                        <td>{comp["replicate_group"]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className={styles.GridTwo}>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecOnBtn}>{`Download Form (.pdf)`}</button>
                </div>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecOnBtn}>{`Download Form (.csv)`}</button>
                </div>
            </div>
        </>
    );
}


export function QcSamDetailsComp({qcDetails}) {
    return(
        <>
            <div className={styles.GridTwo}>
                <div className={styles.ProjecIn}>
                    <div>Method Writeup</div>
                    <div>{qcDetails.writeup}</div>
                </div>
                <div className={styles.ProjecIn}>
                    <div>Method Summary</div>
                    <div>{qcDetails.method_summary}</div>
                </div>
            </div>
            <div className={styles.GridTwo}>
                <div className={styles.ProjecIn}>
                    <div>Concentration measured by</div>
                    <div>{qcDetails.concentration_technology}</div>
                </div>
                <div className={styles.ProjecIn}>
                    <div>Integrity measured by</div>
                    <div>{qcDetails.integrity_technology}</div>
                </div>
            </div>
            <div className={styles.ProjecIn}>
                <div>QC Summary</div>
                <div>{qcDetails.qc_summary}</div>
            </div>
            <div className={styles.ProjecIn}>
                <div>QC Report</div>

                <div
                    style={{
                    background: "#f9fafb",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "2px dashed #cbd5e1",
                    minHeight: "400px",
                    }}
                >
                    <iframe
                    src={`http://localhost:4080${qcDetails.qc_report}`} 
                    width="100%"
                    height="500px"
                    style={{ border: "none", borderRadius: "6px" }}
                    title="QC Report PDF"
                    />
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
                                    <th>Conc</th>
                                    <th>Integrity Number</th>
                                    <th>Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    qcDetails.qc_sample_details.map((comp, index) => {
                                        return(
                                            <tr key={index}>
                                                <td>{comp["sample_id"]}</td>
                                                <td>{comp["tcues_sample_id"]}</td>
                                                <td>{comp["nucleic_acid_conc"]}</td>
                                                <td>{comp["integrity"]}</td>
                                                <td>{comp["comments"]}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className={styles.GridTwo}>
                <div className={styles.ProjecInOnBtn }>
                    <button className={styles.ProjecOnBtn}>{`Download QC Report(.pdf)`}</button>
                </div>
                <div className={styles.ProjecInOnBtn }>
                    <button className={styles.ProjecOnBtn}>{`Send QC Report`}</button>
                </div>
            </div>
        </>
    );
}





export function LibSamDetailsComp({libqcDetails}) {
    return(
        <>  
            <div className={styles.ProjecIn}>
                <div>Library QC Method</div>
                <div>{libqcDetails.library_method}</div>
            </div> 
            <div className={styles.ProjecIn}>
                <div>Library QC Summary</div>
                <div>{libqcDetails.library_summary}</div>
            </div>
            <div className={styles.ProjecIn}>
                <div>Library QC Report</div>
                <div
                    style={{
                    background: "#f9fafb",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "2px dashed #cbd5e1",
                    minHeight: "400px",
                    }}
                >
                    <iframe
                    src={`http://localhost:4080${libqcDetails.library_report}`} 
                    width="100%"
                    height="500px"
                    style={{ border: "none", borderRadius: "6px" }}
                    title="QC Report PDF"
                    />
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
                                    <th>Conc</th>
                                    <th>Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    libqcDetails.qc_sample_details.map((comp, index) => {
                                        return(
                                            <tr key={index}>
                                                <td>{comp["sample_id"]}</td>
                                                <td>{comp["tcues_sample_id"]}</td>
                                                <td>{comp["nucleic_acid_conc"]}</td>
                                                <td>{comp["comments"]}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className={styles.GridTwo}>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecOnBtn}>{`Download Lib QC Report(.pdf)`}</button>
                </div>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecOnBtn}>{`Send Lib QC Report`}</button>
                </div>
            </div>
        </>
    );
}


export function BiinfoDetailsComp({binfDetails}) {
    return(
        <>   
            <div className={styles.ProjecIn}>
                <div>Analysis summary</div>
                <div>{binfDetails.bioinformatics_summary}</div>
            </div>
            <div className={styles.GridTwo}>
                <div className={styles.ProjecIn}>
                    <div>Estimated number of hours to complete the analysis</div>
                    <div>{binfDetails.estimated_hours}</div>
                </div>
                <div className={styles.ProjecIn}>
                    <div>Approximate number of hours spend for the analysss completion</div>
                    <div>{binfDetails.approximate_hours}</div>
                </div>
            </div>
            <div className={styles.ProjecIn}>
                <div>Bioinformatics Analysis Report</div>
            <div className={styles.ProjecIn}>
                <div>Library QC Report</div>
                <div
                    style={{
                    background: "#f9fafb",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "2px dashed #cbd5e1",
                    minHeight: "400px",
                    }}
                >
                    <iframe
                    src={`http://localhost:4080${binfDetails.bioinformatics_report}`} 
                    width="100%"
                    height="500px"
                    style={{ border: "none", borderRadius: "6px" }}
                    />
                </div>
            </div>
            </div>
            <div className={styles.GridThree}>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecOnBtn}>{`Download Analysis Report (.pdf)`}</button>
                </div>
                <div className={styles.ProjecInOnBtn}>
                    <button className={styles.ProjecOnBtn}>{`Send Analysis Report`}</button>
                </div>
            </div>
        </>
    );
}



export function ReportsComp() {
    return(
        <>   
            <div className={styles.ProjecIn}>
                <div>Collated Final Report</div>
                <div style={{ background: "#f9fafb", padding: "16px", borderRadius: "8px", border: "2px dashed #cbd5e1", minHeight: "400px",}}>
                    <iframe
                    src={`http://localhost:4080${binfDetails.bioinformatics_report}`} 
                    width="100%"
                    height="500px"
                    style={{ border: "none", borderRadius: "6px", background: "#f9fafb" }}
                    title="QC Report PDF"
                    />
                </div>
            </div>
            <div className={styles.GridThree}>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Download Final Report (.pdf)`}</button>
                </div>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Send Final Report`}</button>
                </div>
            </div>
            <div className={styles.GridThree}>
                <div className={styles.ProjecIn}>
                    <div></div>
                </div>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>Close project</button>
                </div>
            </div>
        </>
    );
}

  