import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router';
import { useNavigate, useParams } from 'react-router'; 
import { useInterview } from '../hooks/useInterview';
import '../style/interview.scss';

const Interview = () => {
    // Read the data passed from Home.jsx
    const location = useLocation();
    const { interviewId } = useParams();
    const { getReportById } = useInterview();

    const [reportData, setReportData] = useState(location.state?.reportData || null);
    const [isLoading, setIsLoading] = useState(!location.state?.reportData?.technicalQuestions);

    // State for the currently selected section in the left nav
    const [activeSection, setActiveSection] = useState('technical');

    useEffect(() => {
        const fetchReport = async () => {
            if (!reportData?.technicalQuestions) {
                try {
                    setIsLoading(true);
                    const data = await getReportById(interviewId);
                    setReportData(data);
                } catch (error) {
                    console.error("Failed to fetch full report:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (interviewId) {
            fetchReport();
        }
    }, [interviewId]);

    // If no data was passed (e.g., user navigated here directly without submitting),
    // redirect them back to the home page.
    if (!reportData && !isLoading) {
        return <Navigate to="/" replace />;
    }

    if (isLoading || !reportData) {
        return (
            <div className="interview-container">
                 <div className="interview-background">
                     <div className="shape shape-1"></div>
                     <div className="shape shape-2"></div>
                     <div className="shape shape-3"></div>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                         <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid rgba(99, 102, 241, 0.3)', borderTopColor: '#6366f1', animation: 'spin 1s linear infinite', marginBottom: '16px' }}></div>
                         <p>Loading report details...</p>
                     </div>
                 </div>
            </div>
        );
    }

    const {
        title,
        technicalQuestions = [],
        behavioralQuestions = [],
        preparationPlan = [],
        skillGaps = []
    } = reportData;

    // Helper to render the main content based on the active section
    const renderMainContent = () => {
        switch (activeSection) {
            case 'technical':
                return (
                    <div className="section-content fade-in">
                        <h2 className="section-title">Technical Questions</h2>
                        <div className="cards-list">
                            {technicalQuestions.map((q, index) => (
                                <div key={index} className="interview-card">
                                    <h4 className="q-title">Q{index + 1}: {q.question}</h4>
                                    <div className="q-intention">
                                        <strong>Intention:</strong> {q.intention}
                                    </div>
                                    <div className="q-answer">
                                        <strong>How to Answer:</strong> {q.answer}
                                    </div>
                                </div>
                            ))}
                            {technicalQuestions.length === 0 && <p className="empty-state">No technical questions available.</p>}
                        </div>
                    </div>
                );
            case 'behavioral':
                return (
                    <div className="section-content fade-in">
                        <h2 className="section-title">Behavioral Questions</h2>
                        <div className="cards-list">
                            {behavioralQuestions.map((q, index) => (
                                <div key={index} className="interview-card">
                                    <h4 className="q-title">Q{index + 1}: {q.question}</h4>
                                    <div className="q-intention">
                                        <strong>Intention:</strong> {q.intention}
                                    </div>
                                    <div className="q-answer">
                                        <strong>How to Answer:</strong> {q.answer}
                                    </div>
                                </div>
                            ))}
                            {behavioralQuestions.length === 0 && <p className="empty-state">No behavioral questions available.</p>}
                        </div>
                    </div>
                );
            case 'roadmap':
                return (
                    <div className="section-content fade-in">
                        <h2 className="section-title">Preparation Road Map</h2>
                        <div className="roadmap-timeline">
                            {preparationPlan.map((plan, index) => (
                                <div key={index} className="timeline-item">
                                    <div className="timeline-marker">Day {plan.day}</div>
                                    <div className="timeline-content interview-card">
                                        <h4 className="focus-title">{plan.focus}</h4>
                                        <ul className="tasks-list">
                                            {plan.tasks.map((task, tIndex) => (
                                                <li key={tIndex}>{task}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                            {preparationPlan.length === 0 && <p className="empty-state">No road map available.</p>}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="interview-container">
            {/* Background Blobs (Reused from the design system) */}
            <div className="interview-background">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            {/* Top Navbar */}
            <nav className="interview-nav">
                <div className="nav-brand">
                    <div className="nav-logo">
                        <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                            <rect width="28" height="28" rx="8" fill="url(#logo-grad-int)" />
                            <path d="M8 14L12 18L20 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                                <linearGradient id="logo-grad-int" x1="0" y1="0" x2="28" y2="28">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#d946ef" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="nav-title">Interview Master</span>
                </div>
                <div className="nav-center">
                    <span className="job-title-badge">{title}</span>
                </div>
                <div className="nav-right">
                    <button className="back-btn" onClick={() => window.history.back()}>
                        ← Back to Home
                    </button>
                </div>
            </nav>

            {/* 3-Column Layout */}
            <main className="interview-layout">
                {/* LEFT COLUMN: Navigation */}
                <aside className="layout-left glass-panel">
                    <h3 className="panel-heading">Report Sections</h3>
                    <ul className="nav-menu">
                        <li 
                            className={`nav-item ${activeSection === 'technical' ? 'active' : ''}`}
                            onClick={() => setActiveSection('technical')}
                        >
                            Technical Questions
                        </li>
                        <li 
                            className={`nav-item ${activeSection === 'behavioral' ? 'active' : ''}`}
                            onClick={() => setActiveSection('behavioral')}
                        >
                            Behavioral Questions
                        </li>
                        <li 
                            className={`nav-item ${activeSection === 'roadmap' ? 'active' : ''}`}
                            onClick={() => setActiveSection('roadmap')}
                        >
                            Road Map
                        </li>
                    </ul>
                </aside>

                {/* MIDDLE COLUMN: Main Content */}
                <section className="layout-center glass-panel">
                    {renderMainContent()}
                </section>

                {/* RIGHT COLUMN: Skill Gaps */}
                <aside className="layout-right glass-panel">
                    <h3 className="panel-heading">Skill Gaps</h3>
                    <div className="skill-gaps-container">
                        {skillGaps.length > 0 ? (
                            skillGaps.map((gap, index) => {
                                // Assign a color class based on severity
                                const severityClass = gap.severity === 'high' ? 'severity-high' :
                                                      gap.severity === 'medium' ? 'severity-medium' : 'severity-low';
                                
                                return (
                                    <div key={index} className={`skill-tag ${severityClass}`}>
                                        {gap.skill}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="empty-state">No skill gaps identified!</p>
                        )}
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default Interview;