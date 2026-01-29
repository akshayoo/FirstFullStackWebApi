"use client"

import styles from './ProjectDetails.module.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

export function ProjectDetailsComp() {

    const [servicesClass, setServicesClass] = useState({})
    const [classServices, setClassServices] = useState([])
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedServ, setSelectedServ] = useState("");
    const [selectedServProps, setSelectedServProps] = useState(null);
    const [projectDesc, setProjectDesc] = useState("");

    const [formData, setFormData] = useState({
        project_id: "",
        pi_name: "",
        email: "",
        institution: "",
        labdept: "",
        offering_type: "",
        service_name: "",
        sam_number: "",
        duplicates: "",
        extraction: "",
        sample_type: "",
        platform: "",
        application: "",
        project_desc: ""
    });

    useEffect(() =>{
        async function DataLoad(){
            try{
                const response = await axios.get("http://127.0.0.1:4040/ssub/projdet/fillinfo")
                setServicesClass(response.data)
            }
            catch(error){
                console.log("API Error:" + error)
            }
        }
        DataLoad()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRadioChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const onClassChange = (e) => {
        const value = e.target.value;
        setSelectedClass(value);
        setClassServices(servicesClass[value] || [])

        setFormData(prev => ({
            ...prev,
            offering_type: value
        }));
    };

    const onServiceSelct = (e) => {
        const serv_value = e.target.value;
        setSelectedServ(serv_value);

        const selectedServiceObj = classServices.find(
            s => s.service_name === serv_value
        );

        setSelectedServProps(selectedServiceObj || null);

        if (selectedServiceObj) {
            const processText = selectedServiceObj.process_map?.join("\n") || "No data available"

            const sd = selectedServiceObj.standard_deliverables;
            const deliverableText = sd
                ? [
                    ...(sd.reports || []),
                    ...(sd["add-ons"] || [])
                ].join("\n")
                : "";

            const desc =`PROCESS MAP\n\n${processText}\n\n\nSTANDARD DELIVERABLES\n\n${deliverableText}`

            setProjectDesc(desc);

            setFormData(prev => ({
                ...prev,
                service_name: serv_value,
                platform: selectedServiceObj.instrumentation?.platform || "",
                application: selectedServiceObj.applications || "",
                project_desc: desc
            }))
        }
    };


    const validateForm = () => {
        for (const key in formData) {
            if (!formData[key] || formData[key].toString().trim() === "") {
                alert(`Missing required field: ${key.replaceAll("_", " ")}`);
                return false;
            }
        }
        return true;
    }


    const SendProjectInfo = async () => {
        if (!validateForm()) return;

        try {
            const mailsendresponse = await axios.post(
                "http://127.0.0.1:4040/ssub/projdet/submit", formData,
                { headers: { "Content-Type": "application/json" } }
            );

            const s_data = mailsendresponse.data;
            const proj_id = s_data.project_id
            const status = s_data.status;


            alert(`Project ${proj_id} submitted successfully (status: ${status})`);
            window.location.reload();

        } catch (error) {
            console.error(error);
            alert("Submission failed");
        }
    }

    return(
        <div className={styles.ProgCompDiv}>
            <SideWin />
            <MainFormPage 
                servicesClass={servicesClass} 
                onClassChange={onClassChange}
                classServices={classServices}
                onServiceSelct={onServiceSelct}
                selectedServProps={selectedServProps}
                projectDesc={projectDesc}
                setProjectDesc={setProjectDesc}
                handleChange={handleChange}
                handleRadioChange={handleRadioChange}
                SendProjectInfo={SendProjectInfo}
            />
        </div>
    )
}

function SideWin(){
    return(
        <div className={styles.projDetSide}>
            <h2>Project Initiation Window</h2>
            <p>You are about to create a new project. Please keep the following in mind before you continue.</p>
            <ul>
                <li>All fields in this form are <strong>mandatory</strong>.</li>
                <li>Ensure the project name and description are clear.</li>
                <li>Some settings cannot be modified later.</li>
                <li>Verify all sample details carefully.</li>
                <li>Incorrect info may affect downstream analysis.</li>
            </ul>
        </div>
    );
}

function MainFormPage({
    servicesClass,
    onClassChange,
    classServices,
    onServiceSelct,
    selectedServProps,
    projectDesc,
    setProjectDesc,
    handleChange,
    handleRadioChange,
    SendProjectInfo
}) {

    return(
        <div className={styles.MainFormPage}>
            <div className={styles.FormBox}>
                <div className={styles.ForminBox}>

                    <div className={styles.InputcompDiv}>
                        <label>Project ID</label>
                        <input name="project_id" type="text" onChange={handleChange} />
                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>PI Name</label>
                        <input name="pi_name" type="text" onChange={handleChange} />
                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>Email</label>
                        <input name="email" type="email" onChange={handleChange} />
                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>Organization/Institution</label>
                        <input name="institution" type="text" onChange={handleChange} />
                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>Lab/Department</label>
                        <input name="labdept" type="text" onChange={handleChange} />
                    </div>
                </div>

                <div className={styles.ForminBox}>

                    <div className={styles.InputcompDiv}>
                        <label>Offerings Type</label>
                        <select name="platform" onChange={onClassChange}>
                            <option value="">Select Offering Type</option>
                            {Object.keys(servicesClass).map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>Recommended Application</label>
                        <select name="service_name" onChange={onServiceSelct}>
                            <option value="">Select Offering Type</option>
                            {classServices.map((servs) => (
                                <option key={servs.service_name} value={servs.service_name}>
                                    {servs.service_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>Type of samples</label>
                        <select name="sample_type" onChange={handleChange}>
                            <option value="">Select sample type</option>
                            {selectedServProps?.supported_sample_types?.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>Number of samples</label>
                        <input name="sam_number" type="number" onChange={handleChange} />
                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>Are there replilicates</label>
                        <div>
                            <input type="radio" name="duplicates" id="dupyes" value="yes" onChange={handleRadioChange} />
                            <label htmlFor="dupyes">Yes</label>
                            <input type="radio" name="duplicates" id="dupno" value="no" onChange={handleRadioChange} />
                            <label htmlFor="dupno">No</label>
                        </div>
                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>Samples Extraction needed</label>
                        <div>
                            <input type="radio" name="extraction" id="extyes" value="yes" onChange={handleRadioChange} />
                            <label htmlFor="extyes">Yes</label>
                            <input type="radio" name="extraction" id="extno" value="no" onChange={handleRadioChange} />
                            <label htmlFor="extno">No</label>
                        </div>

                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>Platform</label>
                        <div className={styles.OutCont}>
                            {selectedServProps?.instrumentation?.platform || "No Info"}
                        </div>
                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>Application</label>
                        <div className={styles.OutCont}>
                            {selectedServProps?.applications || "No Info"}
                        </div>
                    </div>

                    <div className={styles.InputcompDiv}>
                        <label>Project Description and Standard Deliverables</label>
                        <textarea
                            rows={12}
                            value={projectDesc}
                            onChange={(e) => {
                                setProjectDesc(e.target.value);
                                handleChange({
                                    target: { name: "project_desc", value: e.target.value }
                                });
                            }}
                        />
                    </div>

                    <SendButton SendProjectInfo={SendProjectInfo} />
                </div>
            </div>
        </div>
    );
}

function SendButton({ SendProjectInfo }){
    return(
        <div className={styles.SendAppButton}>
            <button onClick={SendProjectInfo}>
                Submit and Send for approval
            </button>
        </div>
    );
}
