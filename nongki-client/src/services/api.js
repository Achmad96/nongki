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

    if (token && !requestHeaders['Authorization']) {
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

    const data = await response.json().catch(() => null);

    return {
        ok: response.ok,
        status: response.status,
        data,
    };
}

export const authApi = {
    login: async (identifier, password) => {
        return apiRequest('/api/auth/login', {
            method: 'POST',
            body: { email: identifier, password },
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
