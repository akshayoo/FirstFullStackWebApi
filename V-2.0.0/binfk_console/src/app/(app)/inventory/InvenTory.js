"use client"

import axiosApi from "@/lib/api"
import { toastSet } from "@/components/toastfunc"
import { MessageComp } from "@/components/messageComp"
import styles from "./Inventory.module.css"
import { useState } from "react"


export function InvenTory(){

    const [toast, setToast] = useState(null)

    const[formData, setFormData] = useState({
        item_name : "",
        catalogue_num : "",
        description : "",
        category : "",
        sub_category : [],
        unit_of_measure : "",
        min_stock_qty : ""
    })

    const[formDataVen, setFormDataVen] = useState({
        vendor_name : "",
        contact_name : "",
        contact_email : "",
        contact_phone : "",
        supply_source : "",
        currency : "",
        address : ""
    })

    const submitItem = async() => {

        if(!formData.item_name || !formData.catalogue_num || !formData.description || !formData.category
            || formData.sub_category.length === 0 || !formData.unit_of_measure || !formData.min_stock_qty
        ){
            toastSet(setToast, false, "Missing fields")
            return
        }

        try{

            const response = await axiosApi.post("inventory/additems",
                formData
            )

            const data = response.data

            if(!data.status){
                toastSet(setToast, data.status, data.message)
                return
            }

            toastSet(setToast, true, data.message)
            setFormData({
                item_name : "",
                catalogue_num : "",
                description : "",
                category : "",
                sub_category : [],
                unit_of_measure : "",
                min_stock_qty : ""
            })
            return
        }
        catch(err){
            console.log(err)
            toastSet(setToast, false, "Unable to process request")
            return
        }


    }

    const submitVendor = async() =>{

        if(!formDataVen.vendor_name || !formDataVen.contact_name || !formDataVen.contact_email || !formDataVen.contact_phone
            || !formDataVen.supply_source || !formDataVen.currency
        ){
            toastSet(setToast, false, "Missing fields")
            return
        }

        try{

            const response = await axiosApi.post("inventory/addvendors",
                formDataVen
            )

            const data = await response.data

            if(!data.status){
                toastSet(setToast, data.status, data.message)
                return
            }

            toastSet(setToast, data.status, data.message)
            setFormDataVen({
                vendor_name : "",
                contact_name : "",
                contact_email : "",
                contact_phone : "",
                supply_source : "",
                currency : "",
                address : ""  
            })

        }

        catch(err){
            toastSet(setToast, false, "Unable to process request")
            return
        }
    }

    const handleChange = (e) => {
        const{name, value} = e.target
        setFormData(prev => ({
            ...prev, [name] : value
        }))
    }

    const handleSubCategoryChange = (e) => {
        const values = Array.from(e.target.selectedOptions, (option) => option.value)
        setFormData(prev => ({
            ...prev, sub_category : values
        }))
    }

    const handleVenChange = (e) => {
        const {name, value} = e.target
        setFormDataVen(prev => ({
            ...prev, [name] : value
        }))
    }

    return(
        <div className={styles.InvntRoot}>
            <div className={styles.FormRoot}>
                <div>
                    <h4>Items</h4>
                </div>
                <div className={styles.FormCont}>
                    <label>Item name*</label>
                    <input name="item_name" value={formData.item_name} type="text" onChange={handleChange}/>
                    <label>Catalogue number*</label>
                    <input name="catalogue_num" value={formData.catalogue_num} type="text" onChange={handleChange}/>
                    <label>Description*</label>
                    <textarea name="description" value={formData.description} rows={5} onChange={handleChange}/>
                    <label>Category*</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                        <option value="">--Select--</option>
                        <option value="General">General</option>
                        <option value="Chemical">Chemicals</option>
                        <option value="Solvent">Solvents</option>
                        <option value="Buffer">Buffers</option>
                        <option value="Media">Media</option>
                        <option value="Reagent">Reagents</option>
                        <option value="Kit">Kits</option>
                        <option value="Antibody">Antibodies</option>
                        <option value="Primer">Primers & Probes</option>
                        <option value="Enzyme">Enzymes</option>
                        <option value="Consumable">Consumables</option>
                        <option value="Plasticware">Plasticware</option>
                        <option value="Glassware">Glassware</option>
                        <option value="Stain">Stains & Dyes</option>
                        <option value="InstrumentAccessory">Instrument Accessories</option>
                    </select>
                    <label>Sub Categories*</label>
                    <select value={formData.sub_category} onChange={handleSubCategoryChange} name="sub_category" multiple size="1">
                        <option value="DNA Extraction">DNA Extraction</option>
                        <option value="RNA Extraction">RNA Extraction</option>
                        <option value="cfDNA Extraction">cfDNA Extraction</option>
                        <option value="miRNA Extraction">miRNA Extraction</option>
                        <option value="Tissue Processing">Tissue Processing</option>
                        <option value="Cell Isolation">Cell Isolation</option>
                        <option value="Whole Genome Sequencing (WGS)">Whole Genome Sequencing (WGS)</option>
                        <option value="Whole Exome Sequencing (WES)">Whole Exome Sequencing (WES)</option>
                        <option value="Targeted Sequencing">Targeted Sequencing</option>
                        <option value="Amplicon Sequencing">Amplicon Sequencing</option>
                        <option value="Long Read Sequencing">Long Read Sequencing</option>
                        <option value="Metagenomics">Metagenomics</option>
                        <option value="Variant Analysis">Variant Analysis</option>
                        <option value="Bulk RNA Sequencing">Bulk RNA Sequencing</option>
                        <option value="Small RNA Sequencing">Small RNA Sequencing</option>
                        <option value="miRNA Profiling">miRNA Profiling</option>
                        <option value="Targeted Gene Expression">Targeted Gene Expression</option>
                        <option value="Gene Expression Panels">Gene Expression Panels</option>
                        <option value="Isoform Analysis">Isoform Analysis</option>
                        <option value="Full Length RNA Sequencing">Full Length RNA Sequencing</option>
                        <option value="Iso-Seq">Iso-Seq</option>
                        <option value="Long Read WGS">Long Read WGS</option>
                        <option value="Long Read Transcriptomics">Long Read Transcriptomics</option>
                        <option value="Structural Variant Analysis">Structural Variant Analysis</option>
                        <option value="Sample QC">Sample QC</option>
                        <option value="Sample Processing">Sample Processing</option>
                        <option value="Genomics">Genomics</option>
                        <option value="Transcriptomics">Transcriptomics</option>
                        <option value="Single Cell">Single Cell</option>
                        <option value="Spatial Biology">Spatial Biology</option>
                        <option value="Epigenomics">Epigenomics</option>
                        <option value="Proteomics">Proteomics</option>
                        <option value="Bioinformatics">Bioinformatics</option>
                        <option value="Quality Control">Quality Control</option>
                        <option value="Custom Solutions">Custom Solutions</option>
                        <option value="Single Cell RNA-Seq">Single Cell RNA-Seq</option>
                        <option value="Single Cell Multiomics">Single Cell Multiomics</option>
                        <option value="Single Cell ATAC-Seq">Single Cell ATAC-Seq</option>
                        <option value="Single Cell Immune Profiling">Single Cell Immune Profiling</option>
                        <option value="Spatial Transcriptomics">Spatial Transcriptomics</option>
                        <option value="Spatial Proteomics">Spatial Proteomics</option>
                        <option value="Spatial Multiomics">Spatial Multiomics</option>
                        <option value="Digital Spatial Profiling">Digital Spatial Profiling</option>
                        <option value="PacBio Long Read">PacBio Long Read</option>
                        <option value="ONT Long Read">ONT Long Read</option>
                        <option value="RNA-Seq Analysis">RNA-Seq Analysis</option>
                        <option value="Single Cell Analysis">Single Cell Analysis</option>
                        <option value="Spatial Data Analysis">Spatial Data Analysis</option>
                        <option value="Differential Expression Analysis">Differential Expression Analysis</option>
                        <option value="Pathway Analysis">Pathway Analysis</option>
                        <option value="Variant Calling">Variant Calling</option>
                        <option value="Multiomics Integration">Multiomics Integration</option>
                        <option value="Library Preparation">Library Preparation</option>
                        <option value="Sequencing">Sequencing</option>
                        <option value="Data Analysis">Data Analysis</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Training">Training</option>
                        <option value="Research Services">Research Services</option>
                        <option value="Others">Others</option>
                    </select>
                    <label>Unit of measure*</label>
                    <select name="unit_of_measure" value={formData.unit_of_measure} onChange={handleChange}>
                        <option value="">--Select--</option>
                        <option value="reaction">Reaction</option>
                        <option value="unit">Unit</option>
                        <option value="pcs">Pieces (pcs)</option>
                        <option value="box">Box</option>
                        <option value="pack">Pack</option>
                        <option value="bottle">Bottle</option>
                        <option value="vial">Vial</option>
                        <option value="tube">Tube</option>
                        <option value="plate">Plate</option>
                        <option value="tags">Tags</option>
                        <option value="ul">µL</option>
                        <option value="ml">mL</option>
                        <option value="l">L</option>
                        <option value="ug">µg</option>
                        <option value="mg">mg</option>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="ng_ul">ng/µL</option>
                        <option value="ug_ml">µg/mL</option>
                        <option value="mg_ml">mg/mL</option>
                        <option value="mm">mM</option>
                        <option value="um">µM</option>
                        <option value="percent">% (w/v or v/v)</option>
                        <option value="mm_len">mm</option>
                        <option value="cm">cm</option>
                        <option value="m">m</option>
                        <option value="cm2">cm²</option>
                        <option value="m2">m²</option>
                        <option value="celsius">°C</option>
                        <option value="cells">Cells</option>
                        <option value="sample">Sample</option>
                        <option value="assay">Assay</option>
                        <option value="general">General</option>
                    </select>
                    <label>Minimum stock quantity</label>
                    <input name="min_stock_qty" value={formData.min_stock_qty} type="number" onChange={handleChange}/>
                </div>
                <button onClick={() => submitItem()}>SUBMIT</button>
            </div>
            <div className={styles.FormRoot}>
                <div>
                    <h4>Vendors</h4>
                </div>
                <div className={styles.FormCont}>
                    <label>Vendor name*</label>
                    <input name="vendor_name" value={formDataVen.vendor_name} type="text" onChange={handleVenChange}/>
                    <label>Primary contact name*</label>
                    <input name="contact_name" value={formDataVen.contact_name} type="text" onChange={handleVenChange}/>
                    <label>Primary contact email*</label>
                    <input name="contact_email" value={formDataVen.contact_email} type="text" onChange={handleVenChange}/>
                    <label>Primary contact phone*</label>
                    <input name="contact_phone" value={formDataVen.contact_phone} type="text" onChange={handleVenChange}/>
                    <label>Source of supply*</label>
                    <input name="supply_source" value={formDataVen.supply_source} type="text" onChange={handleVenChange}/>
                    <label>Currency*</label>
                    <select name="currency" value={formDataVen.currency} onChange={handleVenChange}>
                        <option value="">--select--</option>
                        <option value="INR">INR - Indian Rupee</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="CHF">CHF - Swiss Franc</option>
                        <option value="SGD">SGD - Singapore Dollar</option>
                        <option value="CNY">CNY - Chinese Yuan</option>
                    </select>
                    <label>Vendor address</label>
                    <textarea name="address" value={formDataVen.address} rows={5} onChange={handleVenChange}/>
                </div>
                <button onClick={() => submitVendor()}>SUBMIT</button>
            </div>
            {toast && <MessageComp condition={toast.condition} message={toast.message}/>}
        </div>
    )
}