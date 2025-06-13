import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import logo from './assets/logo.png';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        if (username === 'admin' && password === '123') {
            navigate('/order');
        } else {
            alert('Username atau password salah!');
        }
    };

    return (
        <div className="login-page">
            <div className="card">
                <div>
                    <img src={logo} alt="Logo" className="logo-login" />
                    <h3 className="title">Login into your account</h3>
                </div>
                <div className="login-container">
                    <label htmlFor='username'>Username</label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor='password'>Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                    <p className="register-link">
                        Don't have an account? <a href="/register">Register</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;