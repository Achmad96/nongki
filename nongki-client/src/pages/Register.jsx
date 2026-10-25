import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Register.css';
import logo from '../assets/logo.png';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        // Client-side validations matching backend constraints
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phoneNumber.trim();

        if (!trimmedName) {
            setErrorMessage('Name is required.');
            return;
        }
        if (trimmedName.length < 5) {
            setErrorMessage('Name must be at least 5 characters long.');
            return;
        }

        if (!trimmedEmail) {
            setErrorMessage('Email is required.');
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
            // First attempt relative URL (via Vite dev proxy)
            let response;
            try {
                response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } catch (proxyError) {
                // If proxy fails or backend is on another origin, try direct backend URL
                response = await fetch('http://localhost:8081/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            const data = await response.json().catch(() => null);

            if (response.ok && data?.success !== false) {
                setSuccessMessage('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 1500);
            } else {
                if (data?.data && typeof data.data === 'object') {
                    // Extract field validation errors
                    const validationMsgs = Object.values(data.data).join(' ');
                    setErrorMessage(validationMsgs || data.message || 'Validation error.');
                } else if (data?.message) {
                    setErrorMessage(data.message);
                } else {
                    setErrorMessage(`Registration failed (Status ${response.status}). Please try again.`);
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
        <div className="login-page">
            <div className="card">
                <div>
                    <img src={logo} alt="Logo" className="logo-login" />
                    <h3 className="title">Create an account</h3>
                </div>

                <form className="register-container" onSubmit={handleSubmit}>
                    {errorMessage && <div className="register-error-msg">{errorMessage}</div>}
                    {successMessage && <div className="register-success-msg">{successMessage}</div>}

                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Full Name (min 5 chars)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={loading}
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email (e.g. user@mail.com)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />

                    <label htmlFor="number">Number</label>
                    <input
                        id="number"
                        type="tel"
                        placeholder="Phone Number (10-15 digits)"
                        maxLength={15}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        onKeyDown={(e) => {
                            const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                            if (
                                e.key.length === 1 &&
                                !/[0-9]/.test(e.key) &&
                                !allowedKeys.includes(e.key)
                            ) {
                                e.preventDefault();
                            }
                        }}
                        disabled={loading}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password (min 8 chars)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Regist'}
                    </button>

                    <p className="register-link">
                        Already have an account? <Link to="/login">Login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
