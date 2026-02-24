import styles from './DbNav.module.css'
import Link from 'next/link';

const dbFeatures = {
    "push" : "Push",
    "update" : "Update",
    "view" : "View",
    "reports" : "Reports"
}

export function DbNav() {
    return(
        <div className={styles.DbFeatureDiv}>
            <Link href="/LabDB/View">
                <button key= "view" className={styles.DbFeatureBtns} >{dbFeatures.view}</button>
            </Link>
        </div>
    );
}