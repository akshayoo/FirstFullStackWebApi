"use client"

import styles from './ViewComp.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

export function ViewComp(){

    const [projectIds, setProjectIds] = useState([])

    useEffect(() => {
        async function FetchProjIds(){

            try{
                const resp = await axios.get("http://localhost:4050/labdb/view/pagepop")
                setProjectIds(resp.data.project_ids)
            }
            catch(er){
                console.error("Failed to fetch project", er)
            }
        }
        FetchProjIds()
    }, [])

    return(

        <div className={styles.View}>
            <ViewSideBar projectIds={projectIds}/>
            <ViewWin />
        </div>
    );
}

function ViewSideBar({projectIds}){
    return(
        <div className={styles.SideB}>
            <div className={styles.HeadIn}>
                <h2>Search by Id</h2>
                <input />
            </div>
            <h2>Recent Entries</h2>
                <div className={styles.RecEnt}>
                    {projectIds.map(projids =>(
                        <button key={projids}>{projids}</button>
                    ))}
                </div> 
        </div>
    );
}


function ViewWin (){
    return(
        <div className={styles.ViewWin}>
            <div className={styles.contentWin}>
                <div className={styles.fOn}>
                    <div>Project ID</div>
                    <div>TIPL_200</div>
                </div>
            </div>
        </div>
    );
}


