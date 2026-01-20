import styles from './SSFNav.module.css'
import Link from 'next/link';

const dbFeatures = {
    "projectDetails" : "Initialization",
    "sampleQc" : "Sample QC",
    "analysis" : "Analysis",
}

export function SSFNav() {
    return(
        <div className={styles.DbFeatureDiv}>
            <Link href="/SSubTrack/ProjectDetails">
                <button key= "view" className={styles.DbFeatureBtns} >{dbFeatures.projectDetails}</button>
            </Link>
            <Link href="/LabDB/Push">
                <button key="push" className={styles.DbFeatureBtns} >{dbFeatures.sampleQc}</button>
            </Link>

            <Link href="/LabDB/Update">
                <button key="update" className={styles.DbFeatureBtns} >{dbFeatures.analysis}</button>
            </Link>
        </div>
    );
}