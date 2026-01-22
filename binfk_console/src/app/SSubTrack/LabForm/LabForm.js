import { NavBar } from "@/components/NavBar";
import styles from '../SSF.module.css'
import {SSFNav} from '../components/SSFNav'
import { LabFormComp } from "./LabFormComp";

export function LabForm(){
    return(
        <div className={styles.container}>
            <NavBar />
            <SSFNav />
            <LabFormComp />
        </div>
    );
}