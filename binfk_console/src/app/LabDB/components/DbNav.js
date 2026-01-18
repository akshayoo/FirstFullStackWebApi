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
            <Link href="/LabDB/Push">
                <button key="push" className={styles.DbFeatureBtns} >{dbFeatures.push}</button>
            </Link>

            <Link href="/LabDB/Update">
                <button key="update" className={styles.DbFeatureBtns} >{dbFeatures.update}</button>
            </Link>
        </div>
    );
}