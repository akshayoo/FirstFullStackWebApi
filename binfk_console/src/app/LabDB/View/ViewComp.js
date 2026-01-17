import styles from './ViewComp.module.css'


fields = {
    updated_by: "Updated By",
    updated_date: "Updated Date",
    modified_by : "Modified Date",
    modified_date : "Modified Date",
    project_id: "Project ID",
    title: "Project Title",
    customer: "Customer Name",
    organization: "Customer Organization",
    sam_type: "Sample Type",
    count: "Sample count",
    preservation: "Sample Preservation Method",
    other_info: "Other Information",
    method_name: "Method name",
    method_writeup: "Method Writeup",
    method_summary: "Method Summary",
    quantification: "Download Uploaded Sample QC Report (.pdf)",
    integrity: "Download Uploaded Sample Integrity Report (.csv)",
    qc_summary: "QC Summary",
    lib_method: "Library Preperation Method",
    lib_report: "Download Uploaded Library Report (.pdf)",
    lib_tape: "Download Uploaded Library Report (.csv)",
    lib_summary: "Library Summary"
}


export function ViewComp(){

    return(
        <div className={styles.PushcompDiv} >
            <SerachById />
        </div>
    );
}

function SerachById() {
    return (
        <div className={styles.PushSec}>
            <h2>Serach By Project ID</h2>
            <input type="text" id="updateprojectId" name="project_id" required />
        </div>
    );
}

function UploaderInfo() {
    return (
        <div className={styles.UploaderInfo}>
            <div>
                <h3>{fields.updated_by}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.updated_date}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.modified_by}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.modified_date}</h3>
                <h3>TIPL_004</h3>
            </div>
        </div>
    )
}

function ProjectInfo() {
    return (
        <div className={styles.UploaderInfo}>
            <div>
                <h3>{fields.project_id}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.title}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.customer}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.organization}</h3>
                <h3>TIPL_004</h3>
            </div>
        </div>
    )
}

function SampleInfo() {
    return (
        <div className={styles.UploaderInfo}>
            <div>
                <h3>{fields.sam_type}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.count}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.preservation}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.other_info}</h3>
                <h3>TIPL_004</h3>
            </div>
        </div>
    )
}

function PrepInfo() {
    return (
        <div className={styles.UploaderInfo}>
            <div>
                <h3>{fields.method_name}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.method_writeup}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.method_summary}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.quantification}</h3>
                <h3>TIPL_004</h3>
            </div>
            <div>
                <h3>{fields.integrity}</h3>
                <h3>TIPL_004</h3>
            </div>
        </div>
    )
}
