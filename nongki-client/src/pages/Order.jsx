import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Order.css';
import AppHeader from '../Components/AppHeader';
import { spacesApi, ordersApi } from '../services/api';
import { 
    FaCalendarAlt, 
    FaClock, 
    FaDesktop, 
    FaUsers, 
    FaDoorClosed, 
    FaCrown, 
    FaCheck, 
    FaWifi, 
    FaCoffee, 
    FaBolt, 
    FaSnowflake, 
    FaArrowRight, 
    FaTimes,
    FaReceipt
} from 'react-icons/fa';

function Order() {
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

    // Initial fetch of history orders count
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
            } catch (err) {
                console.error('Failed to fetch orders history:', err);
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
            setErrorMessage('End time must be later than start time.');
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

    const spaceTypes = [
        {
            id: 'Desk',
            title: 'Individual Desk',
            desc: 'Quiet zone workstation with ergonomic chair & power outlet',
            icon: FaDesktop,
        },
        {
            id: 'Group Desk',
            title: 'Group Desk',
            desc: 'Collaborative cluster designed for team productivity',
            icon: FaUsers,
        },
        {
            id: 'Meeting Room',
            title: 'Meeting Room',
            desc: 'Private sound-insulated room with presentation display',
            icon: FaDoorClosed,
        },
    ];

    const perks = resolvedCategory === 'VIP' ? [
        { icon: FaWifi, label: 'High-Speed WiFi (100 Mbps)' },
        { icon: FaCoffee, label: 'Free Flow Artisan Coffee & Tea' },
        { icon: FaSnowflake, label: 'Full Air Conditioning' },
        { icon: FaBolt, label: 'Dedicated Power & Fast Charging' },
        { icon: FaCrown, label: 'VIP Lounge & Projector Access' },
    ] : [
        { icon: FaWifi, label: 'High-Speed WiFi (50 Mbps)' },
        { icon: FaSnowflake, label: 'Full Air Conditioning' },
        { icon: FaBolt, label: 'Dedicated Power Outlets' },
    ];

    return (
        <div className="order-layout">
            <AppHeader 
                currentStep={1} 
                onOpenHistory={toggleHistoryModal} 
                historyCount={historyOrders.length} 
            />

            <main className="order-main-container">
                <div className="order-page-header">
                    <div>
                        <h1 className="page-heading">Book Your Workspace</h1>
                        <p className="page-subheading">Customize your date, duration, and ideal workstation tier</p>
                    </div>
                </div>

                {errorMessage && (
                    <div className="order-alert-error" role="alert">
                        <span>{errorMessage}</span>
                    </div>
                )}

                <div className="order-grid">
                    {/* Left Column: Form Builder */}
                    <div className="order-builder-col">
                        {/* Section 1: Schedule */}
                        <section className="builder-card">
                            <div className="card-section-header">
                                <span className="section-number">1</span>
                                <div>
                                    <h2 className="section-title">Date & Schedule</h2>
                                    <p className="section-subtitle">Pick your reservation date and duration</p>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="order-date">
                                    <FaCalendarAlt className="label-icon" /> Reservation Date
                                </label>
                                <div className="date-input-row">
                                    <input
                                        type="date"
                                        id="order-date"
                                        className="styled-input date-input"
                                        value={date}
                                        min={todayStr}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                    <div className="quick-date-pills">
                                        <button
                                            type="button"
                                            className={`quick-pill ${date === todayStr ? 'active' : ''}`}
                                            onClick={() => setDate(todayStr)}
                                        >
                                            Today
                                        </button>
                                        <button
                                            type="button"
                                            className={`quick-pill ${date === tomorrowStr ? 'active' : ''}`}
                                            onClick={() => setDate(tomorrowStr)}
                                        >
                                            Tomorrow
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="time-select-grid">
                                <div className="form-group">
                                    <label className="form-label" htmlFor="time-start">
                                        <FaClock className="label-icon" /> Start Time
                                    </label>
                                    <select
                                        id="time-start"
                                        className="styled-select"
                                        value={timeStart}
                                        onChange={(e) => setTimeStart(e.target.value)}
                                    >
                                        <option value="08:00">08:00 AM</option>
                                        <option value="09:00">09:00 AM</option>
                                        <option value="10:00">10:00 AM</option>
                                        <option value="11:00">11:00 AM</option>
                                        <option value="12:00">12:00 PM</option>
                                        <option value="13:00">01:00 PM</option>
                                        <option value="14:00">02:00 PM</option>
                                        <option value="15:00">03:00 PM</option>
                                    </select>
                                </div>

                                <div className="duration-indicator">
                                    <span className="duration-arrow">→</span>
                                    <span className="duration-text">{durationHours} hr{durationHours > 1 ? 's' : ''}</span>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="time-end">
                                        <FaClock className="label-icon" /> End Time
                                    </label>
                                    <select
                                        id="time-end"
                                        className="styled-select"
                                        value={timeEnd}
                                        onChange={(e) => setTimeEnd(e.target.value)}
                                    >
                                        <option value="09:00">09:00 AM</option>
                                        <option value="10:00">10:00 AM</option>
                                        <option value="11:00">11:00 AM</option>
                                        <option value="12:00">12:00 PM</option>
                                        <option value="13:00">01:00 PM</option>
                                        <option value="14:00">02:00 PM</option>
                                        <option value="15:00">03:00 PM</option>
                                        <option value="16:00">04:00 PM</option>
                                        <option value="17:00">05:00 PM</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Space Type */}
                        <section className="builder-card">
                            <div className="card-section-header">
                                <span className="section-number">2</span>
                                <div>
                                    <h2 className="section-title">Space Type & Tier</h2>
                                    <p className="section-subtitle">Choose the workstation style that matches your workflow</p>
                                </div>
                            </div>

                            {/* Space Cards */}
                            <div className="space-type-cards">
                                {spaceTypes.map((type) => {
                                    const Icon = type.icon;
                                    const isSelected = kindOfSpace === type.id;
                                    return (
                                        <div
                                            key={type.id}
                                            className={`space-type-card ${isSelected ? 'selected' : ''}`}
                                            onClick={() => setKindOfSpace(type.id)}
                                            role="button"
                                            tabIndex="0"
                                            onKeyDown={(e) => { if (e.key === 'Enter') setKindOfSpace(type.id); }}
                                        >
                                            <div className="space-card-icon-wrap">
                                                <Icon className="space-card-icon" />
                                            </div>
                                            <div className="space-card-content">
                                                <div className="space-card-title">{type.title}</div>
                                                <div className="space-card-desc">{type.desc}</div>
                                            </div>
                                            <div className="space-card-radio">
                                                <div className="radio-inner" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Tier Selector: VIP vs Reguler */}
                            <div className="tier-selector-container">
                                <label className="form-label">Service Tier</label>
                                <div className="tier-switch">
                                    <button
                                        type="button"
                                        className={`tier-btn ${resolvedCategory === 'VIP' ? 'active vip-active' : ''}`}
                                        onClick={() => setCategory('VIP')}
                                    >
                                        <FaCrown className="tier-icon" />
                                        <span>VIP Experience</span>
                                        <span className="tier-badge">Recommended</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`tier-btn ${resolvedCategory === 'Reguler' ? 'active' : ''}`}
                                        onClick={() => setCategory('Reguler')}
                                    >
                                        <span>Reguler Tier</span>
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Live Summary & Amenities */}
                    <aside className="order-summary-col">
                        <div className="summary-sticky-card">
                            <h3 className="summary-card-title">Booking Summary</h3>

                            <div className="summary-detail-list">
                                <div className="summary-row">
                                    <span className="summary-label">Space Type</span>
                                    <span className="summary-val">{kindOfSpace}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Tier</span>
                                    <span className={`summary-badge ${resolvedCategory === 'VIP' ? 'badge-vip' : 'badge-reg'}`}>
                                        {resolvedCategory}
                                    </span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Date</span>
                                    <span className="summary-val">{date}</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Time Window</span>
                                    <span className="summary-val">{timeStart} - {timeEnd} ({durationHours} hrs)</span>
                                </div>
                                <div className="summary-row">
                                    <span className="summary-label">Rate / Hour</span>
                                    <span className="summary-val">Rp {pricePerHour.toLocaleString('id-ID')}</span>
                                </div>
                            </div>

                            <div className="summary-divider" />

                            <div className="summary-total-row">
                                <div className="total-label">Estimated Total</div>
                                <div className="total-amount">
                                    Rp {estimatedTotalPrice.toLocaleString('id-ID')}
                                </div>
                            </div>

                            <button
                                type="button"
                                className="proceed-cta-btn"
                                onClick={handleCheck}
                            >
                                <span>Choose Desks on Floorplan</span>
                                <FaArrowRight className="cta-icon" />
                            </button>

                            {/* Included Amenities List */}
                            <div className="included-perks-box">
                                <div className="perks-title">Included Amenities</div>
                                <ul className="perks-list">
                                    {perks.map((p, i) => {
                                        const PerkIcon = p.icon;
                                        return (
                                            <li key={i} className="perk-item">
                                                <PerkIcon className="perk-icon" />
                                                <span>{p.label}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Booking History Drawer / Modal */}
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

export default Order;
