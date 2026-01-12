import styles from './PushComp.module.css'

function UpdateInfo() {
  return (
    <div className={styles.PushSec}>

        <h2>Update uploader info</h2>

        <label htmlFor="updatedBy">Select the updater</label>

        <select id="updatedBy" name="updated_by" required defaultValue="">
            <option value="" disabled>
                Select
            </option>
            <option value="Vijayalakshmi Bhat">Vijayalakshmi Bhat</option>
            <option value="Rahul Reghunath">Rahul Reghunath</option>
            <option value="Deschica Dechamma">Deschica Dechamma</option>
        </select>

    </div>
  );
}

function ProjectId() {
    return(
        <div className={styles.PushSec}>
            <h2>Project Info</h2>
            <label htmlFor="updateprojectId">ID</label>
            <input type="text" id="updateprojectId" name="project_id" required />
            <label htmlFor="updateprojectTitle">Title</label>
            <input type="text" id="updateprojectTitle" name="title" required />
            <label htmlFor="updateprojectCustomer">Customer name</label>
            <input type="text" id="updateprojectCustomer" name="customer" required />
            <label htmlFor="updateOrg">Institute/Organisation</label>
            <input type="text" id="updateOrg" name="organization" required />
        </div>
    );
}

function SamAssayInfo() {
    return(

        <div className={styles.PushSec}>
            <h2>Update sample and assay info and reports</h2>
            <label htmlFor="updateSampletype">Sample type</label>
            <select id="updateSampletype" name="sam_type" required>
                <option value="" disabled selected>select</option>
                <option value="Blood">Blood</option>
                <option value="Plasma">Plasma</option>
                <option value="Serum">Serum</option>
                <option value="CSF">CSF</option>
                <option value="Cells">Cells</option>
                <option value="Tissue">Tissue</option>
                <option value="Tissues">Stool</option>
                <option value="Environmental">Environmental</option>
                <option value="Urine">Urine(Body-fluids)</option>
                <option value="Saliva">Saliva(Body-fluids)</option>
                <option value="Tear">Tear(Body-fluids)</option>
                <option value="Milk">Milk(Body-fluids)</option>
                <option value="Others">Others</option>
            </select>
            <label htmlFor="updatesampleNos">Total number of samples</label>
            <input type="number" id="updatesampleNos" name="count" required />
            <label htmlFor="updateSamplepreservation">Sample Preservation method</label>
            <select id="updateSamplepreservation" name="preservation" required>
                <option value="" disabled selected>select</option>
                <option value="Frozen">Frozen</option>
                <option value="FFPE">FFPE</option>
                <option value="Rnalater">RNA later</option>
                <option value="Alcohol">Alcohol</option>
                <option value="TrisolLysate">Trisol lysate</option>
                <option value="Others">Others</option>
            </select>
            <label htmlFor="updateSampleinfo">Any other information</label>
            <textarea id="updateSampleinfo" rows="5" cols="40" name="other_info" required></textarea>
        </div>
                                                                                                                                                                                                                                                                 

    );
}

function MethodInfo() {
    return(
        <div className={styles.PushSec}>
            <h2>Update methods</h2>
            <label htmlFor="updateMethod">Method</label>
            <select id="updateMethod" name="name" required>
                <option value="" disabled selected>select</option>
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
            <textarea id="updatemethodWritup" rows="5" cols="40" name="writeup" required></textarea>
            <label htmlFor="updatemethodSummary">Summary</label>
            <textarea id="updatemethodSummary" rows="5" cols="40" name="method_summary"
                required></textarea>
        </div>

    );
}

function RawQcs(){
    return(
            <div className={styles.PushSec}>
                <h2>Update QC Report and Summary</h2>
                <label htmlFor="quantitationQc">Upload quantitation QC Report (accepted formats: .pdf)</label>
                <input type="file" id="quantitationQc" name="quantification"
                    accept=".pdf" required />
                <label htmlFor="integrityQc">Upload integrity QC Report (accepted formats: .csv,)</label>
                <input type="file" id="integrityQc" name="integrity" accept=".csv, .xlsx" required />
                <label htmlFor="qcSummary">{`Give the overall summary of the Qc's`} </label>
                <textarea id="qcSummary" rows="5" cols="40" name="qc_summary" required></textarea>
            </div>
       
    );
}

function LibQcs() {
    return(

        <div className={styles.PushSec}>
            <h2>Library QC Reports</h2>
            <label htmlFor="libMethod">Method</label>
            <select id="libMethod" name="lib_method">
                <option value="" disabled selected>select</option>
                <option value="totalRNA">total RNA</option>
                <option value="mRNA">mRNA</option>
                <option value="miRNA">miRNA</option>
                <option value="DNA">DNA</option>
                <option value="Others">Others</option>
            </select>
            <label htmlFor="libReport">Upload Library QC Report (accepted formats: pdf)</label>
            <input type="file" id="libReport" name="lib_report" accept=".pdf" />
            <label htmlFor="libTapeReport">Upload Library QC Tapestation/BA report (accepted formats:
                pdf)</label>
            <input type="file" id="libTapeReport" name="lib_tape" accept=".pdf" />
            <label htmlFor="lib_Summary">{`Give the overall summary of the QC's`}</label>
            <textarea id="lib_Summary" rows="5" cols="40" name="lib_summary" ></textarea>
        </div>

    );
}

export function PushComp(){

    return(
        <div className={styles.PushcompDiv} >
            <UpdateInfo />
            <ProjectId />
            <SamAssayInfo />
            <MethodInfo />
            <RawQcs />
            <LibQcs />
        </div>
    );
}