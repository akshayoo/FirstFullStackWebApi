import { SopsNav } from "../componenets/SopsNav";
import styles from './SopsView.module.css'
import { SopsViewComp } from "./SopsViewComp";

export function SopsView(){
    return(
        <div className={styles.container} >
            <SopsNav/>
            <SopsViewComp />
        </div>
    )
}