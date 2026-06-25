import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview';
import '../style/reportsList.scss';

const ReportsList = () => {
    const navigate = useNavigate();
    const { getAllReports, reports, loading, setReports } = useInterview();

    useEffect(() => {
        // Clear stale data immediately, then fetch fresh reports for current user
        setReports([]);
        const fetchReports = async () => {
            try {
                await getAllReports();
            } catch (err) {
                console.error("Failed to fetch reports:", err);
            }
        };
        fetchReports();
    }, []);

    // Format the date nicely
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="reports-container">
            {/* Background Blobs */}
            <div className="reports-background">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
            </div>

            {/* Top Navbar */}
            <nav className="reports-nav">
                <div className="nav-brand">
                    <div className="nav-logo">
                        <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                            <rect width="28" height="28" rx="8" fill="url(#logo-grad-rep)" />
                            <path d="M8 14L12 18L20 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <defs>
                                <linearGradient id="logo-grad-rep" x1="0" y1="0" x2="28" y2="28">
                                    <stop stopColor="#6366f1" />
                                    <stop offset="1" stopColor="#d946ef" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="nav-title">Interview Master</span>
                </div>
                <div className="nav-right">
                    <button className="back-btn" onClick={() => navigate('/')}>
                        ← Back to Home
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main className="reports-main">
                <div className="reports-header">
                    <h1>Your Past Reports</h1>
                    <p>Review and study your previously generated interview preparation reports.</p>
                </div>

                {loading ? (
                    <div className="reports-loading">
                        <div className="spinner"></div>
                        <p>Loading your reports...</p>
                    </div>
                ) : (
                    <div className="reports-grid">
                        {reports && reports.length > 0 ? (
                            reports.map((report) => (
                                <div key={report._id} className="report-card glass-panel">
                                    <div className="card-header">
                                        <h3>{report.title || "Interview Report"}</h3>
                                        <span className="card-date">
                                            {formatDate(report.createdAt)}
                                        </span>
                                    </div>
                                    {report.matchScore != null && (
                                        <div className={`match-score ${
                                            report.matchScore >= 70 ? 'score-high' :
                                            report.matchScore >= 40 ? 'score-medium' : 'score-low'
                                        }`}>
                                            <span className="score-label">Match</span>
                                            <div className="score-bar">
                                                <div className="score-fill" style={{ width: `${report.matchScore}%` }} />
                                            </div>
                                            <span className="score-value">{report.matchScore}%</span>
                                        </div>
                                    )}
                                    <div className="card-footer">
                                        <button 
                                            className="view-btn"
                                            onClick={() => navigate(`/interview/${report._id}`, { state: { reportData: report } })}
                                        >
                                            View Report →
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state glass-panel">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                                <h3>No Reports Found</h3>
                                <p>You haven't generated any interview reports yet.</p>
                                <button className="create-btn" onClick={() => navigate('/')}>
                                    Create Your First Report
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default ReportsList;
