import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { FaHistory, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import '../Styles/AppHeader.css';

export default function AppHeader({ currentStep = 1, onOpenHistory, historyCount = 0 }) {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem('userEmail') || 'Member';
    const displayName = userEmail.split('@')[0];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpireIn');
        localStorage.removeItem('userEmail');
        navigate('/login');
    };

    const steps = [
        { num: 1, label: 'Schedule', path: '/order' },
        { num: 2, label: 'Select Desk', path: '/map' },
        { num: 3, label: 'Payment', path: '/confirm' },
    ];

    return (
        <header className="app-header">
            <div className="header-brand">
                <Link to="/" className="brand-link" title="Back to Nongki Home">
                    <img src={logo} alt="Nongki Logo" className="brand-logo" />
                </Link>
            </div>

            {/* Step Progress Indicator */}
            <nav className="header-stepper" aria-label="Booking steps">
                {steps.map((step, idx) => {
                    const isCompleted = currentStep > step.num;
                    const isActive = currentStep === step.num;
                    return (
                        <div key={step.num} className="step-wrapper">
                            <div className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                                <span className="step-badge">
                                    {isCompleted ? '✓' : step.num}
                                </span>
                                <span className="step-label">{step.label}</span>
                            </div>
                            {idx < steps.length - 1 && (
                                <div className={`step-connector ${currentStep > step.num ? 'filled' : ''}`} />
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Header Actions */}
            <div className="header-actions">
                <button
                    type="button"
                    className="action-btn history-btn"
                    onClick={onOpenHistory}
                    title="View My Bookings"
                >
                    <FaHistory className="btn-icon" />
                    <span className="btn-text">History</span>
                    {historyCount > 0 && <span className="history-badge">{historyCount}</span>}
                </button>

                <div className="user-profile-pill" title={userEmail}>
                    <FaUserCircle className="user-avatar" />
                    <span className="user-name">{displayName}</span>
                </div>

                <button
                    type="button"
                    className="action-btn logout-btn"
                    onClick={handleLogout}
                    title="Log Out"
                >
                    <FaSignOutAlt className="btn-icon" />
                </button>
            </div>
        </header>
    );
}
