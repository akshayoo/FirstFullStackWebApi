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
                        <label>Offerings Type</label>
                        <select name="platform" >
                            <option value="Bulk Transcriptome">Bulk Transcriptome</option>
                            <option value="Metagenome/Applied Genomics">Metagenome/Applied Genomics</option>
                            <option value="Human Genetic Analysis">Human Genetic Analysis</option>
                            <option value="Human Tumor Biology">Human Tumor Biology</option>
                            <option value="Targeted Pathway Interogation">Targeted Pathway Interogation</option>
                            <option value="Applied">Applied</option>
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
                <label>Platform</label>
                <div>nCounter</div>
            </div>
            <div className={styles.InputcompDiv}>
                <label>Application</label>
                <div>nCounter wyejgjw  wbgweb ewjnbhew bcec uhbcejm cceubcje cejbej cenj cbej </div>
            </div>
            <div className={styles.InputcompDiv}>
                <label>Custom Description</label>
                <div>nCounter bcuebje e uh ej e je e vuh ec e eu ce ijhugieijebi jbgcejnbfehib e bhjjhbd f</div>
            </div>
            <div className={styles.InputcompDiv}>
                <label>Project Description</label>
                <div>nCounter hsdvgufgegdvbfje hbvceb jen cveubvyhedbv jkn dbvidvb dkn vdeknn</div>
            </div>
            <div className={styles.InputcompDiv}>
                <label>Type of samples</label>
                <select name="rec_application">
                    <option value="eddwid">Saliva</option>
                    <option value="edfrfdwid">Blood</option>
                    <option value="edfrfrdwid">Tissues</option>
                    <option value="eddrfrwid">FFPE</option>
                    <option value="eddfrwid">Body Fluids</option>
                </select>
            </div>
            <div className={styles.InputcompDiv}>
                <label>Sample Description</label>
                <div>nCounter hsdvgufgegdvbfje hbvceb jen cveubvyhedbvejfhviebn vceubvru vrbv    jkn dbvidvb dkn vdeknn</div>
            </div>
            <div className={styles.InputcompDiv}>
                <label>Other Description</label>
                <textarea />
            </div>
            <div className={styles.InputcompDiv}>
                <label>Sample submission guide lines</label>
                <div>nCounter hsdvgufgegdvbfje hbvceb jen cveubvyhedbvejfhviebn vceubvru vrbv    jkn dbvidvb dkn vdeknn</div>
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

