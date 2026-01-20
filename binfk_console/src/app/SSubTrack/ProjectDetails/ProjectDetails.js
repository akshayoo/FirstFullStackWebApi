import { NavBar } from "@/components/NavBar";
import styles from '../SSF.module.css'
import {SSFNav} from '../components/SSFNav'
import { ProjectDetailsComp } from "./ProjectDetaisComp";

export function ProjectDetails(){
    return(
        <div className={styles.container}>
            <NavBar />
            <SSFNav />
            <ProjectDetailsComp />
        </div>
    );
}