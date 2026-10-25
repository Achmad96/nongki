const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token, expireIn, email) => {
    localStorage.setItem('token', token);
    if (expireIn) localStorage.setItem('tokenExpireIn', expireIn);
    if (email) localStorage.setItem('userEmail', email);
};
export const clearAuthToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpireIn');
    localStorage.removeItem('userEmail');
};

export const isAuthenticated = () => {
    const token = getAuthToken();
    if (!token) return false;

    // Check expireIn timestamp if present
    const expireIn = localStorage.getItem('tokenExpireIn');
    if (expireIn) {
        const expireTime = parseInt(expireIn, 10);
        if (!isNaN(expireTime) && Date.now() >= expireTime) {
            clearAuthToken();
            return false;
        }
    }

    // Check JWT payload expiration
    try {
        const parts = token.split('.');
        if (parts.length === 3) {
            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            const payload = JSON.parse(jsonPayload);
            if (payload.exp && Date.now() >= payload.exp * 1000) {
                clearAuthToken();
                return false;
            }
        }
    } catch {
        // Fall back to token presence
    }

    return true;
};

export async function apiRequest(endpoint, options = {}) {
    const { headers = {}, body, ...restOptions } = options;
    const token = getAuthToken();

    const requestHeaders = {
        'Accept': 'application/json',
        ...headers,
    };

    if (body && !requestHeaders['Content-Type']) {
        requestHeaders['Content-Type'] = 'application/json';
    }

    // Do not attach token for public auth endpoints (login/register)
    const isAuthEndpoint = endpoint.includes('/api/auth/');
    if (token && !isAuthEndpoint && !requestHeaders['Authorization']) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await fetch(url, {
        ...restOptions,
        headers: requestHeaders,
        body: body && typeof body === 'object' && !(body instanceof FormData)
            ? JSON.stringify(body)
            : body,
    });

    if (response.status === 401 && !isAuthEndpoint) {
        clearAuthToken();
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
            window.location.href = '/login?expired=1';
        }
    }

    const data = await response.json().catch(() => null);

    return {
        ok: response.ok,
        status: response.status,
        data,
    };
}

export const authApi = {
    login: async (credentialsOrIdentifier, password) => {
        let payload;
        if (typeof credentialsOrIdentifier === 'object' && credentialsOrIdentifier !== null) {
            payload = credentialsOrIdentifier;
        } else {
            const isEmail = typeof credentialsOrIdentifier === 'string' && credentialsOrIdentifier.includes('@');
            payload = isEmail
                ? { email: credentialsOrIdentifier, password }
                : { username: credentialsOrIdentifier, email: credentialsOrIdentifier, password };
        }
        return apiRequest('/api/auth/login', {
            method: 'POST',
            body: payload,
        });
    },
    register: async (payload) => {
        return apiRequest('/api/auth/register', {
            method: 'POST',
            body: payload,
        });
    },
};

export const spacesApi = {
    getAll: async () => {
        return apiRequest('/api/spaces');
    },
    getSpaces: async (params) => {
        if (!params) return apiRequest('/api/spaces');
        const query = new URLSearchParams(params).toString();
        return apiRequest(`/api/spaces?${query}`);
    },
    getBookedDesks: async (date, start, end) => {
        return apiRequest(`/api/spaces/booked-desks?date=${encodeURIComponent(date)}&start=${start}&end=${end}`);
    },
};

export const ordersApi = {
    create: async (payload, idempotencyKey) => {
        const headers = {};
        if (idempotencyKey) {
            headers['Idempotency-Key'] = idempotencyKey;
        }
        return apiRequest('/api/orders', {
            method: 'POST',
            headers,
            body: payload,
        });
    },
    createOrder: async (payload, idempotencyKey) => {
        return ordersApi.create(payload, idempotencyKey || payload?.idempotencyKey);
    },
    getMyOrders: async () => {
        return apiRequest('/api/orders');
    },
    getById: async (id) => {
        return apiRequest(`/api/orders/${id}`);
    },
};

export const usersApi = {
    getMe: async () => {
        return apiRequest('/api/users/me');
    },
};
