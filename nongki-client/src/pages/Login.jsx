import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Login.css';
import logo from '../assets/logo.png';
import { authApi, setAuthToken } from '../services/api';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const trimmedIdentifier = identifier.trim();
        if (!trimmedIdentifier) {
            setErrorMessage('Please enter your email or username.');
            return;
        }

        if (!password) {
            setErrorMessage('Please enter your password.');
            return;
        }

        setLoading(true);

        try {
            const { ok, data } = await authApi.login(trimmedIdentifier, password);

            if (ok && data?.token) {
                const resolvedEmail = trimmedIdentifier === 'admin' ? 'admin@nongki.id' : trimmedIdentifier;
                setAuthToken(data.token, data.expireIn, resolvedEmail);
                setSuccessMessage('Welcome back! Redirecting to reservation...');
                setTimeout(() => {
                    navigate('/order');
                }, 400);
            } else {
                if (data?.data && typeof data.data === 'object') {
                    const validationMsgs = Object.values(data.data).join(' ');
                    setErrorMessage(validationMsgs || data.message || 'Validation error.');
                } else if (data?.message) {
                    setErrorMessage(data.message);
                } else {
                    setErrorMessage('Invalid username or password. Please try again.');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setErrorMessage('Unable to connect to the server. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemoAdmin = () => {
        setIdentifier('admin');
        setPassword('123');
        setErrorMessage('');
    };

    return (
        <div className="auth-page">
            <div className="auth-ambient-glow" />

            <div className="auth-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo-link" title="Back to Nongki Home">
                        <img src={logo} alt="Nongki Logo" className="auth-logo" />
                    </Link>
                    <h1 className="auth-title">Welcome Back</h1>
                    <p className="auth-subtitle">Sign in to book your favorite workspace & coffee spot</p>
                </div>

                <form className="auth-form" onSubmit={handleLogin} noValidate>
                    {errorMessage && (
                        <div className="auth-alert error-alert" role="alert">
                            <span>{errorMessage}</span>
                        </div>
                    )}
                    {successMessage && (
                        <div className="auth-alert success-alert" role="status">
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <div className="auth-field">
                        <label htmlFor="identifier">Email or Username</label>
                        <div className="input-wrapper">
                            <FaUser className="input-icon" />
                            <input
                                id="identifier"
                                type="text"
                                placeholder="name@domain.com or admin"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                disabled={loading}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <div className="field-label-row">
                            <label htmlFor="password">Password</label>
                            <button
                                type="button"
                                className="demo-fill-btn"
                                onClick={fillDemoAdmin}
                                title="Click to autofill default demo admin credentials"
                            >
                                Use Demo Admin
                            </button>
                        </div>
                        <div className="input-wrapper">
                            <FaLock className="input-icon" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="toggle-password-btn"
                                onClick={() => setShowPassword(!showPassword)}
                                tabIndex="-1"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? (
                            <span className="btn-loading-content">
                                <span className="btn-spinner" />
                                Authenticating...
                            </span>
                        ) : (
                            <span className="btn-text-content">
                                Sign In
                                <FaArrowRight className="btn-arrow" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="switch-auth-text">
                        Don't have an account?{' '}
                        <Link to="/register" className="auth-link">
                            Create account
                        </Link>
                    </p>
                    <div className="auth-security-badge">
                        <FaShieldAlt className="shield-icon" />
                        <span>Protected by Nongki Auth Guard</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
