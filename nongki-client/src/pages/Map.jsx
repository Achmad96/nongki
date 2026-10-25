import { useState, useEffect } from 'react';
import '../Styles/Map.css';
import AppHeader from '../Components/AppHeader';
import compas from '../assets/compas.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { spacesApi, ordersApi } from '../services/api';
import { 
    FaArrowLeft, 
    FaArrowRight, 
    FaCalendarAlt, 
    FaClock, 
    FaLayerGroup, 
    FaCrown, 
    FaCheck, 
    FaReceipt, 
    FaTimes 
} from 'react-icons/fa';

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

    { id: 'F1', top: 340, left: 170, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'F2', top: 340, left: 250, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'F3', top: 340, left: 330, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'F4', top: 380, left: 170, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'F5', top: 380, left: 250, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'F6', top: 380, left: 330, vertical: false, type: 'Group Desk', category: 'VIP' },

    { id: 'G1', top: 480, left: 170, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'G2', top: 480, left: 250, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'G3', top: 480, left: 330, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'G4', top: 520, left: 170, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'G5', top: 520, left: 250, vertical: false, type: 'Group Desk', category: 'Reguler' },
    { id: 'G6', top: 520, left: 330, vertical: false, type: 'Group Desk', category: 'Reguler' },

    { id: 'H1', top: 200, left: 550, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'H2', top: 200, left: 630, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'H3', top: 200, left: 710, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'H4', top: 240, left: 550, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'H5', top: 240, left: 630, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'H6', top: 240, left: 710, vertical: false, type: 'Group Desk', category: 'VIP' },

    { id: 'I1', top: 340, left: 550, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'I2', top: 340, left: 630, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'I3', top: 340, left: 710, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'I4', top: 380, left: 550, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'I5', top: 380, left: 630, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'I6', top: 380, left: 710, vertical: false, type: 'Group Desk', category: 'VIP' },

    { id: 'J1', top: 480, left: 550, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'J2', top: 480, left: 630, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'J3', top: 480, left: 710, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'J4', top: 520, left: 550, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'J5', top: 520, left: 630, vertical: false, type: 'Group Desk', category: 'VIP' },
    { id: 'J6', top: 520, left: 710, vertical: false, type: 'Group Desk', category: 'VIP' },

    { id: 'K1', top: 200, left: 20, vertical: true, type: 'Desk', category: 'Reguler' },
    { id: 'K2', top: 310, left: 20, vertical: true, type: 'Desk', category: 'Reguler' },
    { id: 'K3', top: 420, left: 20, vertical: true, type: 'Desk', category: 'Reguler' },
    { id: 'K4', top: 530, left: 20, vertical: true, type: 'Desk', category: 'Reguler' },
    { id: 'K5', top: 200, left: 850, vertical: true, type: 'Desk', category: 'VIP' },
    { id: 'K6', top: 310, left: 850, vertical: true, type: 'Desk', category: 'VIP' },
    { id: 'K7', top: 420, left: 850, vertical: true, type: 'Desk', category: 'VIP' },
    { id: 'K8', top: 530, left: 850, vertical: true, type: 'Desk', category: 'VIP' },

    { id: 'L1', top: 640, left: 20, vertical: true, type: 'Desk', category: 'Reguler' },
    { id: 'L2', top: 740, left: 100, vertical: false, type: 'Desk', category: 'Reguler' },
    { id: 'L3', top: 740, left: 240, vertical: false, type: 'Desk', category: 'Reguler' },
];

function MapVip() {
    const navigate = useNavigate();
    const location = useLocation();

    const defaultDate = new Date().toISOString().split('T')[0];
    const bookingState = location.state || {
        date: defaultDate,
        startTime: 8,
        endTime: 10,
        timeStartStr: '08:00',
        timeEndStr: '10:00',
        kindOfSpace: 'Desk',
        category: 'VIP',
        pricePerHour: 30000,
        durationHours: 2,
    };

    const { date, startTime, endTime, timeStartStr, timeEndStr, kindOfSpace, category, pricePerHour, durationHours } = bookingState;

    const [selectedDesk, setSelectedDesks] = useState([]);
    const [bookedDesks, setBookedDesks] = useState([]);
    const [loadingBooked, setLoadingBooked] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyOrders, setHistoryOrders] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchBookedDesks = async () => {
            setLoadingBooked(true);
            try {
                const { ok, data } = await spacesApi.getBookedDesks(date, startTime, endTime);
                if (isMounted && ok && data?.data && Array.isArray(data.data)) {
                    setBookedDesks(data.data);
                }
            } catch (err) {
                console.error('Failed to fetch booked desks:', err);
            } finally {
                if (isMounted) setLoadingBooked(false);
            }
        };

        if (date && startTime != null && endTime != null) {
            fetchBookedDesks();
        }

        return () => {
            isMounted = false;
        };
    }, [date, startTime, endTime]);

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
            } catch (err) {
                console.error('Failed to fetch orders history:', err);
            } finally {
                setLoadingHistory(false);
            }
        }
    };

    const toggleSelect = (deskId) => {
        if (bookedDesks.includes(deskId)) {
            return;
        }

        setSelectedDesks(prevSelectedDesks => {
            return prevSelectedDesks.includes(deskId)
                ? prevSelectedDesks.filter(id => id !== deskId)
                : [...prevSelectedDesks, deskId];
        });
    };

    const calculatedTotal = selectedDesk.length * (pricePerHour || 30000) * (durationHours || 2);

    const handleNext = () => {
        if (selectedDesk.length === 0) return;
        navigate('/confirm', {
            state: {
                ...bookingState,
                selectedDesk,
                totalPrice: calculatedTotal,
            }
        });
    };

    return (
        <div className="map-page-layout">
            <AppHeader 
                currentStep={2} 
                onOpenHistory={toggleHistoryModal} 
                historyCount={historyOrders.length} 
            />

            <main className="map-main-wrapper">
                {/* Header & Filter Context Bar */}
                <div className="map-context-card">
                    <div className="context-meta-group">
                        <div className="context-item">
                            <FaCalendarAlt className="meta-icon" />
                            <span>{date}</span>
                        </div>
                        <div className="context-item">
                            <FaClock className="meta-icon" />
                            <span>{timeStartStr} – {timeEndStr} ({durationHours} hrs)</span>
                        </div>
                        <div className="context-item">
                            <FaLayerGroup className="meta-icon" />
                            <span>{kindOfSpace}</span>
                        </div>
                        <div className="context-item">
                            <FaCrown className="meta-icon text-amber" />
                            <span className="tier-tag">{category}</span>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="floorplan-legend">
                        <div className="legend-chip">
                            <span className="dot dot-avail" /> Available
                        </div>
                        <div className="legend-chip">
                            <span className="dot dot-selected" /> Selected
                        </div>
                        <div className="legend-chip">
                            <span className="dot dot-booked" /> Booked
                        </div>
                        <div className="legend-chip">
                            <span className="dot dot-recommended" /> Recommended Tier
                        </div>
                    </div>
                </div>

                {loadingBooked && (
                    <div className="loading-badge-row">
                        <span className="btn-spinner" /> Checking real-time desk availability...
                    </div>
                )}

                {/* Architectural Blueprint Viewport */}
                <div className="blueprint-viewport-frame">
                    <div className="blueprint-canvas">
                        {/* Zone Markers */}
                        <div className="zone-label-box" style={{ top: 22, left: 30 }}>
                            QUIET FOCUS PODS (REGULER)
                        </div>
                        <div className="zone-label-box" style={{ top: 22, left: 540 }}>
                            VIP PRIVATE PODS
                        </div>
                        <div className="zone-label-box" style={{ top: 175, left: 180 }}>
                            TEAM COLLAB TABLE A
                        </div>
                        <div className="zone-label-box" style={{ top: 175, left: 560 }}>
                            EXECUTIVE VIP CLUSTER
                        </div>
                        <div className="zone-label-box" style={{ top: 455, left: 180 }}>
                            TEAM COLLAB TABLE B
                        </div>
                        <div className="zone-label-box" style={{ top: 455, left: 560 }}>
                            VIP COLLAB SUITE
                        </div>
                        <div className="zone-label-box" style={{ top: 715, left: 110 }}>
                            INDIVIDUAL STANDING / WINDOW DESKS
                        </div>

                        {/* Desks */}
                        {desks.map((desk) => {
                            const isBooked = bookedDesks.includes(desk.id);
                            const isSelected = selectedDesk.includes(desk.id);
                            const isMatching = desk.type === kindOfSpace && desk.category === category;

                            let deskClasses = 'workstation-seat';
                            if (isBooked) deskClasses += ' is-booked';
                            else if (isSelected) deskClasses += ' is-selected';
                            else if (isMatching) deskClasses += ' is-matching';

                            return (
                                <div
                                    key={desk.id}
                                    className={deskClasses}
                                    onClick={() => toggleSelect(desk.id)}
                                    title={
                                        isBooked 
                                            ? `Desk ${desk.id} is already booked for this time` 
                                            : `Desk ${desk.id} (${desk.type} • ${desk.category}) - Click to select`
                                    }
                                    style={{
                                        top: desk.top,
                                        left: desk.left,
                                        width: desk.vertical ? 32 : 72,
                                        height: desk.vertical ? 72 : 32,
                                    }}
                                >
                                    <span className="seat-code">{desk.id}</span>
                                    {isSelected && <span className="seat-check">✓</span>}
                                </div>
                            );
                        })}

                        {/* Partition lines & doorways */}
                        <div className="blueprint-wall" style={{ top: 145, left: 0, width: 440 }} />
                        <div className="doorway-tag" style={{ top: 135, left: 445 }}>ENTRANCE / DOOR</div>
                        <div className="blueprint-wall" style={{ top: 145, left: 560, width: 340 }} />

                        <div className="blueprint-wall" style={{ top: 620, left: 380, width: 520 }} />
                        <div className="blueprint-wall-vert" style={{ top: 620, left: 380, height: 160 }} />
                        <div className="doorway-tag" style={{ top: 610, left: 330 }}>PANTRY DOOR</div>

                        <img src={compas} alt="Compass" className="blueprint-compass" />
                    </div>
                </div>

                <div className="mobile-scroll-hint">
                    ↔ Drag horizontally to view full floorplan
                </div>
            </main>

            {/* Floating Bottom Dock */}
            <div className="map-bottom-dock">
                <div className="dock-inner">
                    <button
                        type="button"
                        className="dock-back-btn"
                        onClick={() => navigate('/order')}
                    >
                        <FaArrowLeft className="dock-btn-icon" />
                        <span>Back to Schedule</span>
                    </button>

                    <div className="dock-selection-summary">
                        <div className="selected-tag-row">
                            <span className="summary-title">Selected Desks:</span>
                            {selectedDesk.length > 0 ? (
                                <div className="selected-chips-wrap">
                                    {selectedDesk.map(d => (
                                        <span key={d} className="selected-chip-badge">{d}</span>
                                    ))}
                                </div>
                            ) : (
                                <span className="no-selection-hint">Please click available desk(s) above</span>
                            )}
                        </div>

                        {selectedDesk.length > 0 && (
                            <div className="dock-price-preview">
                                Total: <strong className="dock-total-highlight">Rp {calculatedTotal.toLocaleString('id-ID')}</strong>
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="dock-next-btn"
                        onClick={handleNext}
                        disabled={selectedDesk.length === 0}
                    >
                        <span>Confirm Booking ({selectedDesk.length})</span>
                        <FaArrowRight className="dock-btn-icon" />
                    </button>
                </div>
            </div>

            {/* Booking History Modal */}
            {showHistoryModal && (
                <div className="modal-backdrop-anim" onClick={toggleHistoryModal}>
                    <div className="history-modal-box" onClick={(e) => e.stopPropagation()}>
                        <div className="history-modal-header">
                            <div className="history-header-title">
                                <FaReceipt className="history-header-icon" />
                                <h2>My Booking History</h2>
                            </div>
                            <button
                                type="button"
                                className="modal-close-icon-btn"
                                onClick={toggleHistoryModal}
                                aria-label="Close modal"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="history-modal-body">
                            {loadingHistory ? (
                                <div className="history-loading-state">
                                    <div className="btn-spinner" />
                                    <span>Loading your reservations...</span>
                                </div>
                            ) : historyOrders.length === 0 ? (
                                <div className="history-empty-state">
                                    <FaReceipt className="empty-icon" />
                                    <p>No reservations found yet.</p>
                                    <span className="empty-sub">Your confirmed desk bookings will appear here.</span>
                                </div>
                            ) : (
                                <div className="history-card-list">
                                    {historyOrders.map((ord) => (
                                        <div key={ord.orderId} className="history-order-card">
                                            <div className="order-card-header">
                                                <div className="order-id-badge">
                                                    #{ord.orderId ? ord.orderId.substring(0, 8) : 'NONGKI'}
                                                </div>
                                                <span className="order-status-pill">
                                                    <FaCheck className="pill-check" />
                                                    {ord.status || 'CONFIRMED'}
                                                </span>
                                            </div>

                                            <div className="order-card-body">
                                                <div className="order-info-line">
                                                    <strong>{ord.spaceType || 'Desk'}</strong> ({ord.category || 'Standard'}) &bull; Desks: <span className="highlight-desks">{ord.bookedDesks?.join(', ') || 'N/A'}</span>
                                                </div>
                                                <div className="order-meta-line">
                                                    <span>{ord.date}</span>
                                                    <span>&bull;</span>
                                                    <span>{String(ord.startTime).padStart(2, '0')}:00 - {String(ord.endTime).padStart(2, '0')}:00</span>
                                                </div>
                                            </div>

                                            <div className="order-card-footer">
                                                <span className="payment-method-tag">{ord.paymentMethod || 'QRIS'}</span>
                                                <span className="order-total-price">
                                                    Rp {(ord.totalPrice || 0).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="history-modal-footer">
                            <button
                                type="button"
                                className="history-close-btn"
                                onClick={toggleHistoryModal}
                            >
                                Close History
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MapVip;
