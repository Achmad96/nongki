import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

export default function GuestRoute({ children }) {
    const location = useLocation();

    if (isAuthenticated()) {
        const from = location.state?.from?.pathname || '/order';
        return <Navigate to={from} replace />;
    }

    return children;
}

