import styles from '../LabForm.module.css'
import { useState } from 'react';


export function NgS() {

    const [appliCation, setAppliCation] = useState(false)

    return(
        <div className={styles.MainFormPage}>
            <div className={styles.FormBox}>
                <div className={styles.FormFirSec}>
                    <div className={styles.FFComp}>
                        <div>Application</div>
                        <div className={styles.FRad}>
                            <input type="radio" id="dna" name="profiling" value="DNA" onChange={() => setAppliCation(false)} />
                            <label htmlFor="dna">DNA</label>

                            <input type="radio" id="rna" name="profiling" value="RNA" onChange={() => setAppliCation(true)} />
                            <label htmlFor="rna">RNA</label>
                        </div>
                    </div>

                    {appliCation ? <RnaForm /> : <DnaForm />}
                </div>

                <div className={styles.FormSceSec}>
                    <div className={styles.FormTableSec}>
                        <DisplayTable />
                    </div>
                </div>
            </div>
        </div>
    );
    
}

function NoForm(){
    return(
        <>
            <div>

            </div>
        </>
    );
}

function RnaForm(){
    return(
        <>
            <div className={styles.FFComp}>
                <div>Sample Requirement</div>
                <div className={styles.FRad}>
                    <div>wyetduhwedeffvrrfbuhfuhe uegfuyeb fheguyfeh ikfheiygfiuernh fijeg fu8eri jheriuhy</div>

                    <div>wudfgc78ywgewujcvebfvehuvgevb   ehhc e eu bej ce egufyge</div>
                </div>
            </div>
            <div className={styles.FFComp}>
                <div>Has RNA been prepared with Total RNA or Coloumn Extraction</div>
                <div className={styles.FRad}>
                    <input type="radio" id="t-rna" name="needmirna" value="Total RNA" />
                    <label htmlFor="t-rna">Total RNA</label>

                    <input type="radio" id="c-rna" name="needmirna" value="Column Extraction" />
                    <label htmlFor="c-rna">Column Extraction</label>
                </div>
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

function DnaForm(){
    return(
        <>
            <div className={styles.FFComp}>
                <div>Sample Requirement</div>
                <div className={styles.FRad}>
                    <div>wyetduhwebvduhwegffbewhjfeugfbuhfuhe uegfuyeb fheguyfeh ikfheiygfiuernh fijeg fu8eri jheriuhy</div>

                    <div>wudfgc78ywgfy8ewtfehgu8fyhe6f4ge4 eg4 yft 4eyfhe4iufe4yfueifguegf ibfvedyb fieh ifuegufyge</div>
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
            <div className={styles.FFComp}>
                <div>Has sample been treated with RNAase</div>
                <div className={styles.FRad}>
                    <input type="radio" id="dnaase-yes" name="dnaase" value="yes" />
                    <label htmlFor="dnaase-yes">Yes</label>

                    <input type="radio" id="dnaase-no" name="dnaase" value="no" />
                    <label htmlFor="dnaase-no">No</label>
                </div>
            </div>  
        </>
    );
}

function DisplayTable(){
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
                    <button>Upload File</button>
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