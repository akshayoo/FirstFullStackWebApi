"use client"

import styles from './LabForm.module.css'
import { useState, useEffect, Suspense } from 'react';
import { NcounterForm } from './nCounter/NcounterForm';
import { NgSForm } from './NGS/NgSForm';
import { GeoMxForm } from './GeoMx/GeoMxForm';
import axiosApi from '@/lib/api';
import { useSearchParams } from 'next/navigation';


const applications = {
    "ncounter": "nCounter",
    "ngs": "NGS",
    "geomx": "GeoMx"
}

const DETAIL_FIELDS = [
    { key: "project_id", label: "Project ID" },
    { key: "pi_name", label: "PI Name" },
    { key: "institution", label: "Institute" },
    { key: "lab_dept", label: "Dept / Lab" },
    { key: "email", label: "Contact Email" },
    { key: "service_name", label: "Service" },
    { key: "technology", label: "Technology" },
    { key: "sample_number", label: "Samples" },
]

export function LabFormComp() {
    return (
        <Suspense fallback={null}>
            <LabFormInner />
        </Suspense>
    );
}

export function LabFormInner() {

    const [searchValue, setSearchValue] = useState({})
    const [searchCont, setSearchCont] = useState("")
    const [techNology, setTechNology] = useState("")
    const [projectId, setProjectID] = useState("")

    const searchParams = useSearchParams()

    useEffect(() => {

        const token = searchParams.get("token")
        if (!token) return

        setSearchCont(token)

        async function autoSearch() {
            try {
                const response = await axiosApi.post("/intake/initialinfo",
                    { "project_token": token }
                )
                const data = response.data

                if (!data.status) {
                    alert(`Already filled or token expired`)
                    return
                }

                const payload = data.payload
                setSearchValue(payload)
                setTechNology(payload.technology)
                setProjectID(payload.project_id)
            }
            catch (error) {
                console.log(error)
                alert(`Not a valid token: Error loading the data`)
            }
        }

        autoSearch()
    }, [])

    async function projectSearch() {

        if (!searchCont.trim()) {
            alert("No Token found")
            return
        }

        try {
            const response = await axiosApi.post("/intake/initialinfo",
                { "project_token": searchCont }
            )

            const data = response.data

            if (!data.status) {
                alert(`No project initiated, Please initialte a project`)
                return
            }

            console.log(data.status)

            const payload = data.payload

            setSearchValue(payload)
            setTechNology(payload.technology)
            setProjectID(payload.project_id)
        }

        catch (error) {
            console.log(error)
            alert(`Not a valid token: Error loading the data`)
            return
        }
    }


    const handleSearch = (e) => {

        const value = e.target.value
        setSearchCont(value)
    }

    const FORM_BY_TECH = {
        NGS: <NgSForm projectId={projectId} />,
        nCounter: <NcounterForm projectId={projectId} />,
        GeoMx: <GeoMxForm projectId={projectId} />
    }

    return (
        <div className={styles.ProgCompDiv}>
            <TopBar
                handleSearch={handleSearch}
                searchCont={searchCont}
                projectSearch={projectSearch}
                searchValue={searchValue}
                token = {searchParams.get("token")}
            />
            {FORM_BY_TECH[techNology] ?? <EmptyState />}
        </div>
    );
}


function TopBar({ handleSearch, searchCont, projectSearch, searchValue, token }) {

    const hasProject = Boolean(searchValue.project_id)

    return (
        <div className={styles.TopBar}>
            <div className={styles.TopBarSearch}>
                <span className={styles.TopBarSearchLabel}>Project token</span>
                <input
                    onChange={handleSearch}
                    value={searchCont}
                    placeholder="Paste your project token"
                    onKeyDown={(e) => { if (e.key === "Enter") projectSearch() }}
                    disabled = {token ? true : false}
                />
                {
                    token ? `` : <button onClick={projectSearch}>Search</button>
                }
            </div>

            {hasProject && (
                <>
                    <div className={styles.TopBarDivider} />
                    <div className={styles.TopBarDetails}>
                        {DETAIL_FIELDS.map((field) => (
                            <div className={styles.DetailChip} key={field.key}>
                                <span className={styles.DetailChipLabel}>{field.label}</span>
                                <span className={styles.DetailChipValue}>{searchValue[field.key] || "—"}</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

function EmptyState() {
    return (
        <div className={styles.EmptyState}>
            <div className={styles.EmptyStateInner}>
                <h3>If your Project Token isn't already taken, paste it into the search bar to begin.</h3>
                <p>The sample submission form will appear here automatically.</p>
            </div>
        </div>
    );
}