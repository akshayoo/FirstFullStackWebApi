import styles from '../ViewComp.module.css'
import axios from 'axios'
import { useState } from 'react'

export function SentQcReport({setQcEmailTemp}) {
    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Send QC Report</h3>
                <button onClick={() => setQcEmailTemp(false)} >X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Add CC</label>
                        <textarea name="method_summary" rows ='2' placeholder="Separate mail Id's by a ','" />
                    </div>
                </div>
                <div className={styles.formElemel}>
                    <label>Enter Subject</label>
                    <textarea name="mail_subject" rows = '2' placeholder="Email Subject"/>
                </div>
                <div className={styles.formElemel}>
                    <label>Enter mail content</label>
                    <textarea name="mail_subject" rows = '8' placeholder="Email body"/>
                </div>
                <div className={styles.formElem}>
                    <button>SEND</button>
                </div>
            </div>

            </div>
        </div>
    )
}


export function SentLibReport({setLibqcEmailTemp}) {
    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Send Library QC Report</h3>
                <button onClick={setLibqcEmailTemp(false)} >X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Add CC</label>
                        <textarea name="method_summary" rows ='2' placeholder="Separate mail Id's by a ','" />
                    </div>
                </div>
                <div className={styles.formElemel}>
                    <label>Enter Subject</label>
                    <textarea name="mail_subject" rows = '2' placeholder="Email Subject"/>
                </div>
                <div className={styles.formElemel}>
                    <label>Enter mail content</label>
                    <textarea name="mail_subject" rows = '8' placeholder="Email body"/>
                </div>
                <div className={styles.formElem}>
                    <button>SEND</button>
                </div>
            </div>

            </div>
        </div>
    )
}


export function SentBioinfoReport(){
    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Send Analysis Report</h3>
                <button>X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Add CC</label>
                        <textarea name="method_summary" rows ='2' placeholder="Separate mail Id's by a ','" />
                    </div>
                </div>
                <div className={styles.formElemel}>
                    <label>Enter Subject</label>
                    <textarea name="mail_subject" rows = '2' placeholder="Email Subject"/>
                </div>
                <div className={styles.formElemel}>
                    <label>Enter mail content</label>
                    <textarea name="mail_subject" rows = '8' placeholder="Email body"/>
                </div>
                <div className={styles.formElem}>
                    <button>SEND</button>
                </div>
            </div>

            </div>
        </div>
    )
}

export function SentOverallReport() {
    return(
        <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>

            <div className={styles.modalHeader}>
                <h3>Send Overall Project Report Report</h3>
                <button>X</button>
            </div>

            <div className={styles.modalBody}>
                <div className={styles.GridTwo}>
                    <div className={styles.formElem}>
                        <label>Add CC</label>
                        <textarea name="method_summary" rows ='2' placeholder="Separate mail Id's by a ','" />
                    </div>
                </div>
                <div className={styles.formElemel}>
                    <label>Enter Subject</label>
                    <textarea name="mail_subject" rows = '2' placeholder="Email Subject"/>
                </div>
                <div className={styles.formElemel}>
                    <label>Enter mail content</label>
                    <textarea name="mail_subject" rows = '8' placeholder="Email body"/>
                </div>
                <div className={styles.formElem}>
                    <button>SEND</button>
                </div>
            </div>

            </div>
        </div>
    )
}