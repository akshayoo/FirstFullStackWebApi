import styles from '../LabForm.module.css'
import { useState } from 'react';


export function NgSForm() {

    const [appliCation, setAppliCation] = useState(false)
    const [extNeeded, setExtNeeded] = useState(false)

    const fileUpload = () => {

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
                            <input type="radio" id="dna" name="profiling" value="DNA" onChange={() => setAppliCation(false)} />
                            <label htmlFor="dna">DNA</label>

                            <input type="radio" id="rna" name="profiling" value="RNA" onChange={() => setAppliCation(true)} />
                            <label htmlFor="rna">RNA</label>
                        </div>
                    </div>
                    <div className={styles.FFComp}>
                        <div>Are there replicates</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="rep-yes" name="replicates" value="DNA" onChange={() => setAppliCation(false)} />
                            <label htmlFor="rep-yes">Yes</label>

                            <input type="radio" id="rep-no" name="replicates" value="RNA" onChange={() => setAppliCation(true)} />
                            <label htmlFor="rep-no">No</label>
                        </div>
                    </div>

                    {appliCation ? <RnaForm setExtNeeded={setExtNeeded}
                    extNeeded= {extNeeded} /> : <DnaForm setExtNeeded={setExtNeeded}
                    extNeeded = {extNeeded} />}
                </div>

                <div className={styles.FormSceSec}>
                    <div className={styles.FormTableSec}>
                        <DisplayTable fileUpload={fileUpload} />
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
                    <input type="radio" id="ext-yes" name="duplicates" value="yes" onChange={() => setExtNeeded(false)} />
                    <label htmlFor="ext-yes">Yes</label>

                    <input type="radio" id="ext-no" name="duplicates" value="no" onChange={() => setExtNeeded(true)} />
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
                    <input type="radio" id="t-rna" name="prep" value="Total RNA" />
                    <label htmlFor="t-rna">Total RNA</label>

                    <input type="radio" id="c-rna" name="prep" value="Column Extraction" />
                    <label htmlFor="c-rna">Column Extraction</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <div>Has sample been treated with DNAase</div>
                <div className={styles.FRad}>
                    <input type="radio" id="dnaase-yes" name="dnase" value="yes" />
                    <label htmlFor="dnaase-yes">Yes</label>

                    <input type="radio" id="dnaase-no" name="dnase" value="no" />
                    <label htmlFor="dnaase-no">No</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <label>RNA has be assesed by</label>
                <select>
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
                    <input type="radio" id="dnaase-yes" name="dnase" value="yes" />
                    <label htmlFor="dnaase-yes">Yes</label>

                    <input type="radio" id="dnaase-no" name="dnase" value="no" />
                    <label htmlFor="dnaase-no">No</label>
                </div>
            </div>
            <div className={styles.FFComp}>
                <label>DNA QC has be assesed by</label>
                <select>
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

function DisplayTable({fileUpload}){
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
                            <tr>
                                <td>NO DATA</td>
                                <td>NO DATA</td>
                                <td>NO DATA</td>
                                <td>NO DATA</td>
                                <td>NO DATA</td>
                            </tr>                               
                  
                        </tbody>
                    </table>
                </div>
                <div className= {styles.DispUpbtn}>
                    <button>Download Template</button>
                    <button onClick={fileUpload}>Upload File</button>
                </div>
                <SendButton />
                
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