import styles from './Sops.module.css'
import {SopsNav} from './componenets/SopsNav'

export function Sops(){
    return(
        <div className={styles.container} >
            <SopsNav/>
        </div>
    );
}