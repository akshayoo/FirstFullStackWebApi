"use client"

import styles from './ProjectDetails.module.css'
import { useState } from 'react';


export function ProjectDetailsComp() {


    const [extractionNeed, setExtractionNeed] = useState(false)


    return(
        <div  className={styles.ProgCompDiv}>
            <SideWin />
            <MainFormPage extractionNeed={extractionNeed} setExtractionNeed={setExtractionNeed}/>
        </div>
    );
}

function SideWin(){
    return(
        <>
            <div className={styles.projDetSide}>
                <h2>Project Initial detials filling window</h2>
                <p>Things to conside</p>
                <ul>
                    <li>whegdwjehuihewfhwijhfwihfjhew</li>
                    <li>wgdhwbhdweuhfbwbwbfbewbewhfbew</li>
                    <li>wheugdyuewhgeuygfergfugeuhfgehu</li>
                </ul>
            </div>
        </>
    );
}


function MainFormPage({extractionNeed, setExtractionNeed}) {

    return(
        <div className={styles.MainFormPage}>
            <div className={styles.FormBox}>
                <div className={styles.ForminBox}>
                    <div className={styles.InputcompDiv}>
                        <label>Project ID</label>
                        <input name="project_id" type="text" />
                    </div>
                    <div className={styles.InputcompDiv}>
                        <label>PI Name</label>
                        <input name="pi_name" type="text" />
                    </div>
                    <div className={styles.InputcompDiv}>
                        <label>Organization/Institution</label>
                        <input name="institution" type="text" />
                    </div>
                    <div className={styles.InputcompDiv}>
                        <label>Lab/Department</label>
                        <input name="labdept" type="text" />
                    </div>
                </div>

                <div className={styles.ForminBox}>
                    <div className={styles.InputcompDiv}>
                        <label>Project Description</label>
                        <textarea />
                    </div>
                    <div className={styles.InputcompDiv}>
                        <label>Platform</label>
                        <select name="platform">
                            <option value="Nanostring nCounter">nCounter</option>
                            <option value="Nanostring nCounter">NGS</option>
                            <option value="Nanostring nCounter">Long Read</option>
                            <option value="Nanostring nCounter">GeoMx</option>
                        </select>
                    </div>
                    <div className={styles.InputcompDiv}>
                        <label>Recommended Application</label>
                        <select name="rec_application">
                            <option value="eddwid">wknjfjefj</option>
                            <option value="edfrfdwid">wknwdedjfjefj</option>
                            <option value="edfrfrdwid">wknedejfjefj</option>
                            <option value="eddrfrwid">wkneejfjefj</option>
                            <option value="eddfrwid">wknefejfjefj</option>
                        </select>
                    </div>
                    <div className={styles.InputcompDiv}>
                        <label>Number of samples</label>
                        <input name="sam_number" type="number" />
                    </div>
                    <div className={styles.InputcompDiv}>
                        <label>Are there duplicates</label>
                        <div>
                            <input type="radio" id="dyes" name="duplicates" value="yes" />
                            <label htmlFor="dyes">Yes</label>

                            <input type="radio" id="dno" name="duplicates" value="no" />
                            <label htmlFor="dno">No</label>
                        </div>
                    </div>
                    <div className={styles.InputcompDiv}>
                        <label>Samples Extracion needed</label>
                        <div>
                            <input onChange={() =>setExtractionNeed(true)} type="radio" id="eyes" name="extraction" value="yes" />
                            <label htmlFor="eyes">Yes</label>

                            <input onChange={() =>setExtractionNeed(false)} type="radio" id="eno" name="extraction" value="no" />
                            <label htmlFor="eno">No</label>
                        </div>
                    </div>
                </div>

                {extractionNeed ? <ExtCont /> : <SendButton />}

            </div>
        </div>
    );
    
}


function ExtCont() {
    return(
         <div className={styles.ForminBox}>
            <div className={styles.InputcompDiv}>
                <label>Type of Samples</label>
                <input name="project_id" type="text" />
            </div>
            <div className={styles.InputcompDiv}>
                <label>Sample Description</label>
                <input name="pi_name" type="text" />
            </div>
            <div className={styles.InputcompDiv}>
                <label>Organization/Institution</label>
                <input name="institution" type="text" />
            </div>
            <div className={styles.InputcompDiv}>
                <label>Lab/Department</label>
                <input name="labdept" type="text" />
            </div>
            <SendButton />
        </div>
    );
}

function SendButton(){
    return(
        <div className={styles.SendAppButton}>
            <button>Submit and Send for approval</button>
        </div>
    );
}

