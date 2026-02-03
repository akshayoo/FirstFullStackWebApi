import styles from '../LabForm.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';


export function NgSForm() {

    const [appliCation, setAppliCation] = useState(null)
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
        const {name, value} = e.target
        setFormData(prev =>({
            ...prev,
            [name] : value
        }))
    }

    const handleRadiooptChange = (e) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
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

            const uploadData = new FormData()
            uploadData.append("file" , file)

            const response = await axios.post("http://127.0.0.1:4060/ssub/samsub/tableupload",
                uploadData
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

        if(!tablePopulate.length){alert("No submission table found"); return}

        if (!formData.application || !formData.extraction_needed || !formData.bioinformatics_needed) {alert("Missing fields"); return}

        const payload = {...formData, table: tablePopulate}

        console.log(payload)

        try{
            const response =  await axios.post("http://127.0.0.1:4060/ssub/projdet/ngsform", payload)

            const data = response.data

            alert(data.status)

            window.location.reload()
        }
        catch {
            alert("Server error")
        }

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
                            <input type="radio" id="dna" name="application" value="DNA" onChange={(e) => {setAppliCation(false); handleRadiooptChange(e)}} />
                            <label htmlFor="dna">DNA</label>

                            <input type="radio" id="rna" name="application" value="RNA" onChange={(e) => {setAppliCation(true); handleRadiooptChange(e)}} />
                            <label htmlFor="rna">RNA</label>
                        </div>
                    </div>
                    <div className={styles.FFComp}>
                        <div>Are there replicates</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="rep-yes" name="replicates" value="Yes" onChange={handleRadiooptChange} />
                            <label htmlFor="rep-yes">Yes</label>

                            <input type="radio" id="rep-no" name="replicates" value="No" onChange={handleRadiooptChange}/>
                            <label htmlFor="rep-no">No</label>
                        </div>
                    </div>

                    {appliCation === true && (
                    <RnaForm
                        setExtNeeded={setExtNeeded}
                        extNeeded={extNeeded}
                        handleRadiooptChange={handleRadiooptChange}
                        handleFieldChange={handleFieldChange}
                    />
                    )}

                    {appliCation === false && (
                    <DnaForm
                        setExtNeeded={setExtNeeded}
                        extNeeded={extNeeded}
                        handleRadiooptChange={handleRadiooptChange}
                        handleFieldChange={handleFieldChange}
                    />
                    )}

                    <div className={styles.FFComp}>
                        <div>Needed Bioinformatics Analysis</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="binf-yes" name="bioinformatics_needed" value="Yes" onChange={(e) => {setBinfanalysis(true); handleRadiooptChange(e)}} />
                            <label htmlFor="binf-yes">Yes</label>

                            <input type="radio" id="binf-no" name="bioinformatics_needed" value="No" onChange={(e) => {setBinfanalysis(false); handleRadiooptChange(e)}}/>
                            <label htmlFor="binf-no">No</label>
                        </div>
                    </div>

                    {
                        binfAnalysis ? <Binfo handleFieldChange={handleFieldChange} /> : <></>
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

function RnaForm({setExtNeeded, extNeeded, handleRadiooptChange, handleFieldChange}){
    return(
        <>
            <ExtTrue setExtNeeded={setExtNeeded} handleRadiooptChange={handleRadiooptChange} handleFieldChange={handleFieldChange}/>     
            {extNeeded ? <RnaExtTrue setExtNeeded={setExtNeeded} handleRadiooptChange={handleRadiooptChange} handleFieldChange={handleFieldChange} /> : <></>}  
        </>
    );
}

function DnaForm({setExtNeeded, extNeeded, handleRadiooptChange, handleFieldChange}){
    return(
        <>
            <ExtTrue setExtNeeded={setExtNeeded} handleRadiooptChange={handleRadiooptChange} handleFieldChange={handleFieldChange} />  
            {extNeeded ? <DnaExtTrue setExtNeeded={setExtNeeded} handleRadiooptChange={handleRadiooptChange} handleFieldChange={handleFieldChange} /> : <></>}
        </>
    );
}

function ExtTrue({setExtNeeded, handleRadiooptChange}){
    return(
        <>
            <div className={styles.FFComp}>
                <div>Extrection needed</div>
                <div className={styles.FRad}>
                    <input type="radio" id="ext-yes" name="extraction_needed" value="yes" onChange={(e) => {setExtNeeded(false); handleRadiooptChange(e)}} />
                    <label htmlFor="ext-yes">Yes</label>

                    <input type="radio" id="ext-no" name="extraction_needed" value="no" onChange={(e) => {setExtNeeded(true); handleRadiooptChange(e)}} />
                    <label htmlFor="ext-no">No</label>
                </div>
            </div>
        </>
    );
}

function RnaExtTrue({handleFieldChange, handleRadiooptChange}){
    return(
        <>
            <div className={styles.FFComp}>
                <div>Has RNA been prepared with Total RNA or Coloumn Extraction</div>
                <div className={styles.FRad}>
                    <input type="radio" id="t-rna" name="rna_prep_method" value="Total RNA" onChange={handleRadiooptChange} />
                    <label htmlFor="t-rna">Total RNA</label>

                    <input type="radio" id="c-rna" name="rna_prep_method" value="Column Extraction" onChange={handleRadiooptChange} />
                    <label htmlFor="c-rna">Column Extraction</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <label>Name of the Kit</label>
                <input name="rna_kit_name" onChange={handleFieldChange} />
            </div>  
            <div className={styles.FFComp}>
                <div>Has sample been treated with DNAase</div>
                <div className={styles.FRad}>
                    <input type="radio" id="dnaase-yes" name="dnase_treated" value="yes" onChange={handleRadiooptChange} />
                    <label htmlFor="dnaase-yes">Yes</label>

                    <input type="radio" id="dnaase-no" name="dnase_treated" value="no" onChange={handleRadiooptChange} />
                    <label htmlFor="dnaase-no">No</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <label>RNA has be assesed by</label>
                <select name='rna_assessment' onChange={handleFieldChange}>
                    <option value="Quibit">Qubit</option>
                    <option value="Nanodrop">Nanodrop</option>
                    <option value="Bio-Analyzer">Bio-Analyzer</option>
                    <option value="TapeStation">TapeStation</option>
                    <option value="Not assesed">Not assesed</option>
                    <option value="Other">Other</option>
                </select>
            </div>    
        </>
    );
}

function DnaExtTrue({handleFieldChange, handleRadiooptChange}){
    return(
        <>
            <div className={styles.FFComp}>
                <div>Has sample been treated with RNAase</div>
                <div className={styles.FRad}>
                    <input type="radio" id="dnaase-yes" name="rnase_treated" value="yes" onChange={handleRadiooptChange} />
                    <label htmlFor="dnaase-yes">Yes</label>

                    <input type="radio" id="dnaase-no" name="rnase_treated" value="no" onChange={handleRadiooptChange} />
                    <label htmlFor="dnaase-no">No</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <label>Name of the Kit</label>
                <input name="dna_kit_name" onChange={handleFieldChange}/>
            </div>  
            <div className={styles.FFComp}>
                <label>DNA QC has be assesed by</label>
                <select name="dna_assessment" onChange={handleFieldChange}>
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
                    <label htmlFor='fileupload'>Select the file</label>
                    <input onChange={fileIn} id='fileupload' type='file' accept='.csv, .xlsx' />
                    <button onClick={fileUpload}>Upload File</button>
                </div>
                <SendButton submitNGSForm={submitNGSForm} />
                
            </div>
        </>

    );
}

function Binfo({handleFieldChange}) {
    return(
        <>
            <div className={styles.FFComp}>
                <div>Key Objectives</div>
                <textarea rows={5} name="key_objectives" onChange={handleFieldChange} />
            </div>

            <div className={styles.FFComp}>
                <div>Comparisons for differential analysis</div>
                <textarea rows={5} name="differential_comparisons" onChange={handleFieldChange} />
            </div>

            <div className={styles.FFComp}>
                <div>Any additional analysis</div>
                <textarea rows={5} name="additional_analysis" onChange={handleFieldChange} />
            </div>

            <div className={styles.FFComp}>
                <div>Any reference study to follow for the analysis</div>
                <textarea rows={5} name="reference_study" onChange={handleFieldChange} />
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