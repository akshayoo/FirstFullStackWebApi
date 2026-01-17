import styles from './ViewComp.module.css'


const fields = {
    updated_by: "Updated By",
    updated_date: "Updated Date",
    modified_by : "Modified By",
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

        <>
            <div className={styles.PushcompDiv} >
                <SerachById />
            </div>
            <UploaderInfo />
            <ProjectInfo />
            <SampleInfo />
            <PrepInfo />
        
        </>
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
        <div className={styles.ViewSec}>
            <div className={styles.ViewItems}>
                <div>{fields.updated_by}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.updated_date}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.modified_by}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.modified_date}</div>
                <div>TIPL_004</div>
            </div>
        </div>
    )
}

function ProjectInfo() {
    return (
        <div className={styles.ViewSec}>
            <div className={styles.ViewItems}>
                <div>{fields.project_id}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.title}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.customer}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.organization}</div>
                <div>TIPL_004</div>
            </div>
        </div>
    )
}

function SampleInfo() {
    return (
        <div className={styles.ViewSec}>
            <div className={styles.ViewItems}>
                <div>{fields.sam_type}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.count}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.preservation}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.other_info}</div>
                <div>TIPL_004</div>
            </div>
        </div>
    )
}

function PrepInfo() {
    return (
        <div className={styles.ViewSec}>
            <div className={styles.ViewItems}>
                <div>{fields.method_name}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.method_writeup}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.method_summary}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.quantification}</div>
                <div>TIPL_004</div>
            </div>
            <div className={styles.ViewItems}>
                <div>{fields.integrity}</div>
                <div>TIPL_004</div>
            </div>
            <div>
                <div>{fields.qc_summary}</div>
                <div>TIPL_004</div>
            </div>
            <div>
                <div>{fields.lib_method}</div>
                <div>TIPL_004</div>
            </div>
            <div>
                <div>{fields.lib_report}</div>
                <div>TIPL_004</div>
            </div>
            <div>
                <div>{fields.lib_tape}</div>
                <div>TIPL_004</div>
            </div>
            <div>
                <div>{fields.lib_summary}</div>
                <div>TIPL_004</div>
            </div>
        </div>
    )
}
