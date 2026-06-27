import styles from './SopsNav.module.css'
import Link from 'next/link';

const dbFeatures = {
    "sops" : "SOP's",
    "pipeline" : "Pipeline"
}

export function SopsNav() {
    return(
        <div className={styles.DbFeatureDiv}>
            <Link href="/SOPs/sops-view">
                <button key= "sops" className={styles.DbFeatureBtns} >{dbFeatures.sops}</button>
            </Link>
            <Link href="/SOPs/pipelines">
                <button key="pipeline" className={styles.DbFeatureBtns} >{dbFeatures.pipeline}</button>
            </Link>
        </div>
    );
}
