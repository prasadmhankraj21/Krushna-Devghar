const API_BASE = '/api';

function getAuthHeaders(isFormData = false) {
  const token = localStorage.getItem('royal_marble_token');
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Customer Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return res.json();
  },

  // Dedicated Admin Auth
  adminLogin: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return res.json();
  },

  getAdminStatus: async () => {
    const res = await fetch(`${API_BASE}/auth/admin/status`);
    return res.json();
  },

  setupAdmin: async (adminData) => {
    const res = await fetch(`${API_BASE}/auth/admin/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(adminData)
    });
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  updateProfile: async (data) => {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Gallery Photo Upload (Multipart)
  uploadPhoto: async (file, customName = 'marble_photo.jpg') => {
    const formData = new FormData();
    if (file instanceof Blob && !file.name) {
      formData.append('image', file, customName);
    } else {
      formData.append('image', file);
    }

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: getAuthHeaders(true),
      body: formData
    });
    return res.json();
  },

  // Products
  getProducts: async (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return res.json();
  },

  getProductCategories: async () => {
    const res = await fetch(`${API_BASE}/products/categories`);
    return res.json();
  },

  getProductById: async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return res.json();
  },

  createProduct: async (productData) => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  updateProduct: async (id, productData) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    return res.json();
  },

  deleteProduct: async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Orders
  createOrder: async (orderData) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  getMyOrders: async () => {
    const res = await fetch(`${API_BASE}/orders/my`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getOrderById: async (id) => {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  trackOrder: async (orderOrTrackingNumber) => {
    const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(orderOrTrackingNumber)}`);
    return res.json();
  },

  // Admin
  getAdminDashboard: async () => {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  getAdminOrders: async (params = {}) => {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE}/admin/orders?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  updateOrderStatus: async (orderId, updateData) => {
    const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    return res.json();
  },

  getAdminCustomers: async () => {
    const res = await fetch(`${API_BASE}/admin/customers`, {
      headers: getAuthHeaders()
    });
    return res.json();
  }
};
