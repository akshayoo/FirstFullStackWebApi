"use client"

import styles from './ViewComp.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';


export function ViewComp(){

    const [projId, setProjId] = useState([])

    useEffect(() => {
        async function ProjIdFetch() {

            try {

                const resp = await axios.get(
                    "http://127.0.0.1:4040/labdb/view/pagepop"
                );

                console.log(resp.data.project_ids);
                setProjId(resp.data.project_ids);

            } catch (err) {

                console.log("Failed to fetch project Ids", err);
            }

        }

        ProjIdFetch();

    }, []);

    return(

        <div className={styles.View}>
            <div className={styles.ViewSideBar} >
                <SerachById />
                <h2>Recent Entries</h2>
                <RecentEntries projId={projId} />
            </div>
            <div className= {styles.ViewWin}>
                <ViewWelcome />
            </div>
        
        </div>
    );
}

function SerachById() {
    return (
        <div className={styles.SidebarSrch}>
            <h2>Search</h2>
            <input type="text" id="updateprojectId" name="project_id" placeholder='project Id' required />
        </div>
    );
}


function RecentEntries({projId}){
    return(
        <>
            <div className= {styles.SidebarProp}>
                {projId.map(ids => (
                <button key={ids}>{ids}</button>
                ))}
            </div>
        </>

    );
}


function ViewWelcome() {
    return(
        <div>
            <div>
                This is the window page
            </div>
            <div>
                Search for changing
            </div>
        </div>
    )
}


