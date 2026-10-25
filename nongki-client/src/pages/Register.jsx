import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Register.css';
import logo from '../assets/logo.png';
import { authApi } from '../services/api';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaShieldAlt } from 'react-icons/fa';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phoneNumber.trim();

        if (!trimmedName) {
            setErrorMessage('Full name is required.');
            return;
        }
        if (trimmedName.length < 5) {
            setErrorMessage('Name must be at least 5 characters long.');
            return;
        }

        if (!trimmedEmail) {
            setErrorMessage('Email address is required.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }
        if (trimmedEmail.length < 5 || trimmedEmail.length > 50) {
            setErrorMessage('Email must be between 5 and 50 characters.');
            return;
        }

        if (!trimmedPhone) {
            setErrorMessage('Phone number is required.');
            return;
        }
        if (trimmedPhone.length < 10 || trimmedPhone.length > 15) {
            setErrorMessage('Phone number must be between 10 and 15 digits.');
            return;
        }

        if (!password) {
            setErrorMessage('Password is required.');
            return;
        }
        if (password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            return;
        }

        setLoading(true);

        const payload = {
            name: trimmedName,
            email: trimmedEmail,
            phoneNumber: trimmedPhone,
            password: password,
        };

        try {
            const { ok, status, data } = await authApi.register(payload);

            if (ok && data?.success !== false) {
                setSuccessMessage('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 1200);
            } else {
                if (data?.data && typeof data.data === 'object') {
                    const validationMsgs = Object.values(data.data).join(' ');
                    setErrorMessage(validationMsgs || data.message || 'Validation error.');
                } else if (data?.message) {
                    setErrorMessage(data.message);
                } else {
                    setErrorMessage(`Registration failed (Status ${status}). Please try again.`);
                }
            }
        } catch (err) {
            console.error('Registration error:', err);
            setErrorMessage('Unable to connect to the server. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-ambient-glow" />

            <div className="auth-card register-card">
                <div className="auth-header">
                    <Link to="/" className="auth-logo-link" title="Back to Nongki Home">
                        <img src={logo} alt="Nongki Logo" className="auth-logo" />
                    </Link>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join Nongki to reserve coworking spaces and enjoy barista perks</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
                        <label htmlFor="name">Full Name</label>
                        <div className="input-wrapper">
                            <FaUser className="input-icon" />
                            <input
                                id="name"
                                type="text"
                                placeholder="Your full name (min 5 characters)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={loading}
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="email">Email Address</label>
                        <div className="input-wrapper">
                            <FaEnvelope className="input-icon" />
                            <input
                                id="email"
                                type="email"
                                placeholder="you@domain.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <div className="input-wrapper">
                            <FaPhone className="input-icon" />
                            <input
                                id="phoneNumber"
                                type="tel"
                                placeholder="08xxxxxxxxxx (10-15 digits)"
                                maxLength={15}
                                inputMode="numeric"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="auth-field">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <FaLock className="input-icon" />
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create password (min 8 characters)"
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
                                Registering...
                            </span>
                        ) : (
                            <span className="btn-text-content">
                                Create Account
                                <FaArrowRight className="btn-arrow" />
                            </span>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <p className="switch-auth-text">
                        Already have an account?{' '}
                        <Link to="/login" className="auth-link">
                            Sign in
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

export default Register;
