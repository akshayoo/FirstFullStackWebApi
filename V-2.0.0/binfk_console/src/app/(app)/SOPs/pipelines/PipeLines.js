import { SopsNav } from "../componenets/SopsNav"
import { PipeLineComp } from "./PipeLinesComp"
import styles from './PipeLines.module.css'

export function PipeLines(){
    return(
        <div className={styles.container} >
            <SopsNav/>
            <PipeLineComp/>
        </div>
    )
}