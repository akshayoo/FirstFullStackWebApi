"use client"

import styles from './UpdateComp.module.css'
import { useState } from 'react';
import axios from 'axios';



export function UpdateComp(){


    const[projectIdcatch, setProjectIdcatch] = useState("")

    const[formData, setFormData] = useState(null)

    function DownloadUpFile(path) {
        if (!path) return;
        
        window.open(
            `http://localhost:4040/labdb/update/download?path=${encodeURIComponent(path)}`,
            "_blank"
        );
    }

    function changeHandle(e) {

        const { name, type, files, value } = e.target;

        setFormData(prev => ({
            ...(prev || {}),
            [name]: type === "file" ? files[0] : value
        }));
    }

    async function SearchByProjId(){

        if (!projectIdcatch.trim()) return;

        const payload = {
            "project_id" : projectIdcatch.trim()
        }

        try{
            const resp = await axios.post("http://localhost:4040/labdb/update/projectid", payload)

            if (!resp.data.data){
                alert(resp.data.status)
            }
            setFormData(resp.data.data)
        }

        catch(error){
            console.log(error + "Data fetch failed")
        }
    }

    async function SubmitUpdateEvent() {
        
        if (!formData) return

        const updateFormData = new FormData()

        const fileFields = ['quantification', 'integrity', 'lib_report', 'lib_tape']

        Object.entries(formData).forEach(([key, value]) => {
            if (fileFields.includes(key)) {
                if (value instanceof File) {
                    updateFormData.append(key, value);
                }
            } else if (key === "count") {
                updateFormData.append(key, Number(value));
            } else {
                updateFormData.append(key, value ?? "");
            }
        })

        try {
            const updateResponse = await axios.put("http://localhost:4040/labdb/update/updatedb",
                updateFormData
            )

            alert(updateResponse.data.status)
            setFormData(null)
            
        }

        catch(error) {
            console.log(error + "Data fetch failed")
        }
    }


    return(
        <div className={styles.PushcompDiv} >
            <div className={styles.upDesc}>
                <PageCont />
                <SearchById SearchByProjId={SearchByProjId} 
                    setProjectIdcatch={setProjectIdcatch} 
                    projectIdcatch={projectIdcatch}/>
            </div>
            <div className={styles.PushForm}>
                {formData && (
                <>  
                    <div className={styles.secComp}>
                        <UpdateInfo data={formData} onChange={changeHandle} />
                    </div>
                    <div className={styles.secComp}>
                        <ProjectId data={formData} onChange={changeHandle}/>
                        <SamAssayInfo data={formData} onChange={changeHandle}/>
                    </div>
                    <div className={styles.secComp}>
                        <MethodInfo data={formData} onChange={changeHandle}/>
                        <RawQcs data={formData} onChange={changeHandle} DownloadUpFile={DownloadUpFile}/>
                        <LibQcs data={formData} onChange={changeHandle} DownloadUpFile={DownloadUpFile}/>
                    </div>
                    <div className={styles.secComp}>
                        <UpdateBtn SubmitUpdate={SubmitUpdateEvent} />
                    </div>
                </>
            )}
            </div>
        </div>
    );
}


function PageCont(){
    return(
        <>
            <h2>Update your project data here</h2>
            <p>This is a description paragraph</p>
            <ul>
                <li>poiwhejifgiwehbwbgweuigiewbhfihehfe</li>
            </ul>   
        </>

    );
}

function SearchById({projectIdcatch, setProjectIdcatch, SearchByProjId}) {
    return (
        <div className={styles.SerchBid}>
            <h2>Serach By Project ID</h2>
            <input value={projectIdcatch} onChange={(e) => setProjectIdcatch(e.target.value)} type="text" id="updateprojectId" name="project_id" required/>
            <button onClick={SearchByProjId} className={styles.SearchPrId}>Search</button>
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
            <input value={data.project_id} onChange={onChange} type="text" id="updateprojectId" name="project_id" readOnly />
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

function RawQcs({data, onChange, DownloadUpFile}){
    return(
            <div className={styles.PushSec}>
                <h2>Update QC Report and Summary</h2>
                <label htmlFor="quantitationQc">Upload quantitation QC Report (accepted formats: .pdf)</label>
                <button type='button' onClick={()=> DownloadUpFile(data.quantification)}>View uploaded file</button>
                <input onChange= {onChange} type="file" id="quantitationQc" name="quantification"
                    accept=".pdf" />
                <label htmlFor="integrityQc">Upload integrity QC Report (accepted formats: .csv,)</label>
                <button type='button' onClick={() => DownloadUpFile(data.integrity)}>View uploaded file</button>
                <input onChange= {onChange} type="file" id="integrityQc" name="integrity" accept=".csv, .xlsx, .pdf" />
                <label htmlFor="qcSummary">{`Give the overall summary of the Qc's`} </label>
                <textarea value={data.qc_summary} onChange= {onChange} id="qcSummary" rows="5" cols="40" name="qc_summary" required></textarea>
            </div>
       
    );
}

function LibQcs({data, onChange, DownloadUpFile}) {
    return(

        <div className={styles.PushSec}>
            <h2>Library QC Reports</h2>
            <label htmlFor="libMethod">Method</label>
            <select value={data.lib_method} onChange= {onChange} id="libMethod" name="lib_method">
                <option value="" disabled>select</option>
                <option value="No Data">No Data</option>
                <option value="totalRNA">total RNA</option>
                <option value="mRNA">mRNA</option>
                <option value="miRNA">miRNA</option>
                <option value="DNA">DNA</option>
                <option value="Others">Others</option>
                <option value="" disabled></option>
            </select>
            <label htmlFor="libReport">Upload Library QC Report (accepted formats: pdf)</label>
            <button type='button' onClick={() => DownloadUpFile(data.lib_report)}>View uploaded file</button>
            <input onChange= {onChange} type="file" id="libReport" name="lib_report" accept=".pdf" />
            <label htmlFor="libTapeReport">Upload Library QC Tapestation/BA report (accepted formats:
                pdf)</label>
            <button type='button' onClick={() => DownloadUpFile(data.lib_tape)}>View uploaded file</button>
            <input onChange= {onChange} type="file" id="libTapeReport" name="lib_tape" accept=".pdf" />
            <label htmlFor="lib_Summary">{`Give the overall summary of the QC's`}</label>
            <textarea value={data.lib_summary} onChange= {onChange} id="lib_Summary" rows="5" cols="40" name="lib_summary" ></textarea>
        </div>

    );
}

function UpdateBtn({SubmitUpdate}) {

    return(
    <div className={styles.PushSec}>
        <button onClick={SubmitUpdate}>Update</button>
    </div>
    );
}