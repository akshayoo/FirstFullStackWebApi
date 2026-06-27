import styles from '../LabForm.module.css'
import { useState, useRef } from 'react';
import axiosApi from '@/lib/api';
import { toastSet } from '@/components/toastfunc';
import { MessageComp } from '@/components/messageComp';
import Image from 'next/image';

export function NcounterForm({ projectId }) {

    const [activeTab, setActiveTab] = useState("instructions")

    const [extChange, setExtChange] = useState(false)
    const [binfAnalysis, setBinfanalysis] = useState(false)

    const [file, setFile] = useState(null)
    const [tablePopulate, setTablePopulate] = useState([])
    const fileInputRef = useRef(null)

    const [formData, setFormData] = useState({
        project_id: projectId,
        technology: "nCounter",
        application: "",
        replicates: "",
        extraction_needed: "",

        rna_prep: "",
        dnase_treated: "",
        rna_kit_name: "",
        rna_assessment: "",

        bioinformatics_needed: "",
        key_objectives: "",
        differential_comparisons: "",
        additional_analysis: "",
        reference_study: "",

        project_description: ""
    })

    const [toast, setToast] = useState(null)
    const [buttonDis, setButtonDis] = useState(false)

    const handleFieldChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev, [name]: value
        }))
    }

    const handleRadiooptChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev, [name]: value
        }))
    }

    const fileIn = (e) => {
        const selFile = e.target.files[0]
        setFile(selFile)
    }


    async function fileUpload() {

        try {

            if (!file) {
                toastSet(setToast, false, "Choose a file before uploading")
                return
            }

            const uploadData = new FormData()
            uploadData.append("file", file)

            const response = await axiosApi.post("/intake/tablepopulate",
                uploadData
            )
            const data = response.data

            if (!data.status) {
                toastSet(setToast, false, data.message)
                return
            }

            console.log(data.message)

            const formPop = data.submission

            setTablePopulate(formPop)
            setFile(null)
            if (fileInputRef.current) fileInputRef.current.value = ""

        }

        catch (error) {
            console.log(error)
            toastSet(setToast, false, "Error uploading the table")
        }
    }

    function clearTable() {
        setTablePopulate([])
    }


    async function sendNcounterForm() {
        
        if (!formData.application || !formData.replicates ||
            !formData.extraction_needed || !formData.bioinformatics_needed)
        { toastSet(setToast, false, "Please complete every field marked *"); return }

        if (!tablePopulate.length) { toastSet(setToast, false, "Upload your sample table before submitting"); return }

        const payload = { ...formData, table: tablePopulate }

        setButtonDis(true)

        try {
            const response = await axiosApi.post("/intake/ncounterform", payload)

            const data = response.data

            toastSet(setToast, data.status, data.message)

            setTimeout(() => window.location.reload(), 2000)

        }
        catch (error) {
            console.log(error)
            toastSet(setToast, false, "Error submitting the form")
            setButtonDis(false)
        }
    }


    return (
        <div className={styles.MainFormPage}>
            <div className={styles.FormBox}>

                <FormTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                {activeTab === "instructions" ? (
                    <Instructions onStart={() => setActiveTab("form")} />
                ) : (
                    <div className={styles.FormContentRow}>

                        <div className={styles.FormFieldsCol}>

                            <div className={styles.FormHeader}>
                                <h2>nCounter Sample Submission</h2>
                                <p>Fields marked <span className={styles.requiredMark}>*</span> are required.</p>
                            </div>

                            <StepCard number="1" title="Profiling mRNA or miRNA?" required>
                                <ChoiceGroup
                                    name="application"
                                    ariaLabel="Profiling mRNA or miRNA?"
                                    options={[{ value: "mRNA", label: "mRNA" }, { value: "miRNA", label: "miRNA" }]}
                                    onChange={handleRadiooptChange}
                                />
                            </StepCard>

                            <StepCard number="2" title="Project description, objectives & sample information" required>
                                <p className={styles.fieldHelp}>Please avoid leaving this as "NIL", the more context you give us, the smoother your project will run.</p>
                                <textarea
                                    className={styles.textArea}
                                    name="project_description"
                                    onChange={handleFieldChange}
                                    rows={5}
                                    placeholder="Tell us about your project, goals, and anything else we should know..."
                                />
                            </StepCard>

                            <StepCard number="3" title="Are there replicates?" required>
                                <ChoiceGroup
                                    name="replicates"
                                    ariaLabel="Are there replicates?"
                                    options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}
                                    onChange={handleRadiooptChange}
                                />
                            </StepCard>

                            <StepCard number="4" title="Does the sample need extraction?" required>
                                <p className={styles.fieldHelp}>Choose "No" if your samples are already extracted we'll ask a couple of quick follow-up questions about that prep.</p>
                                <ChoiceGroup
                                    name="extraction_needed"
                                    ariaLabel="Does the sample need extraction?"
                                    options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}
                                    onChange={(e) => { setExtChange(e.target.value === "No"); handleRadiooptChange(e) }}
                                />

                                {extChange && (
                                    <div className={styles.SubFields}>
                                        <div className={styles.Divider} />
                                        <ExtractionSubFields handleFieldChange={handleFieldChange} handleRadiooptChange={handleRadiooptChange} />
                                    </div>
                                )}
                            </StepCard>

                            <StepCard number="5" title="Do you need bioinformatics analysis?" required>
                                <ChoiceGroup
                                    name="bioinformatics_needed"
                                    ariaLabel="Do you need bioinformatics analysis?"
                                    options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}
                                    onChange={(e) => { setBinfanalysis(e.target.value === "Yes"); handleRadiooptChange(e) }}
                                />

                                {binfAnalysis && (
                                    <BioinformaticsFields handleFieldChange={handleFieldChange} />
                                )}
                            </StepCard>

                        </div>

                        <div className={styles.FormTableCol}>
                            <div className={styles.FormTableScroll}>
                                <SampleTableStep
                                    fileIn={fileIn}
                                    fileUpload={fileUpload}
                                    clearTable={clearTable}
                                    tablePopulate={tablePopulate}
                                    file={file}
                                    fileInputRef={fileInputRef}
                                    templateHref="/sample-submission-templates/template.ncounter.csv"
                                />
                            </div>

                            <div className={styles.ActionBar}>
                                <span className={tablePopulate.length ? styles.ActionBarHintReady : styles.ActionBarHint}>
                                    {tablePopulate.length
                                        ? `${tablePopulate.length} sample${tablePopulate.length > 1 ? "s" : ""} ready to submit`
                                        : "Add your sample table above to finish"}
                                </span>
                                <SendButton sendNcounterForm={sendNcounterForm} buttonDis={buttonDis} />
                            </div>
                        </div>

                    </div>
                )}

            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message} />}
        </div>
    );

}


function FormTabs({ activeTab, setActiveTab }) {
    return (
        <div className={styles.FormTabsBar}>
            <button
                className={activeTab === "instructions" ? `${styles.FormTab} ${styles.FormTabActive}` : styles.FormTab}
                onClick={() => setActiveTab("instructions")}
            >
                Instructions
            </button>
            <button
                className={activeTab === "form" ? `${styles.FormTab} ${styles.FormTabActive}` : styles.FormTab}
                onClick={() => setActiveTab("form")}
            >
                Fill the form
            </button>
        </div>
    );
}

function Instructions({ onStart }) {
    const items = [
        { title: "1. Profiling type", body: "Tell us whether you're profiling mRNA or miRNA." },
        { title: "2. Describe your project", body: "Give us context on what you're studying and what you're hoping to get out of it. Please don't leave this as \"NIL\"." },
        { title: "3. Replicates", body: "Let us know whether your samples have replicates." },
        { title: "4. Extraction", body: "Tell us if you need us to extract your samples for you, or if they're already extracted (we'll ask a couple of quick questions about prep, kit, and QC if so)." },
        { title: "5. Bioinformatics analysis", body: "Let us know if you'd like us to run the analysis, and if so, what you're hoping to learn from it." },
        { title: "6. Sample sheet", body: "Download the template, fill in one row per sample, and upload it. You'll see your samples listed in a table once it loads, check it carefully before submitting." },
    ]

    return (
        <div className={styles.InstructionsPanel}>
            <div className={styles.InstructionsIntro}>
                <h2>Before you start</h2>
                <p>This form takes about 3 to 5 minutes. Here's what to expect, step by step.</p>
            </div>

            <div className={styles.InstructionsList}>
                {items.map((item) => (
                    <div className={styles.InstructionsItem} key={item.title}>
                        <div className={styles.InstructionsText}>
                            <h4>{item.title}</h4>
                            <p>{item.body}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.InstructionsNote}>
                <strong>Tip:</strong> have your sample details ready before you begin like: extraction kit names, concentrations, and replicate groupings so you can fill in the sample sheet in one go.
            </div>

            <button className={styles.SubmitButton} onClick={onStart}>Start the form</button>
        </div>
    );
}

function StepCard({ number, title, required, children }) {
    return (
        <section className={styles.StepCard}>
            <div className={styles.StepBadge}>{number}</div>
            <div className={styles.StepBody}>
                <h3 className={styles.StepTitle}>
                    {title}{required && <span className={styles.requiredMark}>*</span>}
                </h3>
                {children}
            </div>
        </section>
    );
}

function ChoiceGroup({ name, options, onChange, compact, ariaLabel }) {
    return (
        <div className={compact ? `${styles.ChoiceGroup} ${styles.ChoiceGroupCompact}` : styles.ChoiceGroup} role="radiogroup" aria-label={ariaLabel || name}>
            {options.map((opt) => {
                const id = `${name}-${opt.value}`
                return (
                    <div className={styles.ChoiceItem} key={id}>
                        <input type="radio" id={id} name={name} value={opt.value} onChange={onChange} />
                        <label htmlFor={id} className={styles.ChoiceCard}>
                            <span className={styles.ChoiceDot} aria-hidden="true" />
                            {opt.label}
                        </label>
                    </div>
                )
            })}
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div className={styles.Field}>
            <label className={styles.FieldLabel}>{label}</label>
            {children}
        </div>
    );
}

function ExtractionSubFields({ handleFieldChange, handleRadiooptChange }) {
    return (
        <>
            <Field label="Has Total RNA prep been used?">
                <ChoiceGroup
                    name="rna_prep"
                    ariaLabel="Has Total RNA prep been used?"
                    options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}
                    onChange={handleRadiooptChange}
                    compact
                />
            </Field>
            <Field label="Has the sample been treated with DNase?">
                <ChoiceGroup
                    name="dnase_treated"
                    ariaLabel="Has the sample been treated with DNase?"
                    options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]}
                    onChange={handleRadiooptChange}
                    compact
                />
            </Field>
            <Field label="Name of the kit">
                <input className={styles.TextInput} name="rna_kit_name" onChange={handleFieldChange} placeholder="e.g. Qiagen RNeasy" />
            </Field>
            <Field label="Method used to estimate sample concentration">
                <select className={styles.SelectInput} name="rna_assessment" onChange={handleFieldChange} defaultValue="">
                    <option value="" disabled>Choose a method</option>
                    <option value="Qubit">Qubit</option>
                    <option value="Nanodrop">Nanodrop</option>
                    <option value="Bio-Analyzer">Bio-Analyzer</option>
                    <option value="Tapestation">TapeStation</option>
                    <option value="Other">Other</option>
                </select>
            </Field>
        </>
    );
}

function BioinformaticsFields({ handleFieldChange }) {
    return (
        <div className={styles.SubFields}>
            <div className={styles.Divider} />
            <Field label="Key objectives">
                <textarea className={styles.textArea} rows={4} name="key_objectives" onChange={handleFieldChange} placeholder="What questions should the analysis answer?" />
            </Field>
            <Field label="Comparisons for differential analysis">
                <textarea className={styles.textArea} rows={4} name="differential_comparisons" onChange={handleFieldChange} placeholder="e.g. Treated vs Control" />
            </Field>
            <Field label="Any additional analysis">
                <textarea className={styles.textArea} rows={4} name="additional_analysis" onChange={handleFieldChange} />
            </Field>
            <Field label="Reference study to follow, if any">
                <textarea className={styles.textArea} rows={4} name="reference_study" onChange={handleFieldChange} />
            </Field>
        </div>
    );
}

function SampleTableStep({ fileIn, fileUpload, clearTable, tablePopulate, file, fileInputRef, templateHref }) {
    return (
        <StepCard number="6" title="Add your sample sheet" required>
            <p className={styles.fieldHelp}>
                Download the template below, fill in your samples, then upload it here.
            </p>

            <div className={styles.UploadGif}>
                <Image
                    src="/anim.gif"
                    alt="Loading animation"
                    width={500}
                    height={250}
                    unoptimized 
                />
            </div>

            <div className={styles.UploadRow}>
                <a className={styles.TemplateLink} href={templateHref} download>
                    Download the template
                </a>
            </div>

            <div className={styles.UploadZone}>
                <input
                    ref={fileInputRef}
                    onChange={fileIn}
                    id="fileupload"
                    type="file"
                    accept=".csv"
                    className={styles.HiddenFileInput}
                />
                <label htmlFor="fileupload" className={styles.UploadButton}>Choose file</label>
                <span className={styles.UploadFileName}>{file ? file.name : "No file selected yet"}</span>
                <button type="button" className={styles.UploadConfirmButton} onClick={fileUpload}>Upload table</button>
            </div>

            <div className={styles.TableDiv}>
                <table className={styles.DispTab}>
                    <thead>
                        <tr>
                            <th>Sample ID</th>
                            <th>Description</th>
                            <th>Conc.</th>
                            <th>Notes</th>
                            <th>{"Replicate (Group name)"}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tablePopulate.length > 0 ? (
                            tablePopulate.map((row, index) => (
                                <tr key={index}>
                                    <td>{row["sample_id"]}</td>
                                    <td>{row["description"]}</td>
                                    <td>{row["concentration"]}</td>
                                    <td>{row["notes"]}</td>
                                    <td>{row["replicate_group"]}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                    No preview available. Upload the sample table <b>(.csv)</b> using the template to preview
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {tablePopulate.length > 0 && (
                <button type="button" className={styles.ClearTableButton} onClick={clearTable}>
                    Clear and upload a different file
                </button>
            )}
        </StepCard>
    );
}

function SendButton({ sendNcounterForm, buttonDis }) {
    return (
        <button className={styles.SubmitButton} onClick={sendNcounterForm} disabled={buttonDis}>
            {buttonDis ? <span className={styles.loader}></span> : "Submit"}
        </button>
    )
}