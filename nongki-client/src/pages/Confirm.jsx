import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../Styles/Confirm.css';
import AppHeader from '../Components/AppHeader';
import logo from '../assets/logo.png';
import qrisLogo from '../assets/qrisLogo.png';
import qrCode from '../assets/qrbayar.png';
import gopayLogo from '../assets/gopayLogo.png';
import { usersApi, ordersApi, getAuthToken } from '../services/api';
import { 
    FaCalendarAlt, 
    FaClock, 
    FaDesktop, 
    FaCrown, 
    FaCheckCircle, 
    FaShieldAlt, 
    FaQrcode, 
    FaWallet, 
    FaUniversity, 
    FaMoneyBillWave, 
    FaArrowLeft, 
    FaLock, 
    FaTimes, 
    FaCopy, 
    FaCheck,
    FaReceipt 
} from 'react-icons/fa';

function Confirm() {
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

    const { 
        date, 
        startTime, 
        endTime, 
        timeStartStr, 
        timeEndStr, 
        kindOfSpace, 
        category, 
        selectedDesk = ['A1'], 
        totalPrice = 60000,
        durationHours = 2,
        pricePerHour = 30000
    } = bookingData;

    const [userProfile, setUserProfile] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('QRIS');
    const [showModal, setShowModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(10 * 60);
    const [modalView, setModalView] = useState('qris'); // 'qris', 'gopay', 'transfer', 'cash', 'success', 'failure', 'expired'
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [historyOrders, setHistoryOrders] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [paymentConfirmed, setPaymentConfirmed] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [copiedOrderId, setCopiedOrderId] = useState(false);

    // Idempotency key per booking session
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

    // Initial fetch of history count
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
        if (showModal && !paymentConfirmed && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft <= 0 && showModal && !paymentConfirmed) {
            setModalView('expired');
        }
    }, [showModal, paymentConfirmed, timeLeft]);

    const handleOpenPayment = () => {
        if (paymentMethod === 'GoPay') {
            setModalView('gopay');
        } else if (paymentMethod === 'Transfer') {
            setModalView('transfer');
        } else if (paymentMethod === 'Cash') {
            setModalView('cash');
        } else {
            setModalView('qris');
        }
        setTimeLeft(10 * 60);
        setPaymentConfirmed(false);
        setShowModal(true);
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
            } catch (err) {
                console.error('Failed to fetch orders history:', err);
            } finally {
                setLoadingHistory(false);
            }
        }
    };

    const formatTime = (seconds) => {
        if (seconds < 0) return '00:00';
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleConfirmPayment = async () => {
        setIsProcessing(true);
        setErrorMessage('');

        const payload = {
            userId: userProfile?.id || null,
            codes: selectedDesk,
            code: selectedDesk?.join(','),
            date: date,
            startTime: startTime,
            endTime: endTime,
            totalPrice: totalPrice,
            paymentMethod: paymentMethod || 'QRIS',
            idempotencyKey: idempotencyKeyRef.current,
        };

        try {
            const { ok, status, data: result } = await ordersApi.create(payload, idempotencyKeyRef.current);

            if (ok && result?.data) {
                const data = result.data;
                const formattedDetails = {
                    orderId: data.orderId,
                    amount: `Rp ${Number(data.totalPrice || totalPrice).toLocaleString('id-ID')}`,
                    bookedSpace: `${data.spaceType || kindOfSpace} (${data.category || category})`,
                    desks: data.bookedDesks?.join(', ') || selectedDesk?.join(', '),
                    bookingDate: data.date || date,
                    bookingTime: `${String(data.startTime || startTime).padStart(2, '0')}:00 – ${String(data.endTime || endTime).padStart(2, '0')}:00`,
                    paymentMethod: data.paymentMethod || paymentMethod,
                };
                setOrderDetails(formattedDetails);
                setPaymentConfirmed(true);
                setModalView('success');
            } else if (status === 409) {
                setErrorMessage(result?.message || 'Conflict: One or more selected desks were already booked by another user. Please choose another desk.');
                setModalView('failure');
            } else {
                setErrorMessage(result?.message || 'Failed to complete booking. Please try again.');
                setModalView('failure');
            }
        } catch (err) {
            console.error('Error creating order:', err);
            setErrorMessage('Unable to connect to the server. Please check your connection and ensure the backend is running.');
            setModalView('failure');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCopyOrderId = (id) => {
        if (!id) return;
        navigator.clipboard?.writeText(id);
        setCopiedOrderId(true);
        setTimeout(() => setCopiedOrderId(false), 2000);
    };

    const displayName = userProfile?.name || localStorage.getItem('userEmail') || 'Nongki Member';
    const displayEmail = userProfile?.email || localStorage.getItem('userEmail') || 'member@nongki.id';
    const formattedPrice = `Rp ${Number(totalPrice || 0).toLocaleString('id-ID')}`;

    const paymentMethods = [
        {
            id: 'QRIS',
            name: 'QRIS Instant QR',
            desc: 'Scan with BCA, Mandiri, GoPay, OVO, Dana or any e-wallet',
            icon: FaQrcode,
            recommended: true,
        },
        {
            id: 'GoPay',
            name: 'GoPay / GoPay Later',
            desc: 'Direct payment via Gojek GoPay balance',
            icon: FaWallet,
        },
        {
            id: 'Transfer',
            name: 'Virtual Account / Transfer',
            desc: 'Instant bank transfer confirmation',
            icon: FaUniversity,
        },
        {
            id: 'Cash',
            name: 'Pay at Cashier Counter',
            desc: 'Present your Order ID upon arrival',
            icon: FaMoneyBillWave,
        },
    ];

    return (
        <div className="confirm-page-layout">
            <AppHeader 
                currentStep={3} 
                onOpenHistory={toggleHistoryModal} 
                historyCount={historyOrders.length} 
            />

            <main className="confirm-main-wrapper">
                <div className="confirm-header-section">
                    <h1 className="confirm-heading">Review & Confirm Booking</h1>
                    <p className="confirm-subheading">Verify your workstation reservation details before payment</p>
                </div>

                <div className="confirm-grid">
                    {/* Left Column: Digital Booking Pass */}
                    <div className="confirm-invoice-card">
                        <div className="pass-card-top">
                            <div className="pass-brand-title">
                                <span className="brand-badge">NONGKI PASS</span>
                                <span className="space-tier-pill">
                                    <FaCrown className="crown-icon" /> {category}
                                </span>
                            </div>
                            <h2 className="pass-space-type">{kindOfSpace} Reservation</h2>
                            <p className="pass-desks-summary">
                                Workstation: <strong>{selectedDesk.join(', ')}</strong> ({selectedDesk.length} seat{selectedDesk.length > 1 ? 's' : ''})
                            </p>
                        </div>

                        <div className="pass-perforated-line">
                            <span className="notch-left" />
                            <span className="notch-right" />
                        </div>

                        <div className="pass-card-details">
                            <div className="detail-item-group">
                                <span className="detail-label">Reserved For</span>
                                <span className="detail-val-highlight">{displayName}</span>
                                <span className="detail-sub-val">{displayEmail}</span>
                            </div>

                            <div className="detail-meta-grid">
                                <div className="detail-item-group">
                                    <span className="detail-label"><FaCalendarAlt className="inline-icon" /> Date</span>
                                    <span className="detail-val">{date}</span>
                                </div>
                                <div className="detail-item-group">
                                    <span className="detail-label"><FaClock className="inline-icon" /> Time Slot</span>
                                    <span className="detail-val">{timeStartStr} – {timeEndStr}</span>
                                    <span className="detail-sub-val">({durationHours} hour duration)</span>
                                </div>
                            </div>

                            <div className="line-item-breakdown">
                                <div className="line-item">
                                    <span>Rate ({selectedDesk.length} seat{selectedDesk.length > 1 ? 's' : ''} × {durationHours} hr{durationHours > 1 ? 's' : ''})</span>
                                    <span>Rp {(pricePerHour * selectedDesk.length * durationHours).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="line-item">
                                    <span>Workspace Facilities & WiFi</span>
                                    <span className="text-free">Included</span>
                                </div>
                                <div className="line-item total-line-item">
                                    <span className="grand-total-label">Total Amount Due</span>
                                    <span className="grand-total-val">{formattedPrice}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pass-card-footer">
                            <div className="guarantee-note">
                                <FaShieldAlt className="guarantee-icon" />
                                <span>Pessimistic lock active: seats will be held during payment window</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Payment Method Selection */}
                    <div className="confirm-payment-card">
                        <h3 className="payment-card-title">Select Payment Method</h3>
                        <p className="payment-card-sub">Choose your preferred payment channel</p>

                        <div className="payment-methods-stack">
                            {paymentMethods.map((m) => {
                                const Icon = m.icon;
                                const isSelected = paymentMethod === m.id;
                                return (
                                    <div
                                        key={m.id}
                                        className={`payment-channel-row ${isSelected ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod(m.id)}
                                        role="button"
                                        tabIndex="0"
                                        onKeyDown={(e) => { if (e.key === 'Enter') setPaymentMethod(m.id); }}
                                    >
                                        <div className="channel-icon-wrap">
                                            <Icon className="channel-icon" />
                                        </div>
                                        <div className="channel-info">
                                            <div className="channel-title">
                                                {m.name}
                                                {m.recommended && <span className="rec-badge">Fastest</span>}
                                            </div>
                                            <div className="channel-desc">{m.desc}</div>
                                        </div>
                                        <div className="channel-check">
                                            <div className="channel-radio-inner" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="payment-action-dock">
                            <button
                                type="button"
                                className="back-to-map-btn"
                                onClick={() => navigate('/map', { state: bookingData })}
                            >
                                <FaArrowLeft />
                                <span>Back to Map</span>
                            </button>

                            <button
                                type="button"
                                className="pay-now-btn"
                                onClick={handleOpenPayment}
                            >
                                <FaLock className="lock-icon" />
                                <span>Pay {formattedPrice}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Payment Processing & Gateway Modal */}
            {showModal && (
                <div className="modal-backdrop-anim">
                    <div className="gateway-modal-box">
                        <div className="gateway-modal-header">
                            <div className="gateway-merchant-badge">
                                <img src={logo} alt="Nongki Logo" className="gateway-logo" />
                                <span className="gateway-secure-tag">
                                    <FaShieldAlt /> 256-Bit SSL
                                </span>
                            </div>
                            <button
                                type="button"
                                className="modal-close-icon-btn"
                                onClick={() => setShowModal(false)}
                                aria-label="Close modal"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="gateway-modal-body">
                            {/* QRIS / E-WALLET SCAN VIEW */}
                            {(modalView === 'qris' || modalView === 'gopay') && !paymentConfirmed && (
                                <div className="qris-checkout-view">
                                    <div className="qris-timer-bar">
                                        <span className="timer-text">Payment expires in:</span>
                                        <span className="countdown-pill">{formatTime(timeLeft)}</span>
                                    </div>

                                    <div className="qris-amount-display">
                                        <span className="amount-label">Total to Pay:</span>
                                        <span className="amount-val">{formattedPrice}</span>
                                    </div>

                                    <div className="qris-qr-container">
                                        <div className="qr-brand-header">
                                            <img 
                                                src={modalView === 'qris' ? qrisLogo : gopayLogo} 
                                                alt="Payment Provider" 
                                                className="provider-brand-logo" 
                                            />
                                            <span className="merchant-name">NONGKI SPACE</span>
                                        </div>
                                        <div className="qr-image-wrapper">
                                            <img src={qrCode} alt="QR Code for Payment" className="qr-code-img" />
                                            <div className="qr-target-corner top-left" />
                                            <div className="qr-target-corner top-right" />
                                            <div className="qr-target-corner bottom-left" />
                                            <div className="qr-target-corner bottom-right" />
                                        </div>
                                        <p className="qr-scan-hint">
                                            Scan using any mobile banking (BCA, Mandiri, BRI, BNI) or e-wallet (GoPay, OVO, Dana)
                                        </p>
                                    </div>

                                    <div className="gateway-actions">
                                        <button
                                            type="button"
                                            className="verify-payment-btn"
                                            onClick={handleConfirmPayment}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <span className="btn-loading-content">
                                                    <span className="btn-spinner" />
                                                    Verifying transaction...
                                                </span>
                                            ) : (
                                                <span className="btn-text-content">
                                                    <FaCheckCircle />
                                                    I Have Paid &bull; Verify Order
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* BANK TRANSFER / CASH VIEW */}
                            {(modalView === 'transfer' || modalView === 'cash') && !paymentConfirmed && (
                                <div className="manual-checkout-view">
                                    <div className="manual-channel-box">
                                        {modalView === 'transfer' ? (
                                            <>
                                                <h3 className="manual-title">Virtual Account / Transfer</h3>
                                                <p className="manual-desc">Transfer the exact amount to the following account:</p>
                                                <div className="va-number-box">
                                                    <span className="bank-name">BCA Virtual Account</span>
                                                    <strong className="va-number">8801 2345 6789 001</strong>
                                                    <span className="va-holder">A/N PT NONGKI RUANG KARYA</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <h3 className="manual-title">Pay at Cashier Counter</h3>
                                                <p className="manual-desc">Your seats will be reserved. Present your Order ID at the front desk bar upon arrival.</p>
                                            </>
                                        )}
                                        <div className="qris-amount-display">
                                            <span className="amount-label">Amount:</span>
                                            <span className="amount-val">{formattedPrice}</span>
                                        </div>
                                    </div>

                                    <div className="gateway-actions">
                                        <button
                                            type="button"
                                            className="verify-payment-btn"
                                            onClick={handleConfirmPayment}
                                            disabled={isProcessing}
                                        >
                                            {isProcessing ? (
                                                <span className="btn-loading-content">
                                                    <span className="btn-spinner" /> Confirming...
                                                </span>
                                            ) : (
                                                <span className="btn-text-content">
                                                    <FaCheckCircle /> Confirm Reservation
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* SUCCESS CONFIRMATION VIEW */}
                            {modalView === 'success' && paymentConfirmed && orderDetails && (
                                <div className="gateway-success-view">
                                    <div className="success-icon-badge">
                                        <FaCheckCircle className="big-check-icon" />
                                    </div>
                                    <h3 className="success-heading">Reservation Confirmed!</h3>
                                    <p className="success-sub">Your workstation has been locked and confirmed.</p>

                                    <div className="order-receipt-card">
                                        <div className="receipt-order-id-row">
                                            <div>
                                                <span className="receipt-label">Order Number:</span>
                                                <div className="receipt-id">#{orderDetails.orderId}</div>
                                            </div>
                                            <button
                                                type="button"
                                                className="copy-id-btn"
                                                onClick={() => handleCopyOrderId(orderDetails.orderId)}
                                                title="Copy Order ID"
                                            >
                                                {copiedOrderId ? <FaCheck className="text-green" /> : <FaCopy />}
                                                <span>{copiedOrderId ? 'Copied' : 'Copy'}</span>
                                            </button>
                                        </div>

                                        <div className="receipt-items-grid">
                                            <div className="receipt-item">
                                                <span className="receipt-label">Workstation:</span>
                                                <span className="receipt-val">{orderDetails.desks}</span>
                                            </div>
                                            <div className="receipt-item">
                                                <span className="receipt-label">Space & Tier:</span>
                                                <span className="receipt-val">{orderDetails.bookedSpace}</span>
                                            </div>
                                            <div className="receipt-item">
                                                <span className="receipt-label">Date:</span>
                                                <span className="receipt-val">{orderDetails.bookingDate}</span>
                                            </div>
                                            <div className="receipt-item">
                                                <span className="receipt-label">Time Window:</span>
                                                <span className="receipt-val">{orderDetails.bookingTime}</span>
                                            </div>
                                            <div className="receipt-item">
                                                <span className="receipt-label">Payment Method:</span>
                                                <span className="receipt-val">{orderDetails.paymentMethod}</span>
                                            </div>
                                            <div className="receipt-item">
                                                <span className="receipt-label">Total Paid:</span>
                                                <span className="receipt-val text-green">{orderDetails.amount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="success-actions">
                                        <button
                                            type="button"
                                            className="success-cta-btn"
                                            onClick={() => {
                                                setShowModal(false);
                                                navigate('/order');
                                            }}
                                        >
                                            Return to Reservations
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* FAILURE / CONFLICT / EXPIRED VIEW */}
                            {(modalView === 'failure' || modalView === 'expired') && !paymentConfirmed && (
                                <div className="gateway-failure-view">
                                    <div className="failure-icon-badge">
                                        <FaTimes className="big-cross-icon" />
                                    </div>
                                    <h3 className="failure-heading">
                                        {modalView === 'expired' ? 'Payment Session Expired' : 'Booking Conflict Detected'}
                                    </h3>
                                    <p className="failure-sub">
                                        {errorMessage || (modalView === 'expired'
                                            ? 'The 10-minute payment countdown has expired. Please try booking again.'
                                            : 'One or more of your chosen desks were reserved concurrently by another user.')}
                                    </p>

                                    <div className="failure-actions">
                                        <button
                                            type="button"
                                            className="retry-btn"
                                            onClick={() => setModalView('qris')}
                                        >
                                            Try Again
                                        </button>
                                        <button
                                            type="button"
                                            className="pick-other-desk-btn"
                                            onClick={() => {
                                                setShowModal(false);
                                                navigate('/map', { state: bookingData });
                                            }}
                                        >
                                            Pick Other Desks
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                                                    <span>{String(ord.startTime).padStart(2, '0')}:00 – {String(ord.endTime).padStart(2, '0')}:00</span>
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

export default Confirm;
