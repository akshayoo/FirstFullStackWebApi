import styles from '../LabForm.module.css'
import { useState } from 'react';
import axios from 'axios';

export function NcounterForm() {

    const [extChange, setExtChange] = useState(false)
    const [binfAnalysis, setBinfanalysis] = useState(false)


    const [file, setFile] = useState(null)

    const [tablePopulate, setTablePopulate] = useState([])


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

    return(
        <div className={styles.MainFormPage}>
            <div className={styles.FormBox}>
                <div className={styles.FormFirSec}>
                    <div className={styles.FFComp}>
                        <h2>nCounter Sample Submission Window</h2>
                    </div>
                    <div className={styles.FFComp}>
                        <div>Profiling mRNA or miRNA</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="mrna" name="profiling" value="mRNA" />
                            <label htmlFor="mrna">mRNA</label>

                            <input type="radio" id="mirna" name="profiling" value="miRNA" />
                            <label htmlFor="mirna">miRNA</label>
                        </div>
                    </div>
                    <div className={styles.FFComp}>
                        <div>Are there Replicates</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="dup-yes" name="dup" value="yes" />
                            <label htmlFor="dup-yes">Yes</label>

                            <input type="radio" id="dup-no" name="dup" value="no" />
                            <label htmlFor="dup-no">No</label>
                        </div>
                    </div>
                    <div className={styles.FFComp}>
                        <div>Extrection needed</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="ext-yes" name="dup" value="yes" onChange={() => setExtChange(false)} />
                            <label htmlFor="ext-yes">Yes</label>

                            <input type="radio" id="ext-no" name="dup" value="no" onChange={() => setExtChange(true)}/>
                            <label htmlFor="ext-no">No</label>
                        </div>
                    </div>
                    {extChange ? <ExtCont /> : <></>}

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
                        <DisplayTable fileIn={fileIn} fileUpload={fileUpload} tablePopulate={tablePopulate} />
                    </div>
                </div>
            </div>
        </div>
    );
    
}


function ExtCont() {
    return(

        <>
            <div className={styles.FFComp}>
                <div>Has Total RNA prep been used</div>
                <div className={styles.FRad}>
                    <input type="radio" id="rnaprep-yes" name="totalrnaprep" value="yes" />
                    <label htmlFor="rnaprep-yes">Yes</label>

                    <input type="radio" id="rnaprep-no" name="totalrnaprep" value="no" />
                    <label htmlFor="rnaprep-no">No</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <label>Name of the Kit</label>
                <input />
            </div>  
            <div className={styles.FFComp}>
                <div>Has sample been treated with DNAase</div>
                <div className={styles.FRad}>
                    <input type="radio" id="dnaase-yes" name="dnaase" value="yes" />
                    <label htmlFor="dnaase-yes">Yes</label>

                    <input type="radio" id="dnaase-no" name="dnaase" value="no" />
                    <label htmlFor="dnaase-no">No</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <label>Method used to estimate sample concentration</label>
                <select>
                    <option>Qubit</option>
                    <option>Nanodrop</option>
                    <option>Bio-Analyzer</option>
                    <option>TapeStation</option>
                    <option>Other</option>
                </select>
            </div>  
        </>
    );
}

function DisplayTable({fileIn, fileUpload, tablePopulate}){
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
                <SendButton />
                
            </div>
        </>

    );
}

function Binfo() {
    return(
        <>
            <div className={styles.FFComp}>
                <div>Key Objectives</div>
                <textarea rows={6} />
            </div>

            <div className={styles.FFComp}>
                <div>Comparisons for differential analysis</div>
                <textarea rows={6} />
            </div>

            <div className={styles.FFComp}>
                <div>Any additional analysis</div>
                <textarea rows={6} />
            </div>

            <div className={styles.FFComp}>
                <div>Any reference study to follow for the analysis</div>
                <textarea rows={6} />
            </div>
        </>
    );
}

function SendButton(){
    return(
        <div className={styles.SendAppButton}>
            <button>Submit</button>
        </div>
    );
}