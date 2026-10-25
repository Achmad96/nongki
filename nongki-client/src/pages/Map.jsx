import { useState, useEffect } from 'react';
import AppHeader from '../Components/AppHeader';
import compas from '../assets/compas.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { spacesApi, ordersApi } from '../services/api';
import { Button } from '../Components/ui/button';
import { Card } from '../Components/ui/card';
import { Badge } from '../Components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '../Components/ui/dialog';
import {
    ArrowLeft,
    ArrowRight,
    Calendar,
    Clock,
    Sparkles,
    Check,
    Receipt,
    ZoomIn,
    ZoomOut,
    RotateCcw,
    Layers,
    AlertCircle,
} from 'lucide-react';

const desks = [
    { id: 'A1', top: 20, left: 20, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'A2', top: 20, left: 130, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'A3', top: 20, left: 240, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'A4', top: 20, left: 350, vertical: false, type: 'Desk', category: 'Reguler' },

    { id: 'B1', top: 100, left: 20, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'B2', top: 100, left: 130, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'B3', top: 100, left: 240, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'B4', top: 100, left: 350, vertical: false, type: 'Desk', category: 'Reguler' },

    { id: 'C1', top: 45, left: 530, vertical: false, type: 'Desk', category: 'VIP' },
    { id: 'C2', top: 45, left: 610, vertical: false, type: 'Desk', category: 'VIP' },
    { id: 'C3', top: 85, left: 530, vertical: false, type: 'Desk', category: 'VIP' },
    { id: 'C4', top: 85, left: 610, vertical: false, type: 'Desk', category: 'VIP' },

    { id: 'D1', top: 45, left: 720, vertical: false, type: 'Desk', category: 'VIP' },
    { id: 'D2', top: 45, left: 800, vertical: false, type: 'Desk', category: 'VIP' },
    { id: 'D3', top: 85, left: 720, vertical: false, type: 'Desk', category: 'VIP' },
    { id: 'D4', top: 85, left: 800, vertical: false, type: 'Desk', category: 'VIP' },

    { id: 'E1', top: 200, left: 170, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'E2', top: 200, left: 250, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'E3', top: 200, left: 330, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'E4', top: 240, left: 170, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'E5', top: 240, left: 250, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'E6', top: 240, left: 330, vertical: false, type: 'Group Desk', category: 'Reguler' },

    { id: 'F1', top: 320, left: 170, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'F2', top: 320, left: 250, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'F3', top: 320, left: 330, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'F4', top: 360, left: 170, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'F5', top: 360, left: 250, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'F6', top: 360, left: 330, vertical: false, type: 'Group Desk', category: 'Reguler' },

    { id: 'G1', top: 470, left: 20, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'G2', top: 470, left: 100, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'G3', top: 510, left: 20, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'G4', top: 510, left: 100, vertical: false, type: 'Desk', category: 'Reguler' },

    { id: 'H1', top: 570, left: 20, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'H2', top: 570, left: 100, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'H3', top: 610, left: 20, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'H4', top: 610, left: 100, vertical: false, type: 'Desk', category: 'Reguler' },

    { id: 'M1', top: 220, left: 540, vertical: true, type: 'Meeting Room', category: 'Reguler' },
    { id: 'M2', top: 380, left: 540, vertical: true, type: 'Meeting Room', category: 'VIP' },
    { id: 'M3', top: 540, left: 540, vertical: true, type: 'Meeting Room', category: 'VIP' },
];

export default function Map() {
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
        pricePerHour: 30000,
        durationHours: 2,
        estimatedTotalPrice: 60000,
    };

    const { date, startTime, endTime, timeStartStr, timeEndStr, kindOfSpace, category, pricePerHour, durationHours, estimatedTotalPrice } = bookingData;

    const [selectedDesks, setSelectedDesks] = useState([]);
    const [bookedDesks, setBookedDesks] = useState([]);
    const [zoomScale, setZoomScale] = useState(1);
    const [selectionError, setSelectionError] = useState('');

    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyOrders, setHistoryOrders] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Fetch occupied / conflicting desks from backend
    useEffect(() => {
        let isMounted = true;
        const fetchBooked = async () => {
            try {
                const { ok, data } = await spacesApi.getSpaces({
                    date,
                    startTime,
                    endTime,
                });
                if (isMounted && ok && Array.isArray(data?.data)) {
                    const unavailable = data.data
                        .filter(s => s.status === 'UNAVAILABLE' || s.status === 'BOOKED')
                        .map(s => s.code || s.deskNumber || s.nama);
                    setBookedDesks(unavailable);
                }
            } catch {
                // Non-critical fallback
            }
        };
        fetchBooked();
        return () => {
            isMounted = false;
        };
    }, [date, startTime, endTime]);

    // Initial fetch of history
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

    const toggleDeskSelection = (deskId) => {
        setSelectionError('');
        if (bookedDesks.includes(deskId)) {
            setSelectionError(`Desk ${deskId} is already reserved for this time window.`);
            return;
        }

        setSelectedDesks((prev) => {
            if (prev.includes(deskId)) {
                return prev.filter(id => id !== deskId);
            }
            // For single selection or multi: default allows 1 desk for simple checkout
            return [deskId];
        });
    };

    const handleNext = () => {
        if (selectedDesks.length === 0) {
            setSelectionError('Please choose a desk on the floorplan to proceed.');
            return;
        }

        const calculatedTotalPrice = estimatedTotalPrice * (selectedDesks.length || 1);

        navigate('/confirm', {
            state: {
                date,
                startTime,
                endTime,
                timeStartStr,
                timeEndStr,
                kindOfSpace,
                category,
                selectedDesk: selectedDesks,
                pricePerHour,
                durationHours,
                totalPrice: calculatedTotalPrice,
            }
        });
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
        <div className="min-h-screen w-full bg-[#0b0f17] text-slate-100 flex flex-col pb-28">
            <AppHeader
                currentStep={2}
                onOpenHistory={toggleHistoryModal}
                historyCount={historyOrders.length}
            />

            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1">
                {/* Context Bar */}
                <Card className="mb-6 border-slate-800 bg-slate-900/80 p-4 sm:p-5 shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-slate-300">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-[#feb600]" />
                                <span className="font-semibold text-white">{date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-[#feb600]" />
                                <span className="font-semibold text-white">{timeStartStr} - {timeEndStr}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Layers className="h-4 w-4 text-[#feb600]" />
                                <span className="font-semibold text-white">{kindOfSpace}</span>
                                <Badge variant="amber" className="text-[10px] py-0 px-2 uppercase font-bold">
                                    {category}
                                </Badge>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-400">
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-sm bg-slate-800 border border-slate-700" />
                                <span>Available</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-sm bg-[#feb600] shadow-[0_0_6px_rgba(254,182,0,0.6)]" />
                                <span className="text-[#feb600] font-semibold">Selected</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-sm bg-slate-800 border border-dashed border-slate-600 opacity-60" />
                                <span>Occupied</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-sm border-2 border-[#feb600] bg-transparent" />
                                <span>Matched</span>
                            </div>
                        </div>
                    </div>
                </Card>

                {selectionError && (
                    <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs sm:text-sm font-medium text-red-300">
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                        <span>{selectionError}</span>
                    </div>
                )}

                {/* Blueprint Viewport & Controls */}
                <div className="relative rounded-2xl border border-slate-800 bg-slate-950/80 p-4 sm:p-6 shadow-2xl overflow-x-auto">
                    {/* Zoom / Reset Tool Buttons */}
                    <div className="absolute right-6 top-6 z-20 flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/90 p-1 backdrop-blur-md">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setZoomScale(z => Math.min(1.4, z + 0.1))}
                            className="h-8 w-8 text-slate-300 hover:text-white"
                            title="Zoom In"
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setZoomScale(z => Math.max(0.7, z - 0.1))}
                            className="h-8 w-8 text-slate-300 hover:text-white"
                            title="Zoom Out"
                        >
                            <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setZoomScale(1)}
                            className="h-8 w-8 text-slate-300 hover:text-white"
                            title="Reset Zoom"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Canvas Center Wrapper */}
                    <div className="flex justify-center items-center py-6 min-w-[920px]">
                        <div
                            style={{
                                transform: `scale(${zoomScale})`,
                                transformOrigin: 'center center',
                                transition: 'transform 0.2s ease-out',
                            }}
                            className="relative w-[900px] h-[800px] rounded-xl border border-slate-800/80 bg-[#090d16] shadow-inner select-none"
                        >
                            {/* Grid Texture Background */}
                            <div 
                                className="absolute inset-0 rounded-xl opacity-20 pointer-events-none"
                                style={{
                                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
                                    backgroundSize: '24px 24px',
                                }}
                            />

                            {/* Compass Rose */}
                            <img
                                src={compas}
                                alt="Compass"
                                className="absolute bottom-6 right-6 w-16 h-16 opacity-30 pointer-events-none select-none"
                            />

                            {/* Zone Label Banners */}
                            <div className="absolute top-4 left-6 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Zone A • Quiet Individual Desks
                            </div>
                            <div className="absolute top-4 right-20 text-[10px] font-bold tracking-widest text-[#feb600]/60 uppercase">
                                Zone B • VIP Premium Workstations
                            </div>
                            <div className="absolute top-[180px] left-6 text-[10px] font-bold tracking-widest text-slate-500 uppercase">
                                Zone C • Team Collaboration Clusters
                            </div>
                            <div className="absolute top-[200px] right-20 text-[10px] font-bold tracking-widest text-[#feb600]/60 uppercase">
                                Zone D • Private Conference Rooms
                            </div>

                            {/* Architectural Doors */}
                            <div className="absolute bottom-0 left-[420px] px-3 py-1 bg-slate-800 text-[10px] font-bold text-slate-300 rounded-t-md border-t border-x border-slate-700">
                                Main Entrance
                            </div>
                            <div className="absolute top-0 left-[420px] px-3 py-1 bg-slate-800 text-[10px] font-bold text-slate-300 rounded-b-md border-b border-x border-slate-700">
                                Emergency Exit
                            </div>

                            {/* Render Desks */}
                            {desks.map((d) => {
                                const isSelected = selectedDesks.includes(d.id);
                                const isBooked = bookedDesks.includes(d.id);
                                const isRecommended = d.type === kindOfSpace && d.category === category;

                                const isMeeting = d.type === 'Meeting Room';
                                const width = isMeeting ? 140 : 64;
                                const height = isMeeting ? 120 : 36;

                                return (
                                    <div
                                        key={d.id}
                                        onClick={() => toggleDeskSelection(d.id)}
                                        style={{
                                            position: 'absolute',
                                            top: `${d.top}px`,
                                            left: `${d.left}px`,
                                            width: `${width}px`,
                                            height: `${height}px`,
                                        }}
                                        className={`group rounded-lg flex items-center justify-center transition-all cursor-pointer font-bold text-xs select-none ${
                                            isBooked
                                                ? 'bg-slate-900 border border-dashed border-slate-700 text-slate-600 cursor-not-allowed opacity-50'
                                                : isSelected
                                                ? 'bg-[#feb600] text-[#0f172a] shadow-[0_0_16px_rgba(254,182,0,0.7)] scale-105 z-10 font-extrabold ring-2 ring-white/50'
                                                : isRecommended
                                                ? 'bg-slate-900/90 border-2 border-[#feb600]/80 text-[#feb600] hover:bg-[#feb600]/20 hover:scale-105 z-0 shadow-md shadow-[#feb600]/10'
                                                : 'bg-slate-900/90 border border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800 hover:text-white z-0'
                                        }`}
                                        title={`Desk ${d.id} (${d.type} - ${d.category})${isBooked ? ' [Reserved]' : ''}`}
                                    >
                                        <div className="flex flex-col items-center justify-center">
                                            <span className={isSelected ? 'text-[#0f172a]' : ''}>{d.id}</span>
                                            {isMeeting && (
                                                <span className={`text-[9px] font-normal tracking-tight ${isSelected ? 'text-[#0f172a]' : 'text-slate-400'}`}>
                                                    {d.category} Suite
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </main>

            {/* Sticky Bottom Summary & Navigation Dock */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 py-3.5 shadow-2xl">
                <div className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-xs sm:text-sm">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => navigate('/order')}
                            className="gap-2 border-slate-700 text-slate-300 hover:text-white"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            <span>Change Schedule</span>
                        </Button>

                        <div className="flex items-center gap-2">
                            <span className="text-slate-400">Selected Station:</span>
                            {selectedDesks.length > 0 ? (
                                <Badge variant="amber" className="font-bold text-xs">
                                    {selectedDesks.join(', ')}
                                </Badge>
                            ) : (
                                <span className="text-slate-500 italic">None selected</span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                            <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Price</div>
                            <div className="text-lg sm:text-xl font-extrabold text-[#feb600]">
                                Rp {((estimatedTotalPrice * (selectedDesks.length || 1))).toLocaleString('id-ID')}
                            </div>
                        </div>

                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={selectedDesks.length === 0}
                            size="lg"
                            className="gap-2 font-bold px-6 shadow-md shadow-[#feb600]/20"
                        >
                            <span>Proceed to Payment</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

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
