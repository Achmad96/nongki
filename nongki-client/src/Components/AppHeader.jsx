import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { History, LogOut, User, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

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
        { num: 1, label: 'Schedule' },
        { num: 2, label: 'Select Desk' },
        { num: 3, label: 'Payment' },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand Logo */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-2 group transition-opacity hover:opacity-90" title="Back to Nongki Home">
                        <img src={logo} alt="Nongki Logo" className="h-7 w-auto object-contain transition-transform group-hover:scale-105" />
                    </Link>
                </div>

                {/* Step Progress Indicator (Hidden on mobile) */}
                <nav className="hidden md:flex items-center gap-3" aria-label="Booking steps">
                    {steps.map((step, idx) => {
                        const isCompleted = currentStep > step.num;
                        const isActive = currentStep === step.num;
                        return (
                            <div key={step.num} className="flex items-center gap-3">
                                <div className={`flex items-center gap-2 text-xs font-semibold transition-colors ${
                                    isActive ? 'text-[#feb600]' : isCompleted ? 'text-emerald-400' : 'text-slate-400'
                                }`}>
                                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-all ${
                                        isActive 
                                            ? 'bg-[#feb600] text-[#0f172a] shadow-[0_0_12px_rgba(254,182,0,0.4)]' 
                                            : isCompleted 
                                            ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400' 
                                            : 'bg-slate-800 border border-slate-700 text-slate-400'
                                    }`}>
                                        {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : step.num}
                                    </span>
                                    <span className="tracking-wide">{step.label}</span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className={`h-[2px] w-8 rounded-full transition-colors ${
                                        currentStep > step.num ? 'bg-emerald-500/60' : 'bg-slate-800'
                                    }`} />
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Header Actions */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={onOpenHistory}
                        className="gap-2 border-slate-700/80 bg-slate-900 text-xs text-slate-200 hover:text-[#feb600]"
                        title="View My Bookings"
                    >
                        <History className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">History</span>
                        {historyCount > 0 && (
                            <Badge variant="amber" className="h-4 px-1.5 text-[10px] font-bold">
                                {historyCount}
                            </Badge>
                        )}
                    </Button>

                    <div className="flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300" title={userEmail}>
                        <User className="h-3.5 w-3.5 text-[#feb600]" />
                        <span className="hidden sm:inline max-w-[120px] truncate">{displayName}</span>
                    </div>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                        className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        title="Log Out"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
