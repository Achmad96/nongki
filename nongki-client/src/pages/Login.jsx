import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Styles/Login.css';
import logo from '../assets/logo.png';

function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
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
            setErrorMessage('Email or username is required.');
            return;
        }

        if (!password) {
            setErrorMessage('Password is required.');
            return;
        }

        // Quick demo bypass
        if (trimmedIdentifier === 'admin' && password === '123') {
            localStorage.setItem('userEmail', 'admin@nongki.id');
            localStorage.setItem('token', 'demo-admin-token');
            navigate('/order');
            return;
        }

        setLoading(true);

        const payload = {
            email: trimmedIdentifier,
            password: password,
        };

        try {
            let response;
            try {
                response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            } catch (proxyError) {
                // If proxy fails, try direct backend URL
                response = await fetch('http://localhost:8081/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            const data = await response.json().catch(() => null);

            if (response.ok && data?.token) {
                localStorage.setItem('token', data.token);
                if (data.expireIn) {
                    localStorage.setItem('tokenExpireIn', data.expireIn);
                }
                localStorage.setItem('userEmail', trimmedIdentifier);
                setSuccessMessage('Login successful! Redirecting...');
                setTimeout(() => {
                    navigate('/order');
                }, 500);
            } else {
                if (data?.data && typeof data.data === 'object') {
                    const validationMsgs = Object.values(data.data).join(' ');
                    setErrorMessage(validationMsgs || data.message || 'Validation error.');
                } else if (data?.message) {
                    setErrorMessage(data.message);
                } else {
                    setErrorMessage('Invalid email or password.');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
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
                    <h3 className="title">Login into your account</h3>
                </div>

                <form className="login-container" onSubmit={handleLogin}>
                    {errorMessage && <div className="login-error-msg">{errorMessage}</div>}
                    {successMessage && <div className="login-success-msg">{successMessage}</div>}

                    <label htmlFor="identifier">Email / Username</label>
                    <input
                        id="identifier"
                        type="text"
                        placeholder="Email or Username"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        disabled={loading}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p className="register-link">
                        Don't have an account? <Link to="/register">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
