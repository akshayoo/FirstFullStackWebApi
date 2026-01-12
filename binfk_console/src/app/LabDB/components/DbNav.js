import styles from './DbNav.module.css'

const dbFeatures = {
    "push" : "Push",
    "update" : "Update",
    "view" : "View",
    "reports" : "Reports"
}

export function DbNav() {
    return(
        <div className={styles.DbFeatureDiv}>
            <button key="push" className={styles.DbFeatureBtns} >{dbFeatures.push}</button>
            <button key="update" className={styles.DbFeatureBtns} >{dbFeatures.update}</button>
            <button key= "view" className={styles.DbFeatureBtns} >{dbFeatures.view}</button>
            <button key= "reports" className={styles.DbFeatureBtns} >{dbFeatures.reports}</button>
        </div>
    );
}