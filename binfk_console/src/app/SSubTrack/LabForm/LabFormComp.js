"use client"

import styles from './LabForm.module.css'
import { useState } from 'react';
import { NcounterForm } from './nCounter/NcounterForm';
import { NgSForm } from './NGS/NgSForm';
import { GeoMxForm } from './GeoMx/GeoMxForm';
import axios from 'axios';


const applications = {
    "ncounter": "nCounter",
    "ngs": "NGS",
    "geomx" : "GeoMx"
}

export function LabFormComp() {

    const [searchValue, setSearchValue] = useState({})

    const [searchCont, setSearchCont] = useState("")

    const [techNology, setTechNology] = useState("")

    async function projectSearch(){

        if (!searchCont.trim()){
            alert("No ProjectID found")
            return
        }

        try {
            const response =  await axios.post("http://127.0.0.1:4050/ssub/samsub/projidsearch",
                {"project_id" : searchCont}
            )

            const data = response.data

            if (!data){
                alert(`No project initiated, Please initialte a project`)
                return
            }

            const data_status = data.status
            
            console.log(data_status)

            const payload = data.payload

            setSearchValue(payload)
            setTechNology(payload.technology)
        }

        catch(error) {
            alert(`There was an error loading the data ${error}`)
        }
    }

    
    const handleSearch = (e) => {

        const value = e.target.value
        setSearchCont(value)
    }

    const FORM_BY_TECH = {
        NGS: <NgSForm />,
        nCounter: <NcounterForm />,
        GeoMx: <GeoMxForm />
    }

    return(
        <div  className={styles.ProgCompDiv}>
            <SideWin handleSearch={handleSearch} 
            searchCont={searchCont} 
            projectSearch={projectSearch} 
            searchValue={searchValue}
            />
            {FORM_BY_TECH[techNology] ?? null}
            
        </div>
    );
}


function SideWin({handleSearch, searchCont, projectSearch, searchValue}){
    return(
        <>
            <div className={styles.projDetSide}>
                <div className={styles.SideFDiv}>
                    <label>Search By Project ID</label>
                    <input onChange={handleSearch} value={searchCont}/>
                    <button onClick={projectSearch}>Search</button>
                </div>
                <div className={styles.SideSDiv}>
                    <div className={styles.SideInnerComp}>
                        <div>Project ID</div>
                        <div>{searchValue.project_id}</div>
                    </div>
                    <div className={styles.SideInnerComp}>
                        <div> PI Name</div>
                        <div>{searchValue.pi_name}</div>
                    </div> 
                    <div className={styles.SideInnerComp}>
                        <div> Institute</div>
                        <div>{searchValue.institution}</div>
                    </div> 
                    <div className={styles.SideInnerComp}>
                        <div>Department / Lab</div>
                        <div>{searchValue.lab_dept}</div>
                    </div>  
                    <div className={styles.SideInnerComp}>
                        <div>Contact Email</div>
                        <div>{searchValue.email}</div>
                    </div> 
                    <div className={styles.SideInnerComp}>
                        <div>Service Name</div>
                        <div>{searchValue.service_name}</div>
                    </div> 
                    <div className={styles.SideInnerComp}>
                        <div>Technology</div>
                        <div>{searchValue.technology}</div>
                    </div> 
                </div>
            </div>
        </>
    );
}
