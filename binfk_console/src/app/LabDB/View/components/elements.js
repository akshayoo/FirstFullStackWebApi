import styles from '../ViewComp.module.css'
import { QcReportPushForm } from './elemoptions';



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
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Download Form (.pdf)`}</button>
                </div>
                <div className={styles.ProjecIn}>
                    <button className={styles.ProjecInBtn}>{`Download Form (.csv)`}</button>
                </div>
            </div>
        </>
    );
}











export function QcSamDetailsComp(qcDetails) {
    return(
        <>
            <div className={styles.GridTwo}>
                <div className={styles.ProjecIn}>
                    <div>Method Writeup</div>
                    <div>{qcDetails.method_writeup}</div>
                </div>
                <div className={styles.ProjecIn}>
                    <div>Method Summary</div>
                    <div>{qcDetails.method_summary}</div>
                </div>
            </div>
            <div className={styles.GridTwo}>
                <div className={styles.ProjecIn}>
                    <div>Concentration measured by</div>
                    <div>{qcDetails.conc_tech}</div>
                </div>
                <div className={styles.ProjecIn}>
                    <div>Integrity measured by</div>
                    <div>{qcDetails.integrity_tech}</div>
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
                    src="/TC-S-BT-EPA-MDL.pdf"   
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
        </>
    );
}





export function LibSamDetailsComp() {
    return(
        <>   
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
        </>
    );
}
