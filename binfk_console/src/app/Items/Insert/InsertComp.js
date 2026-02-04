"use client"
import styles from './Insert.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

export function InsertComp() {
    return (
       <div className={styles.ProgCompDiv}>
            <div className={styles.projDetSide}>
                <h2>Add Custom Service Items</h2>
                <p>You are about to create a custom Service Catalog. Please keep the following in mind before you continue.</p>
                <ul>
                    <li>All fields in this form may be <strong>mandatory</strong>.</li>
                    <li>Ensure the Service name, Catalog ID and Standard deliverables are clear.</li>
                    <li>Verify all details carefully.</li>
                    <li>Incorrect info may affect the depended processes.</li>
                </ul>
            </div>
        
            <div className={styles.MainFormPage}>
                <div className={styles.FormBox}>
                    <div className={styles.ForminBox}>
                        
                        <div className={styles.InputcompDiv}>
                            <label>Service Name</label>
                            <input name="service_name" type="text" />
                        </div>
                        
                        <div className={styles.InputcompDiv}>
                            <label>Catalog Number</label>
                            <input name="catalog_number" type="text" />
                        </div>
                    </div>

                    <div className={styles.ForminBox}>

                        <div className={styles.InputcompDiv}>
                            <label>Application</label>
                            <textarea name="application" type="text" rows={6}/>
                        </div>
                        
                        <div className={styles.InputcompDiv}>
                            <label>Pros</label>
                            <textarea name="pros" type="text" rows={6}/>
                        </div>
                        
                        <div className={styles.InputcompDiv}>
                            <label>Notes</label>
                            <textarea name="notes" type="text" rows={6}/>
                        </div>
                    
                    </div>

                    <div className={styles.ForminBox}>
                        
                        <div className={styles.InputcompDiv}>
                            <label>Sample Input</label>
                            <input name="sample_input" type="text" />
                        </div>
                        
                        <div className={styles.InputcompDiv}>
                            <label>Input conc</label>
                            <input name="input_conc" type="number" />
                        </div>
                        <div className={styles.InputcompDiv}>
                            <label>{`Minimum RIN Value (if applicable)`}</label>
                            <input name="min_rin" type="number" />
                        </div>
                        <div className={styles.InputcompDiv}>
                            <label>{`Maximum RIN Value (if applicable)`}</label>
                            <input name="max_rin" type="number" />
                        </div>
                        <div className={styles.InputcompDiv}>
                            <label>Accepted sample types</label>
                            <textarea name="sam_types" type="text" rows={6}/>
                        </div>
                        <div className={styles.InputcompDiv}>
                            <label>Process Map</label>
                            <textarea name="process_map" type="text" rows={6}/>
                        </div>
                    </div>

                    <div className={styles.ForminBox}>
                        <div className={styles.InputcompDiv}>
                            <label>Standard Deliverables</label>
                            <textarea name="standard_deliverables" type="text" rows={12}/>
                        </div>
                    </div>

                    <SubmitBtn />

                </div>
            </div>
       </div>
    );
}

function SubmitBtn(){
    return(
        <div className={styles.SendAppButton}>
            <button>SUBMIT</button>
        </div>
    );
}