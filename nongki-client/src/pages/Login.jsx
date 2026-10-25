import { useState, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { authApi, setAuthToken } from '../services/api';
import { Button } from '../Components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Components/ui/card';
import { Input } from '../Components/ui/input';
import { Label } from '../Components/ui/label';
import { User, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, CheckCircle, Info } from 'lucide-react';

export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isSessionExpired = useMemo(() => {
        return new URLSearchParams(location.search).get('expired') === '1';
    }, [location.search]);

    const redirectNotice = useMemo(() => {
        if (location.state?.from) {
            return 'Please sign in to access your reservation workspace.';
        }
        if (isSessionExpired) {
            return 'Your previous session has expired. Please sign in again.';
        }
        return '';
    }, [location.state, isSessionExpired]);

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
            const isEmail = trimmedIdentifier.includes('@');
            const loginPayload = isEmail
                ? { email: trimmedIdentifier, password }
                : { username: trimmedIdentifier, email: trimmedIdentifier, password };

            const response = await authApi.login(loginPayload);

            if (response.ok && response.data) {
                const token = response.data.token || response.data.data?.token;
                const tokenExpireIn = response.data.tokenExpireIn || response.data.data?.tokenExpireIn;

                if (token) {
                    setAuthToken(token, tokenExpireIn, trimmedIdentifier);
                    setSuccessMessage('Login successful! Redirecting...');
                    const destination = location.state?.from?.pathname || '/order';
                    setTimeout(() => {
                        navigate(destination, { replace: true });
                    }, 800);
                } else {
                    setErrorMessage('Login succeeded but token was missing. Please try again.');
                }
            } else {
                const backendMsg = response.data?.message || 'Invalid email or password.';
                setErrorMessage(backendMsg);
            }
        } catch {
            setErrorMessage('Failed to connect to authentication server. Please check your network.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0b0f17] text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#feb600]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <Card className="w-full max-w-md border-slate-800 bg-slate-900/90 shadow-2xl relative z-10 backdrop-blur-md">
                <CardHeader className="text-center pb-6">
                    <div className="flex justify-center mb-3">
                        <Link to="/" title="Back to Home" className="transition-transform hover:scale-105">
                            <img src={logo} alt="Nongki Logo" className="h-8 w-auto object-contain" />
                        </Link>
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm text-slate-400">
                        Sign in to reserve workstations and manage bookings
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        {redirectNotice && !errorMessage && !successMessage && (
                            <div className="flex items-center gap-2.5 rounded-xl border border-[#feb600]/30 bg-[#feb600]/10 px-3.5 py-2.5 text-xs font-medium text-[#feb600]">
                                <Info className="h-4 w-4 shrink-0 text-[#feb600]" />
                                <span>{redirectNotice}</span>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-300">
                                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {successMessage && (
                            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-medium text-emerald-300">
                                <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                                <span>{successMessage}</span>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="identifier">Email or Username</Label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                    id="identifier"
                                    type="text"
                                    placeholder="yourname@domain.com"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="pl-10"
                                    required
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10"
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            size="lg"
                            className="w-full font-bold gap-2 shadow-lg shadow-[#feb600]/20"
                        >
                            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>

                        <div className="text-center text-xs text-slate-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-semibold text-[#feb600] hover:underline">
                                Register now
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 mt-2">
                            <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
                            <span>Protected by JWT & TLS Encryption</span>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
