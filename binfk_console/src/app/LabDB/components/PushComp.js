import {useState} from 'react'
import axios from 'axios'
import styles from './PushComp.module.css'

export function PushComp(){

    const [pushComponent, setPushComponents] = useState({

        updated_by: "",
        project_id: "",
        title: "",
        customer: "",
        organization: "",
        sam_type: "",
        count: "",
        preservation: "",
        other_info: "",
        method_name: "",
        method_writeup: "",
        method_summary: "",
        quantification: null,
        integrity: null,
        qc_summary: "",
        lib_method: "",
        lib_report: null,
        lib_tape: null,
        lib_summary: ""
    })


    return(
        <div className={styles.PushcompDiv} >
            <UpdateInfo data={pushComponent} onChange={OnPushBtn} />
            <ProjectId data={pushComponent} onChange={OnPushBtn} />
            <SamAssayInfo data={pushComponent} onChange={OnPushBtn} />
            <MethodInfo data={pushComponent} onChange={OnPushBtn} />    
            <RawQcs data={pushComponent} onChange={OnPushBtn} />
            <LibQcs data={pushComponent} onChange={OnPushBtn} />
            <PushBtn SubmitPush = {SubmitPushForm} />
        </div>
    );
}




function UpdateInfo({data, onChange}) {
  return (
    <div className={styles.PushSec}>

        <h2>Update uploader info</h2>

        <label htmlFor="updatedBy">Select the updater</label>

        <select value={data.updated_by} onChange={onChange} id="updatedBy" name="updated_by" required >
            <option value="" disabled>Select</option>
            <option value="Vijayalakshmi Bhat">Vijayalakshmi Bhat</option>
            <option value="Rahul Reghunath">Rahul Reghunath</option>
            <option value="Deschica Dechamma">Deschica Dechamma</option>
        </select>

    </div>
  );
}

function ProjectId({data, onChange}) {
    return(
        <div className={styles.PushSec}>
            <h2>Project Info</h2>
            <label htmlFor="updateprojectId">ID</label>
            <input value={data.project_id} onChange={onChange} type="text" id="updateprojectId" name="project_id" required />
            <label htmlFor="updateprojectTitle">Title</label>
            <input value={data.title} onChange= {onChange} type="text" id="updateprojectTitle" name="title" required />
            <label htmlFor="updateprojectCustomer">Customer name</label>
            <input value={data.customer} onChange= {onChange} type="text" id="updateprojectCustomer" name="customer" required />
            <label htmlFor="updateOrg">Institute/Organisation</label>
            <input value={data.organization} onChange= {onChange} type="text" id="updateOrg" name="organization" required />
        </div>
    );
}

function SamAssayInfo({data, onChange}) {
    return(

        <div className={styles.PushSec}>
            <h2>Update sample and assay info and reports</h2>
            <label htmlFor="updateSampletype">Sample type</label>
            <select value={data.sam_type} onChange= {onChange} id="updateSampletype" name="sam_type" required>
                <option value="" disabled>Select</option>
                <option value="Blood">Blood</option>
                <option value="Plasma">Plasma</option>
                <option value="Serum">Serum</option>
                <option value="CSF">CSF</option>
                <option value="Cells">Cells</option>
                <option value="Tissue">Tissue</option>
                <option value="Stool">Stool</option>
                <option value="Environmental">Environmental</option>
                <option value="Urine">Urine</option>
                <option value="Saliva">Saliva</option>
                <option value="Tear">Tear</option>
                <option value="Milk">Milk</option>
                <option value="Others">Others</option>
            </select>
            <label htmlFor="updatesampleNos">Total number of samples</label>
            <input value={data.count} onChange= {onChange} type="number" id="updatesampleNos" name="count" required />
            <label htmlFor="updateSamplepreservation">Sample Preservation method</label>
            <select value={data.preservation} onChange= {onChange} id="updateSamplepreservation" name="preservation" required>
                <option value="" disabled>select</option>
                <option value="Frozen">Frozen</option>
                <option value="FFPE">FFPE</option>
                <option value="Rnalater">RNA later</option>
                <option value="Alcohol">Alcohol</option>
                <option value="TrisolLysate">Trisol lysate</option>
                <option value="Others">Others</option>
            </select>
            <label htmlFor="updateSampleinfo">Any other information</label>
            <textarea value={data.other_info} onChange= {onChange} id="updateSampleinfo" rows="5" cols="40" name="other_info" required></textarea>
        </div>
                                                                                                                                                                                                                                                                 

    );
}

function MethodInfo({data, onChange}) {
    return(
        <div className={styles.PushSec}>
            <h2>Update methods</h2>
            <label htmlFor="updateMethod">Method</label>
            <select value={data.method_name} onChange= {onChange} id="updateMethod" name="method_name" required>
                <option value="" disabled>select</option>
                <option value="nCounter">nCounter</option>
                <option value="GeoMx">GeoMx</option>
                <option value="RnaSeq">Rna-Seq</option>
                <option value="WGS">WGS</option>
                <option value="WGM_Seq">Whole genome metagenome</option>
                <option value="sRNASeq">Small RNA-Seq</option>
                <option value="tRNASeq">Total RNA-Seq</option>
                <option value="MetaTrnscrptome">Meta Transcriptome</option>
                <option value="Others">Others</option>
            </select>
            <label htmlFor="updatemethodWritup">Method writeup</label>
            <textarea value={data.method_writeup} onChange= {onChange} id="updatemethodWritup" rows="5" cols="40" name="method_writeup" required></textarea>
            <label htmlFor="updatemethodSummary">Summary</label>
            <textarea value={data.method_summary} onChange= {onChange} id="updatemethodSummary" rows="5" cols="40" name="method_summary"
                required></textarea>
        </div>

    );
}

function RawQcs({data, onChange}){
    return(
            <div className={styles.PushSec}>
                <h2>Update QC Report and Summary</h2>
                <label htmlFor="quantitationQc">Upload quantitation QC Report (accepted formats: .pdf)</label>
                <input onChange= {onChange} type="file" id="quantitationQc" name="quantification"
                    accept=".pdf" required />
                <label htmlFor="integrityQc">Upload integrity QC Report (accepted formats: .csv,)</label>
                <input onChange= {onChange} type="file" id="integrityQc" name="integrity" accept=".csv, .xlsx, .pdf" required />
                <label htmlFor="qcSummary">{`Give the overall summary of the Qc's`} </label>
                <textarea value={data.qc_summary} onChange= {onChange} id="qcSummary" rows="5" cols="40" name="qc_summary" required></textarea>
            </div>
       
    );
}

function LibQcs({data, onChange}) {
    return(

        <div className={styles.PushSec}>
            <h2>Library QC Reports</h2>
            <label htmlFor="libMethod">Method</label>
            <select value={data.lib_method} onChange= {onChange} id="libMethod" name="lib_method">
                <option value="" disabled>select</option>
                <option value="totalRNA">total RNA</option>
                <option value="mRNA">mRNA</option>
                <option value="miRNA">miRNA</option>
                <option value="DNA">DNA</option>
                <option value="Others">Others</option>
            </select>
            <label htmlFor="libReport">Upload Library QC Report (accepted formats: pdf)</label>
            <input onChange= {onChange} type="file" id="libReport" name="lib_report" accept=".pdf" />
            <label htmlFor="libTapeReport">Upload Library QC Tapestation/BA report (accepted formats:
                pdf)</label>
            <input onChange= {onChange} type="file" id="libTapeReport" name="lib_tape" accept=".pdf" />
            <label htmlFor="lib_Summary">{`Give the overall summary of the QC's`}</label>
            <textarea value={data.lib_summary} onChange= {onChange} id="lib_Summary" rows="5" cols="40" name="lib_summary" ></textarea>
        </div>

    );
}

function PushBtn({SubmitPush}) {

    return(
    <div className={styles.PushSec}>
        <button onClick={SubmitPush}>PUSH</button>
    </div>
    );
}