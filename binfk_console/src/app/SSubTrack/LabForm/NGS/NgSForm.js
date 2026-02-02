import styles from '../LabForm.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';


export function NgSForm() {

    const [appliCation, setAppliCation] = useState(false)
    const [extNeeded, setExtNeeded] = useState(false)
    const [binfAnalysis, setBinfanalysis] = useState(false)

    const [file, setFile] = useState(null)
    const [tablePopulate, setTablePopulate] = useState([])

    const [formData, setFormData] = useState({
        application: "",
        replicates: "",
        extraction_needed: "",
        
        rna_prep_method: "",
        rna_kit_name: "",
        dnase_treated: "",
        rna_assessment: "",
        
        rnase_treated: "",
        dna_kit_name: "",
        dna_assessment: "",
        
        bioinformatics_needed: "",
        key_objectives: "",
        differential_comparisons: "",
        additional_analysis: "",
        reference_study: ""

    })

    
    const handleFieldChange = (e) => {
        
    }

    const handleRadiooptChange = (e) => {

    }

    const fileIn = (e) => {
        const selFile = e.target.files[0]
        setFile(selFile)
    }

    
    async function fileUpload(){

        try{

            if (!file){
                alert("Upload the file")
                return
            }

            const formData = new FormData()
            formData.append("file" , file)

            const response = await axios.post("http://127.0.0.1:4060/ssub/samsub/tableupload",
                formData
            )
            const data = response.data  
            
            const formPop = data.submission

            setTablePopulate(formPop)

        }

        catch {
            alert("There was an error communicating with the server")
        }
    }

    async function submitNGSForm() {
        
    }
    

    return(
        <div className={styles.MainFormPage}>
            <div className={styles.FormBox}>
                <div className={styles.FormFirSec}>
                    <div className={styles.FFComp}>
                        <h2>NGS Sample Submission Window</h2>
                    </div>
                    <div className={styles.FFComp}>
                        <div>Application</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="dna" name="application" value="DNA" onChange={() => setAppliCation(false)} />
                            <label htmlFor="dna">DNA</label>

                            <input type="radio" id="rna" name="application" value="RNA" onChange={() => setAppliCation(true)} />
                            <label htmlFor="rna">RNA</label>
                        </div>
                    </div>
                    <div className={styles.FFComp}>
                        <div>Are there replicates</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="rep-yes" name="replicates" value="Yes" />
                            <label htmlFor="rep-yes">Yes</label>

                            <input type="radio" id="rep-no" name="replicates" value="No"/>
                            <label htmlFor="rep-no">No</label>
                        </div>
                    </div>

                    {   
                        appliCation ? <RnaForm setExtNeeded={setExtNeeded}
                        extNeeded= {extNeeded} /> : <DnaForm setExtNeeded={setExtNeeded}
                        extNeeded = {extNeeded} />
                    }

                    <div className={styles.FFComp}>
                        <div>Needed Bioinformatics Analysis</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="binf-yes" name="binfanalysis" value="Yes" onChange={() => setBinfanalysis(true)} />
                            <label htmlFor="binf-yes">Yes</label>

                            <input type="radio" id="binf-no" name="binfanalysis" value="No" onChange={() => setBinfanalysis(false)}/>
                            <label htmlFor="binf-no">No</label>
                        </div>
                    </div>

                    {
                        binfAnalysis ? <Binfo /> : <></>
                    }

                </div>

                <div className={styles.FormSceSec}>
                    <div className={styles.FormTableSec}>
                        <DisplayTable fileIn={fileIn} 
                        fileUpload={fileUpload} 
                        tablePopulate={tablePopulate} 
                        submitNGSForm={submitNGSForm} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function RnaForm({setExtNeeded, extNeeded}){
    return(
        <>
            <ExtTrue setExtNeeded={setExtNeeded} />     
            {extNeeded ? <RnaExtTrue /> : <></>}  
        </>
    );
}

function DnaForm({setExtNeeded, extNeeded}){
    return(
        <>
            <ExtTrue setExtNeeded={setExtNeeded} />  
            {extNeeded ? <DnaExtTrue /> : <></>}
        </>
    );
}

function ExtTrue({setExtNeeded}){
    return(
        <>
            <div className={styles.FFComp}>
                <div>Extrection needed</div>
                <div className={styles.FRad}>
                    <input type="radio" id="ext-yes" name="extraction_needed" value="yes" onChange={() => setExtNeeded(false)} />
                    <label htmlFor="ext-yes">Yes</label>

                    <input type="radio" id="ext-no" name="extraction_needed" value="no" onChange={() => setExtNeeded(true)} />
                    <label htmlFor="ext-no">No</label>
                </div>
            </div>
        </>
    );
}

function RnaExtTrue(){
    return(
        <>
            <div className={styles.FFComp}>
                <div>Has RNA been prepared with Total RNA or Coloumn Extraction</div>
                <div className={styles.FRad}>
                    <input type="radio" id="t-rna" name="rna_prep_method" value="Total RNA" />
                    <label htmlFor="t-rna">Total RNA</label>

                    <input type="radio" id="c-rna" name="rna_prep_method" value="Column Extraction" />
                    <label htmlFor="c-rna">Column Extraction</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <label>Name of the Kit</label>
                <input name="rna_kit_name" />
            </div>  
            <div className={styles.FFComp}>
                <div>Has sample been treated with DNAase</div>
                <div className={styles.FRad}>
                    <input type="radio" id="dnaase-yes" name="dnase_treated" value="yes" />
                    <label htmlFor="dnaase-yes">Yes</label>

                    <input type="radio" id="dnaase-no" name="dnase_treated" value="no" />
                    <label htmlFor="dnaase-no">No</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <label>RNA has be assesed by</label>
                <select name='rna_assesment'>
                    <option>Qubit</option>
                    <option>Nanodrop</option>
                    <option>Bio-Analyzer</option>
                    <option>TapeStation</option>
                    <option>Not assesed</option>
                    <option>Other</option>
                </select>
            </div>    
        </>
    );
}

function DnaExtTrue(){
    return(
        <>
            <div className={styles.FFComp}>
                <div>Has sample been treated with RNAase</div>
                <div className={styles.FRad}>
                    <input type="radio" id="dnaase-yes" name="rnase_treated" value="yes" />
                    <label htmlFor="dnaase-yes">Yes</label>

                    <input type="radio" id="dnaase-no" name="rnase_treated" value="no" />
                    <label htmlFor="dnaase-no">No</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <label>Name of the Kit</label>
                <input name="dna_kit_name"/>
            </div>  
            <div className={styles.FFComp}>
                <label>DNA QC has be assesed by</label>
                <select name="dna_assesment">
                    <option>Qubit</option>
                    <option>Nanodrop</option>
                    <option>Bio-Analyzer</option>
                    <option>TapeStation</option>
                    <option>Not assesed</option>
                    <option>Other</option>
                </select>
            </div> 
        </>
    );
}

function DisplayTable({ fileIn, fileUpload, tablePopulate, submitNGSForm}){
    return(
        <>
            <div className={styles.DisplayTable}>

                <div className={styles.TableDiv}>
                    <table className= {styles.DispTab} >
                        <thead>
                            <tr>
                                <th >Sample ID</th>
                                <th>Description</th>
                                <th>RNA Conc.</th>
                                <th>Notes</th>
                                <th>{"Replicate(Group Name)"}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tablePopulate.length > 0 ? (
                                tablePopulate.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row["Sample ID"]}</td>
                                        <td>{row["Description"]}</td>
                                        <td>{row["RNA Conc."]}</td>
                                        <td>{row["Notes"]}</td>
                                        <td>{row["Replicate(Group Name)"]}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: "center" }}>
                                        NO DATA
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className= {styles.DispUpbtn}>
                    <a href='/template.ncounter.csv' download><button>Download Template</button></a>
                    <label id='fileupload'>Select the file</label>
                    <input onChange={fileIn} htmlFor='fileupload' type='file' accept='.csv, .xlsx' />
                    <button onClick={fileUpload}>Upload File</button>
                </div>
                <SendButton submitNGSForm={submitNGSForm} />
                
            </div>
        </>

    );
}

function Binfo() {
    return(
        <>
            <div className={styles.FFComp}>
                <div>Key Objectives</div>
                <textarea rows={6} name="key_objectives" />
            </div>

            <div className={styles.FFComp}>
                <div>Comparisons for differential analysis</div>
                <textarea rows={6} name="differntial_comparisons" />
            </div>

            <div className={styles.FFComp}>
                <div>Any additional analysis</div>
                <textarea rows={6} name="additional_analysis" />
            </div>

            <div className={styles.FFComp}>
                <div>Any reference study to follow for the analysis</div>
                <textarea rows={6} name="reference_study" />
            </div>
        </>
    );
}


function SendButton({submitNGSForm}){
    return(
        <div className={styles.SendAppButton}>
            <button onClick={submitNGSForm}>Submit</button>
        </div>
    );
}