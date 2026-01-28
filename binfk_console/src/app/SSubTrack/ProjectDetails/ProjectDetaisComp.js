"use client"

import styles from './ProjectDetails.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';


export function ProjectDetailsComp() {

    const [servicesClass, setServicesClass] = useState({})

    const [classServices, setClassServices] = useState([])

    const [selectedClass, setSelectedClass] = useState("");

    useEffect(() =>{
        async function DataLoad(){
            try{
                const response = await axios.get("http://127.0.0.1:4040/ssub/projdet/fillinfo")
                setServicesClass(response.data)
            }
            catch(error){
                console.log("API Error:" + error)
            }
        }
        DataLoad()
    }, [])

    const onClassChange = (e) => {
        const value = e.target.value;
        setSelectedClass(value);
        setClassServices(servicesClass[value] || []);
    };

    return(
        <div  className={styles.ProgCompDiv}>
            <SideWin />
            <MainFormPage 
            servicesClass={servicesClass} 
            onClassChange={onClassChange}
            classServices={classServices}
            />
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


function MainFormPage({ servicesClass, onClassChange, classServices}) {

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
                        <select name="platform" onChange={onClassChange}>
                            <option value="">Select Offering Type</option>
                            {Object.keys(servicesClass).map((category) => {
                                return (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                    <div className={styles.InputcompDiv}>
                        <label>Recommended Application</label>
                        <select name="rec_application">
                            <option value="">Select Offering Type</option>
                            {
                                classServices.map((servs) => {
                                    return(
                                        <option key={servs} value={servs}>
                                            {servs}
                                        </option>
                                    );
                                })
                            }
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
                            <input type="radio" id="eyes" name="extraction" value="yes" />
                            <label htmlFor="eyes">Yes</label>

                            <input type="radio" id="eno" name="extraction" value="no" />
                            <label htmlFor="eno">No</label>
                        </div>
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

            </div>
        </div>
    );
    
}

/** 

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
    */

function SendButton(){
    return(
        <div className={styles.SendAppButton}>
            <button>Submit and Send for approval</button>
        </div>
    );
}

