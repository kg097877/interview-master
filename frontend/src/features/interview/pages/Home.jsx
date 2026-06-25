import { useState } from "react"
import { useNavigate } from "react-router"
import { useAuth } from "../../auth/hooks/useAuth"
import { useInterview } from "../hooks/useInterview"
import "../style/home.scss"

const Home = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resume, setResume] = useState(null)
    const [resumeName, setResumeName] = useState("")
    const { generateReport, loading } = useInterview()
    const [dragActive, setDragActive] = useState(false)

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file && file.type === "application/pdf") {
            setResume(file)
            setResumeName(file.name)
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        const file = e.dataTransfer.files[0]
        if (file && file.type === "application/pdf") {
            setResume(file)
            setResumeName(file.name)
        }
    }

    const handleRemoveFile = () => {
        setResume(null)
        setResumeName("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!resume || !jobDescription.trim()) return
        try {
            const generatedReport = await generateReport({
                resume,
                selfDescription,
                jobDescription
            })
            navigate(`/interview/${generatedReport._id}`, { state: { reportData: generatedReport } })
        } catch (err) {
            console.error("Failed to generate report:", err)
        }
    }

    const onLogout = async () => {
        await handleLogout()
        navigate("/login")
    }

    const isFormValid = resume && jobDescription.trim()

    return (
        <div className="home-container">
            {/* Background blobs — same as auth */}
            <div className="home-background">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            {/* Navbar */}
            <nav className="home-nav">
                <div className="nav-brand">
                    <div className="nav-logo">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <rect width="28" height="28" rx="8" fill="url(#logo-grad)" />
                            <path d="M8 14L12 18L20 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                                <linearGradient id="logo-grad" x1="0" y1="0" x2="28" y2="28">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#d946ef" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="nav-title">Interview Master</span>
                </div>
                <div className="nav-right">
                    <button className="nav-logout" onClick={() => navigate('/reports')} style={{ marginRight: '8px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                        Past Reports
                    </button>
                    <div className="nav-user">
                        <div className="nav-avatar">
                            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="nav-username">{user?.name || user?.email || "User"}</span>
                    </div>
                    <button className="nav-logout" onClick={onLogout}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </button>
                </div>
            </nav>

            {/* Main content */}
            <main className="home-main">
                <div className="home-header">
                    <h1>AI Interview Prep</h1>
                    <p>Upload your resume and job description to get a personalized interview preparation report powered by AI</p>
                </div>

                <form className="home-form" onSubmit={handleSubmit}>
                    {/* Left panel — Job Description */}
                    <div className="home-panel home-panel-left">
                        <div className="panel-header">
                            <div className="panel-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                            </div>
                            <h3>Job Description</h3>
                        </div>
                        <textarea
                            name="jobdescription"
                            id="jobdescription"
                            placeholder="Paste the full job description here..."
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            required
                        ></textarea>
                        <div className="panel-hint">
                            <span className={`char-count ${jobDescription.length > 0 ? 'active' : ''}`}>
                                {jobDescription.length} characters
                            </span>
                        </div>
                    </div>

                    {/* Right panel — Resume & Self Description */}
                    <div className="home-panel home-panel-right">
                        {/* Self Description */}
                        <div className="panel-header">
                            <div className="panel-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h3>About You</h3>
                        </div>

                        <div className="home-input-group">
                            <textarea
                                name="selfdescription"
                                id="selfdescription"
                                placeholder="Briefly describe yourself, your experience, and what you're looking for..."
                                value={selfDescription}
                                onChange={(e) => setSelfDescription(e.target.value)}
                                rows={4}
                            ></textarea>
                        </div>

                        {/* Resume Upload */}
                        <div className="upload-section">
                            <div className="panel-subheader">
                                <div className="panel-icon small">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                </div>
                                <h4>Upload Resume</h4>
                            </div>

                            <div
                                className={`drop-zone ${dragActive ? 'drag-active' : ''} ${resumeName ? 'has-file' : ''}`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => !resumeName && document.getElementById("resume-input").click()}
                            >
                                <input
                                    type="file"
                                    name="resume"
                                    id="resume-input"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    hidden
                                />
                                {resumeName ? (
                                    <div className="file-info">
                                        <div className="file-icon">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                            </svg>
                                        </div>
                                        <div className="file-details">
                                            <span className="file-name">{resumeName}</span>
                                            <span className="file-type">PDF Document</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="file-remove"
                                            onClick={(e) => { e.stopPropagation(); handleRemoveFile() }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18" />
                                                <line x1="6" y1="6" x2="18" y2="18" />
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="drop-content">
                                        <div className="drop-icon">
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                <polyline points="17 8 12 3 7 8" />
                                                <line x1="12" y1="3" x2="12" y2="15" />
                                            </svg>
                                        </div>
                                        <p>Drag & drop your resume here</p>
                                        <span>or click to browse · PDF only</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            type="submit"
                            className={`generate-btn ${loading ? 'loading' : ''}`}
                            disabled={!isFormValid || loading}
                        >
                            {loading ? (
                                <div className="btn-loading">
                                    <div className="btn-spinner"></div>
                                    <span>Generating Report...</span>
                                </div>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                                    </svg>
                                    Generate Interview Report
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}

export default Home