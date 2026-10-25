import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppHeader from '../Components/AppHeader';
import logo from '../assets/logo.png';
import qrisLogo from '../assets/qrisLogo.png';
import qrCode from '../assets/qrbayar.png';
import gopayLogo from '../assets/gopayLogo.png';
import { usersApi, ordersApi, getAuthToken } from '../services/api';
import { Button } from '../Components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../Components/ui/card';
import { Badge } from '../Components/ui/badge';
import { Separator } from '../Components/ui/separator';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../Components/ui/dialog';
import {
    Calendar,
    Clock,
    Monitor,
    Sparkles,
    ShieldCheck,
    CheckCircle2,
    QrCode,
    Wallet,
    Building2,
    ArrowLeft,
    Copy,
    Check,
    Receipt,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';

export default function Confirm() {
    const navigate = useNavigate();
    const location = useLocation();

    const todayStr = new Date().toISOString().split('T')[0];
    const bookingData = location.state || {
        date: todayStr,
        startTime: 8,
        endTime: 10,
        timeStartStr: '08:00',
        timeEndStr: '10:00',
        kindOfSpace: 'Desk',
        category: 'VIP',
        selectedDesk: ['A1'],
        totalPrice: 60000,
        durationHours: 2,
        pricePerHour: 30000,
    };

    const { date, startTime, endTime, timeStartStr, timeEndStr, kindOfSpace, category, selectedDesk, totalPrice, durationHours, pricePerHour } = bookingData;

    const [userProfile, setUserProfile] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('QRIS');
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 minutes in seconds
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [copiedCode, setCopiedCode] = useState(false);

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyOrders, setHistoryOrders] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    const idempotencyKeyRef = useRef(null);
    if (!idempotencyKeyRef.current) {
        idempotencyKeyRef.current = (typeof crypto !== 'undefined' && crypto.randomUUID)
            ? crypto.randomUUID()
            : 'idemp-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    }

    // Fetch user profile on mount
    useEffect(() => {
        let isMounted = true;
        const fetchUserProfile = async () => {
            const token = getAuthToken();
            if (!token) return;

            try {
                const { ok, data } = await usersApi.getMe();
                if (isMounted && ok && data?.data) {
                    setUserProfile(data.data);
                }
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
            }
        };

        fetchUserProfile();
        return () => {
            isMounted = false;
        };
    }, []);

    // Initial history fetch
    useEffect(() => {
        const fetchInitialHistory = async () => {
            try {
                const { ok, data } = await ordersApi.getMyOrders();
                if (ok && data?.data) {
                    setHistoryOrders(data.data);
                }
            } catch {
                // Non-critical
            }
        };
        fetchInitialHistory();
    }, []);

    // Countdown timer for payment modal
    useEffect(() => {
        if (showPaymentModal && !paymentConfirmed && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [showPaymentModal, paymentConfirmed, timeLeft]);

    const formatTimer = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const handleOpenPayment = () => {
        setErrorMessage('');
        setTimeLeft(10 * 60);
        setShowPaymentModal(true);
    };

    const handleConfirmPayment = async () => {
        setIsProcessing(true);
        setErrorMessage('');

        const orderPayload = {
            date,
            startTime,
            endTime,
            kindOfSpace,
            category,
            deskCode: Array.isArray(selectedDesk) ? selectedDesk[0] : selectedDesk,
            totalPrice,
            paymentMethod,
            idempotencyKey: idempotencyKeyRef.current,
        };

        try {
            const { ok, data, status } = await ordersApi.createOrder(orderPayload);
            if (ok && data?.data) {
                setOrderDetails(data.data);
                setPaymentConfirmed(true);
            } else if (status === 409) {
                setErrorMessage('Selected desk was just booked by another user. Please choose another station.');
                setShowPaymentModal(false);
            } else {
                // Fallback simulation for dev/demo if backend is unreachable
                setOrderDetails({
                    id: 'NKI-' + Math.floor(100000 + Math.random() * 900000),
                    bookingDate: date,
                    timeStart: timeStartStr,
                    timeEnd: timeEndStr,
                    totalPrice,
                    deskCode: Array.isArray(selectedDesk) ? selectedDesk.join(', ') : selectedDesk,
                    status: 'PAID',
                });
                setPaymentConfirmed(true);
            }
        } catch {
            // Local simulation fallback
            setOrderDetails({
                id: 'NKI-' + Math.floor(100000 + Math.random() * 900000),
                bookingDate: date,
                timeStart: timeStartStr,
                timeEnd: timeEndStr,
                totalPrice,
                deskCode: Array.isArray(selectedDesk) ? selectedDesk.join(', ') : selectedDesk,
                status: 'PAID',
            });
            setPaymentConfirmed(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const copyBookingCode = () => {
        navigator.clipboard.writeText(orderDetails?.id || 'NKI-88219');
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2000);
    };

    const toggleHistoryModal = async () => {
        const willOpen = !showHistoryModal;
        setShowHistoryModal(willOpen);
        if (willOpen) {
            setLoadingHistory(true);
            try {
                const { ok, data } = await ordersApi.getMyOrders();
                if (ok && data?.data) {
                    setHistoryOrders(data.data);
                }
            } catch {
                // Non-critical
            } finally {
                setLoadingHistory(false);
            }
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#0b0f17] text-slate-100 flex flex-col">
            <AppHeader
                currentStep={3}
                onOpenHistory={toggleHistoryModal}
                historyCount={historyOrders.length}
            />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1">
                {/* Heading */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Confirm Reservation & Payment
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 mt-1">
                        Verify your booking pass details and complete checkout
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Digital Booking Pass */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                        <Card className="border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden relative">
                            {/* Pass Top Banner */}
                            <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-b border-dashed border-slate-700">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <img src={logo} alt="Nongki" className="h-6 w-auto" />
                                        <span className="text-xs font-bold tracking-widest text-[#feb600] uppercase">
                                            Booking Pass
                                        </span>
                                    </div>
                                    <Badge variant="amber" className="gap-1 text-xs font-bold uppercase">
                                        <Sparkles className="h-3 w-3" />
                                        {category} Tier
                                    </Badge>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                                    <div>
                                        <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Workstation</div>
                                        <div className="text-2xl font-black text-white flex items-center gap-2">
                                            <span>{kindOfSpace}</span>
                                            <span className="text-sm font-bold text-[#feb600] bg-[#feb600]/15 px-2.5 py-0.5 rounded-lg border border-[#feb600]/30">
                                                Desk {Array.isArray(selectedDesk) ? selectedDesk.join(', ') : selectedDesk}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="sm:text-right">
                                        <div className="text-xs text-slate-400 uppercase tracking-wider font-medium">Guest</div>
                                        <div className="text-base font-bold text-slate-200">
                                            {userProfile?.name || localStorage.getItem('userEmail') || 'Valued Member'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pass Details Body */}
                            <CardContent className="p-6 flex flex-col gap-6">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                                        <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase mb-1">
                                            <Calendar className="h-3.5 w-3.5 text-[#feb600]" />
                                            Date
                                        </div>
                                        <div className="text-sm font-bold text-white">{date}</div>
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                                        <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase mb-1">
                                            <Clock className="h-3.5 w-3.5 text-[#feb600]" />
                                            Duration
                                        </div>
                                        <div className="text-sm font-bold text-white">{durationHours || 2} Hours</div>
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                                        <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase mb-1">
                                            <Clock className="h-3.5 w-3.5 text-[#feb600]" />
                                            Time
                                        </div>
                                        <div className="text-sm font-bold text-white">{timeStartStr} - {timeEndStr}</div>
                                    </div>

                                    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5">
                                        <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase mb-1">
                                            <Monitor className="h-3.5 w-3.5 text-[#feb600]" />
                                            Rate/Hour
                                        </div>
                                        <div className="text-sm font-bold text-white">Rp {(pricePerHour || 30000).toLocaleString('id-ID')}</div>
                                    </div>
                                </div>

                                <Separator className="bg-slate-800" />

                                {/* Guarantee & Check-in instructions */}
                                <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-slate-300">
                                    <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-emerald-400">Guaranteed Desk Reservation: </span>
                                        Your workstation is held exclusively for you. Present your order QR or digital receipt upon arrival at our front reception.
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate('/map')}
                                        className="gap-2 text-xs border-slate-700 text-slate-300 hover:text-white"
                                    >
                                        <ArrowLeft className="h-3.5 w-3.5" />
                                        <span>Back to Map</span>
                                    </Button>

                                    <span className="text-xs text-slate-500 font-mono">
                                        Idempotency: {idempotencyKeyRef.current.substring(0, 14)}...
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Payment Options & Checkout Card */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6">
                        <Card className="border-slate-800 bg-slate-900/90 shadow-2xl">
                            <CardHeader className="pb-4 border-b border-slate-800/80">
                                <CardTitle className="text-lg font-bold text-white">Payment Method</CardTitle>
                            </CardHeader>

                            <CardContent className="pt-6 flex flex-col gap-4">
                                {/* Payment Method Selectors */}
                                <div className="space-y-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('QRIS')}
                                        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                                            paymentMethod === 'QRIS'
                                                ? 'border-[#feb600] bg-slate-950/80 ring-1 ring-[#feb600]'
                                                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-12 rounded-lg bg-white/95 flex items-center justify-center p-1">
                                                <img src={qrisLogo} alt="QRIS" className="h-5 w-auto object-contain" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-bold text-white">QRIS Instant</div>
                                                <div className="text-xs text-slate-400">BCA, Mandiri, GoPay, OVO, Dana</div>
                                            </div>
                                        </div>
                                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                            paymentMethod === 'QRIS' ? 'border-[#feb600] bg-[#feb600]' : 'border-slate-600'
                                        }`}>
                                            {paymentMethod === 'QRIS' && <div className="h-1.5 w-1.5 rounded-full bg-[#0f172a]" />}
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('GoPay')}
                                        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                                            paymentMethod === 'GoPay'
                                                ? 'border-[#feb600] bg-slate-950/80 ring-1 ring-[#feb600]'
                                                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-12 rounded-lg bg-white/95 flex items-center justify-center p-1">
                                                <img src={gopayLogo} alt="GoPay" className="h-4 w-auto object-contain" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-bold text-white">GoPay E-Wallet</div>
                                                <div className="text-xs text-slate-400">Direct wallet debit</div>
                                            </div>
                                        </div>
                                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                            paymentMethod === 'GoPay' ? 'border-[#feb600] bg-[#feb600]' : 'border-slate-600'
                                        }`}>
                                            {paymentMethod === 'GoPay' && <div className="h-1.5 w-1.5 rounded-full bg-[#0f172a]" />}
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('Bank Transfer')}
                                        className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all ${
                                            paymentMethod === 'Bank Transfer'
                                                ? 'border-[#feb600] bg-slate-950/80 ring-1 ring-[#feb600]'
                                                : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-12 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                                                <Building2 className="h-5 w-5 text-[#feb600]" />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-bold text-white">Virtual Account</div>
                                                <div className="text-xs text-slate-400">Automatic payment verification</div>
                                            </div>
                                        </div>
                                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                                            paymentMethod === 'Bank Transfer' ? 'border-[#feb600] bg-[#feb600]' : 'border-slate-600'
                                        }`}>
                                            {paymentMethod === 'Bank Transfer' && <div className="h-1.5 w-1.5 rounded-full bg-[#0f172a]" />}
                                        </div>
                                    </button>
                                </div>

                                <div className="my-2 border-t border-dashed border-slate-800" />

                                {/* Total and CTA */}
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total to Pay</div>
                                        <div className="text-[11px] text-slate-500">Fixed rate • No hidden fees</div>
                                    </div>
                                    <div className="text-2xl font-black text-[#feb600]">
                                        Rp {totalPrice.toLocaleString('id-ID')}
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleOpenPayment}
                                    size="lg"
                                    className="w-full mt-2 h-12 text-sm font-bold gap-2 shadow-lg shadow-[#feb600]/20"
                                >
                                    <span>Pay Rp {totalPrice.toLocaleString('id-ID')}</span>
                                    <CheckCircle2 className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Payment Modal using ShadCN Dialog */}
            <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <DialogContent className="max-w-md">
                    {!paymentConfirmed ? (
                        <>
                            <DialogHeader>
                                <div className="flex items-center justify-between">
                                    <DialogTitle className="flex items-center gap-2">
                                        <QrCode className="h-5 w-5 text-[#feb600]" />
                                        <span>Scan to Pay</span>
                                    </DialogTitle>
                                    <Badge variant="amber" className="font-mono text-xs font-bold">
                                        Expires in: {formatTimer(timeLeft)}
                                    </Badge>
                                </div>
                                <DialogDescription>
                                    Scan with any Indonesian e-wallet or banking app supporting QRIS.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col items-center justify-center py-4">
                                <div className="p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center">
                                    <img src={qrCode} alt="Payment QR Code" className="w-56 h-56 object-contain" />
                                    <img src={qrisLogo} alt="QRIS" className="h-5 w-auto mt-2" />
                                </div>

                                <div className="mt-4 text-center">
                                    <div className="text-xs text-slate-400">Total Amount</div>
                                    <div className="text-xl font-black text-[#feb600] mt-0.5">
                                        Rp {totalPrice.toLocaleString('id-ID')}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2">
                                <Button
                                    type="button"
                                    onClick={handleConfirmPayment}
                                    disabled={isProcessing}
                                    size="lg"
                                    className="w-full font-bold gap-2"
                                >
                                    {isProcessing ? 'Verifying payment...' : 'Simulate Payment Success'}
                                    <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="text-xs text-slate-400"
                                >
                                    Cancel & Return
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <DialogHeader>
                                <div className="flex flex-col items-center text-center py-2">
                                    <div className="h-12 w-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                                        <CheckCircle className="h-6 w-6" />
                                    </div>
                                    <DialogTitle className="text-xl font-extrabold text-white">
                                        Payment Successful!
                                    </DialogTitle>
                                    <DialogDescription className="text-xs text-slate-400 mt-1">
                                        Your booking at Nongki Coworking has been confirmed.
                                    </DialogDescription>
                                </div>
                            </DialogHeader>

                            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 space-y-2 text-xs">
                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-slate-400">Booking Code:</span>
                                    <div className="flex items-center gap-1.5 font-mono font-bold text-[#feb600]">
                                        <span>{orderDetails?.id || 'NKI-88219'}</span>
                                        <button onClick={copyBookingCode} className="p-1 hover:text-white">
                                            {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-slate-400">Workstation:</span>
                                    <span className="font-semibold text-white">{kindOfSpace} (Desk {Array.isArray(selectedDesk) ? selectedDesk.join(', ') : selectedDesk})</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-slate-400">Date & Window:</span>
                                    <span className="font-semibold text-white">{date} • {timeStartStr} - {timeEndStr}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-slate-400">Payment Status:</span>
                                    <Badge variant="emerald" className="text-[10px]">PAID (QRIS)</Badge>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                <Button
                                    type="button"
                                    onClick={() => navigate('/order')}
                                    size="lg"
                                    className="flex-1 font-bold"
                                >
                                    Book Another Space
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setShowHistoryModal(true);
                                    }}
                                    size="lg"
                                    className="border-slate-700 text-slate-200"
                                >
                                    View History
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* History Modal using ShadCN Dialog */}
            <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
                <DialogContent className="max-w-xl max-h-[85vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5 text-[#feb600]" />
                            <span>My Booking History</span>
                        </DialogTitle>
                        <DialogDescription>
                            Review all your past and upcoming workspace reservations.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-2">
                        {loadingHistory ? (
                            <div className="text-center py-10 text-sm text-slate-400">
                                Loading your reservations...
                            </div>
                        ) : historyOrders.length === 0 ? (
                            <div className="text-center py-10 text-sm text-slate-400">
                                No previous reservations found.
                            </div>
                        ) : (
                            historyOrders.map((ord, idx) => (
                                <div key={ord.id || idx} className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 flex items-center justify-between">
                                    <div>
                                        <div className="text-xs font-bold text-white flex items-center gap-2">
                                            <span>Order #{ord.id}</span>
                                            <Badge variant={ord.status === 'PAID' ? 'emerald' : 'secondary'} className="text-[10px]">
                                                {ord.status || 'CONFIRMED'}
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-slate-400 mt-1">
                                            {ord.bookingDate || ord.date || todayStr} • {ord.startTime || '08:00'} - {ord.endTime || '10:00'}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-slate-200">
                                            Rp {(ord.totalPrice || ord.price || 0).toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
