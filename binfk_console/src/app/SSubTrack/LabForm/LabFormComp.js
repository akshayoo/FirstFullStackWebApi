"use client"

import styles from './LabForm.module.css'
import { useState } from 'react';
import { NcounterForm } from './nCounter/nConter';
import { NgS } from './NGS/NgS';


const applications = {
    "ncounter": "nCounter",
    "ngs": "NGS",
    "geomx" : "GeoMx"
}

export function LabFormComp() {


    const [techNology, setTechNology] = useState("")

    return(
        <div  className={styles.ProgCompDiv}>
            <SideWin />
            <NgS />
        </div>
    );
}


function SideWin(setTechNology = setTechNology){
    return(
        <>
            <div className={styles.projDetSide}>
                <div className={styles.SideFDiv}>
                    <label>Search By Project ID</label>
                    <input />
                </div>
                <div className={styles.SideSDiv}>
                    <div className={styles.SideInnerComp}>
                        <div>Project ID</div>
                        <div>TIPLE_0096</div>
                    </div>
                    <div className={styles.SideInnerComp}>
                        <div> PI Name</div>
                        <div>Dr. Anwar</div>
                    </div> 
                    <div className={styles.SideInnerComp}>
                        <div> Institute</div>
                        <div>erfij eiunvherji efjefhn </div>
                    </div> 
                    <div className={styles.SideInnerComp}>
                        <div>Department / Lab</div>
                        <div>Life sciences</div>
                    </div>  
                    <div className={styles.SideInnerComp}>
                        <div>Contact Email</div>
                        <div>anwar@gmail.com</div>
                    </div> 
                    <div className={styles.SideInnerComp}>
                        <div>Technology</div>
                        <div>{applications.ngs}</div>
                    </div> 
                </div>
            </div>
        </>
    );
}




