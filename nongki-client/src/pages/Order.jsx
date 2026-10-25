import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../Components/AppHeader';
import { spacesApi, ordersApi } from '../services/api';
import { Button } from '../Components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../Components/ui/card';
import { Badge } from '../Components/ui/badge';
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
    Users,
    DoorClosed,
    Sparkles,
    Wifi,
    Coffee,
    Zap,
    Wind,
    ArrowRight,
    Check,
    Receipt,
    AlertCircle,
} from 'lucide-react';

const timeOptions = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00'
];

export default function Order() {
    const navigate = useNavigate();
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    const [date, setDate] = useState(todayStr);
    const [timeStart, setTimeStart] = useState('08:00');
    const [timeEnd, setTimeEnd] = useState('10:00');
    const [kindOfSpace, setKindOfSpace] = useState('Desk');
    const [category, setCategory] = useState('VIP');
    const [spaces, setSpaces] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyOrders, setHistoryOrders] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Fetch spaces from backend
    useEffect(() => {
        let isMounted = true;
        const fetchSpaces = async () => {
            try {
                const { ok, data } = await spacesApi.getAll();
                if (isMounted && ok && data?.data) {
                    setSpaces(data.data);
                }
            } catch (err) {
                console.error('Failed to load spaces from backend:', err);
            }
        };
        fetchSpaces();
        return () => {
            isMounted = false;
        };
    }, []);

    // Initial fetch of history count
    useEffect(() => {
        const fetchInitialHistory = async () => {
            try {
                const { ok, data } = await ordersApi.getMyOrders();
                if (ok && data?.data) {
                    setHistoryOrders(data.data);
                }
            } catch {
                // Non-critical background count
            }
        };
        fetchInitialHistory();
    }, []);

    // Calculate price based on selected space type & category
    const startHour = parseInt(timeStart.split(':')[0], 10);
    const endHour = parseInt(timeEnd.split(':')[0], 10);
    const durationHours = Math.max(1, endHour - startHour);

    const priceMap = {
        'Reguler': { 'Desk': 15000, 'Group Desk': 45000, 'Meeting Room': 100000 },
        'VIP': { 'Desk': 30000, 'Group Desk': 80000, 'Meeting Room': 180000 },
    };

    const resolvedCategory = category === 'nonVIP' ? 'Reguler' : category;

    let pricePerHour = 30000;
    const matchingSpace = spaces.find(s => 
        (s.type === kindOfSpace || s.jenis === kindOfSpace) &&
        (s.category?.name === resolvedCategory || s.category?.nama === resolvedCategory)
    );

    if (matchingSpace && matchingSpace.price) {
        pricePerHour = matchingSpace.price;
    } else if (priceMap[resolvedCategory] && priceMap[resolvedCategory][kindOfSpace]) {
        pricePerHour = priceMap[resolvedCategory][kindOfSpace];
    }

    const estimatedTotalPrice = pricePerHour * durationHours;

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

    const handleCheck = () => {
        setErrorMessage('');
        if (!date) {
            setErrorMessage('Please select a booking date.');
            return;
        }
        if (startHour >= endHour) {
            setErrorMessage('Time End must be later than Time Start.');
            return;
        }

        navigate('/map', {
            state: {
                date,
                startTime: startHour,
                endTime: endHour,
                timeStartStr: timeStart,
                timeEndStr: timeEnd,
                kindOfSpace,
                category: resolvedCategory,
                pricePerHour,
                durationHours,
                estimatedTotalPrice,
            }
        });
    };

    const spaceOptions = [
        {
            id: 'Desk',
            title: 'Individual Desk',
            description: 'Quiet zone workstation with ergonomic chair & power outlet',
            icon: Monitor,
            regulerPrice: 'Rp 15.000',
            vipPrice: 'Rp 30.000',
        },
        {
            id: 'Group Desk',
            title: 'Group Desk',
            description: 'Collaborative cluster designed for team productivity',
            icon: Users,
            regulerPrice: 'Rp 45.000',
            vipPrice: 'Rp 80.000',
        },
        {
            id: 'Meeting Room',
            title: 'Private Meeting Room',
            description: 'Sound-insulated room with whiteboard & presentation display',
            icon: DoorClosed,
            regulerPrice: 'Rp 100.000',
            vipPrice: 'Rp 180.000',
        },
    ];

    return (
        <div className="min-h-screen w-full bg-[#0b0f17] text-slate-100 flex flex-col">
            <AppHeader
                currentStep={1}
                onOpenHistory={toggleHistoryModal}
                historyCount={historyOrders.length}
            />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 flex-1">
                {/* Page Heading */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                        Book Your Workspace
                    </h1>
                    <p className="text-sm sm:text-base text-slate-400 mt-1">
                        Customize your date, duration, and ideal workstation tier
                    </p>
                </div>

                {errorMessage && (
                    <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300">
                        <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* Main 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Form Controls */}
                    <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                        {/* Section 1: Date & Schedule */}
                        <Card className="border-slate-800/80 bg-slate-900/70">
                            <CardHeader className="pb-4 border-b border-slate-800/60">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#feb600] text-xs font-bold text-[#0f172a]">
                                        1
                                    </div>
                                    <div>
                                        <CardTitle className="text-base sm:text-lg">Date & Schedule</CardTitle>
                                        <CardDescription className="text-xs sm:text-sm">Pick your reservation date and duration</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6 flex flex-col gap-5">
                                {/* Date Input + Quick Presets */}
                                <div>
                                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                                        <Calendar className="h-3.5 w-3.5 text-[#feb600]" />
                                        Reservation Date
                                    </label>
                                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                                        <input
                                            type="date"
                                            value={date}
                                            min={todayStr}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="h-11 flex-1 rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 text-sm text-slate-100 transition-colors focus:outline-none focus:border-[#feb600] focus:ring-1 focus:ring-[#feb600]"
                                        />
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant={date === todayStr ? 'default' : 'secondary'}
                                                size="sm"
                                                onClick={() => setDate(todayStr)}
                                                className="text-xs h-11 px-4"
                                            >
                                                Today
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={date === tomorrowStr ? 'default' : 'secondary'}
                                                size="sm"
                                                onClick={() => setDate(tomorrowStr)}
                                                className="text-xs h-11 px-4"
                                            >
                                                Tomorrow
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Time Window */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                                    <div>
                                        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider mb-2">
                                            <Clock className="h-3.5 w-3.5 text-[#feb600]" />
                                            Start Time
                                        </label>
                                        <select
                                            value={timeStart}
                                            onChange={(e) => setTimeStart(e.target.value)}
                                            className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 text-sm text-slate-100 transition-colors focus:outline-none focus:border-[#feb600] focus:ring-1 focus:ring-[#feb600]"
                                        >
                                            {timeOptions.slice(0, -1).map((t) => (
                                                <option key={t} value={t} className="bg-slate-900 text-white">
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                                                <Clock className="h-3.5 w-3.5 text-[#feb600]" />
                                                End Time
                                            </label>
                                            <Badge variant="amber" className="text-[11px] py-0 px-2 font-bold">
                                                {durationHours} {durationHours === 1 ? 'hour' : 'hours'}
                                            </Badge>
                                        </div>
                                        <select
                                            value={timeEnd}
                                            onChange={(e) => setTimeEnd(e.target.value)}
                                            className="h-11 w-full rounded-xl border border-slate-700/80 bg-slate-950/70 px-4 text-sm text-slate-100 transition-colors focus:outline-none focus:border-[#feb600] focus:ring-1 focus:ring-[#feb600]"
                                        >
                                            {timeOptions.filter(t => parseInt(t.split(':')[0], 10) > startHour).map((t) => (
                                                <option key={t} value={t} className="bg-slate-900 text-white">
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Section 2: Space Type & Tier */}
                        <Card className="border-slate-800/80 bg-slate-900/70">
                            <CardHeader className="pb-4 border-b border-slate-800/60">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#feb600] text-xs font-bold text-[#0f172a]">
                                        2
                                    </div>
                                    <div>
                                        <CardTitle className="text-base sm:text-lg">Space Type & Tier</CardTitle>
                                        <CardDescription className="text-xs sm:text-sm">Choose the workstation style that matches your workflow</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-6 flex flex-col gap-4">
                                {/* Space Type Cards */}
                                <div className="grid grid-cols-1 gap-3">
                                    {spaceOptions.map((opt) => {
                                        const Icon = opt.icon;
                                        const isSelected = kindOfSpace === opt.id;
                                        return (
                                            <div
                                                key={opt.id}
                                                onClick={() => setKindOfSpace(opt.id)}
                                                className={`group flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                                                    isSelected
                                                        ? 'border-[#feb600] bg-slate-950/90 shadow-[0_0_15px_rgba(254,182,0,0.1)] ring-1 ring-[#feb600]'
                                                        : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/60'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3.5">
                                                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
                                                        isSelected ? 'bg-[#feb600] text-[#0f172a]' : 'bg-slate-800 text-slate-300 group-hover:text-white'
                                                    }`}>
                                                        <Icon className="h-5 w-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                                            {opt.title}
                                                            {isSelected && (
                                                                <span className="flex h-2 w-2 rounded-full bg-[#feb600] animate-pulse" />
                                                            )}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                                            {opt.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="text-right hidden sm:block">
                                                        <div className="text-xs text-slate-400">From</div>
                                                        <div className="text-sm font-bold text-slate-200">
                                                            {resolvedCategory === 'VIP' ? opt.vipPrice : opt.regulerPrice}
                                                            <span className="text-[10px] text-slate-400 font-normal">/hr</span>
                                                        </div>
                                                    </div>

                                                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all ${
                                                        isSelected
                                                            ? 'border-[#feb600] bg-[#feb600]'
                                                            : 'border-slate-600 bg-transparent'
                                                    }`}>
                                                        {isSelected && <div className="h-2 w-2 rounded-full bg-[#0f172a]" />}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Tier Selection Switch */}
                                <div className="mt-2 pt-4 border-t border-slate-800/80">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                                            Tier Selection
                                        </label>
                                        <Badge variant={resolvedCategory === 'VIP' ? 'amber' : 'secondary'} className="text-[11px]">
                                            {resolvedCategory === 'VIP' ? 'VIP Privileges Included' : 'Standard Workspace'}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setCategory('Reguler')}
                                            className={`p-3.5 rounded-xl border text-left transition-all ${
                                                resolvedCategory === 'Reguler'
                                                    ? 'border-[#feb600] bg-slate-950/80 ring-1 ring-[#feb600]'
                                                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-white">Reguler</span>
                                                {resolvedCategory === 'Reguler' && <Check className="h-4 w-4 text-[#feb600]" />}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">High-speed WiFi & full AC</p>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setCategory('VIP')}
                                            className={`p-3.5 rounded-xl border text-left transition-all ${
                                                resolvedCategory === 'VIP'
                                                    ? 'border-[#feb600] bg-slate-950/80 ring-1 ring-[#feb600]'
                                                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-bold text-[#feb600] flex items-center gap-1.5">
                                                    <Sparkles className="h-3.5 w-3.5" /> VIP Experience
                                                </span>
                                                {resolvedCategory === 'VIP' && <Check className="h-4 w-4 text-[#feb600]" />}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">Free-flow artisan coffee & tea + VIP lounge</p>
                                        </button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Sticky Booking Summary */}
                    <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
                        <Card className="border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl">
                            <CardHeader className="pb-4 border-b border-slate-800/80">
                                <CardTitle className="text-lg font-bold text-white flex items-center justify-between">
                                    <span>Booking Summary</span>
                                    <Badge variant="amber" className="text-xs font-bold">
                                        {resolvedCategory}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="pt-5 flex flex-col gap-4 text-sm">
                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-slate-400">Space Type</span>
                                    <span className="font-semibold text-white">{kindOfSpace}</span>
                                </div>

                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-slate-400">Reservation Date</span>
                                    <span className="font-semibold text-white">{date}</span>
                                </div>

                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-slate-400">Time Window</span>
                                    <span className="font-semibold text-white">{timeStart} - {timeEnd} ({durationHours} hrs)</span>
                                </div>

                                <div className="flex justify-between items-center text-slate-300">
                                    <span className="text-slate-400">Rate / Hour</span>
                                    <span className="font-semibold text-white">Rp {pricePerHour.toLocaleString('id-ID')}</span>
                                </div>

                                <div className="my-2 border-t border-dashed border-slate-800" />

                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Estimated Total</div>
                                        <div className="text-[11px] text-slate-500">Includes all perks & tax</div>
                                    </div>
                                    <div className="text-2xl font-extrabold text-[#feb600]">
                                        Rp {estimatedTotalPrice.toLocaleString('id-ID')}
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    onClick={handleCheck}
                                    size="lg"
                                    className="w-full mt-3 h-12 text-sm font-bold gap-2 shadow-lg shadow-[#feb600]/20"
                                >
                                    <span>Choose Desks on Floorplan</span>
                                    <ArrowRight className="h-4 w-4" />
                                </Button>

                                {/* Included Amenities */}
                                <div className="mt-4 pt-4 border-t border-slate-800/80">
                                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                                        Included Amenities
                                    </h5>
                                    <ul className="space-y-2 text-xs text-slate-300">
                                        <li className="flex items-center gap-2">
                                            <Wifi className="h-3.5 w-3.5 text-[#feb600]" />
                                            <span>High-Speed WiFi ({resolvedCategory === 'VIP' ? '100 Mbps' : '50 Mbps'})</span>
                                        </li>
                                        {resolvedCategory === 'VIP' && (
                                            <li className="flex items-center gap-2">
                                                <Coffee className="h-3.5 w-3.5 text-[#feb600]" />
                                                <span>Free Flow Artisan Coffee & Tea</span>
                                            </li>
                                        )}
                                        <li className="flex items-center gap-2">
                                            <Wind className="h-3.5 w-3.5 text-[#feb600]" />
                                            <span>Full Air Conditioning Comfort</span>
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <Zap className="h-3.5 w-3.5 text-[#feb600]" />
                                            <span>Dedicated Power Outlet at Each Station</span>
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

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
                                        {ord.orderDetail?.spaceDetail?.deskNumber && (
                                            <div className="text-[11px] text-[#feb600] mt-0.5">
                                                Desk: {ord.orderDetail.spaceDetail.deskNumber}
                                            </div>
                                        )}
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
