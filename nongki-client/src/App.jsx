import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import GuestRoute from './Components/GuestRoute';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Order = lazy(() => import('./pages/Order'));
const Map = lazy(() => import('./pages/Map'));
const Confirm = lazy(() => import('./pages/Confirm'));

function PageLoader() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            color: '#feb600',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '18px',
            fontWeight: 500
        }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '3px solid rgba(254, 182, 0, 0.2)',
                    borderTop: '3px solid #feb600',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    margin: '0 auto 16px'
                }} />
                Loading Nongki...
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                    <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
                    <Route path="/map" element={<ProtectedRoute><Map /></ProtectedRoute>} />
                    <Route path="/confirm" element={<ProtectedRoute><Confirm /></ProtectedRoute>} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
