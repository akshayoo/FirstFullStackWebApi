import styles from '../ViewComp.module.css'

export function QcReportPushForm(){
    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Upload QC and Method Data</h3>
                <button >X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Method Writeup</label>
                        <textarea rows='6' />
                    </div>
                    <div className={styles.formElem}>
                        <label>Method Summary</label>
                        <textarea rows ='6' />
                    </div>
                </div>

                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <div className={styles.formElemel}>
                            <label>Concentration assessed by</label>
                            <select>
                                <option>Qubit</option>
                                <option>NanoDrop</option>
                                <option>TapeStation</option>
                                <option>BioAnalyzer</option>
                            </select>
                        </div>
                        <div className={styles.formElemel}>
                            <label>Integrity assessed by</label>
                            <select>
                                <option>Qubit</option>
                                <option>NanoDrop</option>
                                <option>TapeStation</option>
                                <option>BioAnalyzer</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formElem}>
                        <label>QC Summary</label>
                        <textarea rows='6' />
                    </div>
                </div>
                <div className={styles.formElem}>
                    <label>{`Upload QC Report(.pdf)`}</label>
                    <input type='file' accept='.csv'/>
                </div>
                <div className={styles.formElem}>
                    <label>{`Upload QC data(.csv)`}</label>
                    <input type='file' accept='.csv'/>
                </div>
            </div>

            </div>
        </div>
    )
}

export function LibQcReportPushForm(){
    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

                <div className={styles.modalHeader}>
                    <h3>Upload QC and Method Data</h3>
                    <button >X</button>
                </div>

                <div className={styles.modalBody}>
                    <div className={styles.GridTwo}>
                        <div className={styles.formElem}>
                            <label>Lib QC Summary</label>
                            <textarea rows='6' />
                        </div>
                        <div className={styles.formElem}>
                            <label>Method Summary</label>
                            <textarea rows ='6' />
                        </div>
                    </div>
                    <div className={styles.formElem}>
                        <label>{`Upload Lib Report(.pdf)`}</label>
                        <input type='file' accept='.csv'/>
                    </div>
                    <div className={styles.formElem}>
                        <label>{`Upload Lib QC data(.csv)`}</label>
                        <input type='file' accept='.csv'/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export function BinfReportPushForm(){
    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Upload Analysis Data</h3>
                <button >X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Analysis Summary</label>
                        <textarea rows='6'/>
                    </div>
                    <div className={styles.formElem}>
                        <label>Approximate hours spend for the analysis</label>
                        <input type='number' name='approximate_hours'/>
                    </div>
                </div>
                <div className={styles.formElem}>
                    <label>{`Upload Analysis Report(.pdf)`}</label>
                    <input type='file' accept='.csv'/>
                </div>
            </div>

            </div>
        </div>
    )
}