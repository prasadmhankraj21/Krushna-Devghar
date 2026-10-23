import { defaultProducts } from './defaultProducts';

const API_BASE = '/api';

// Helper to resolve image paths whether running locally or on GitHub Pages (/Krushna-Devghar/)
export function resolveImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  if (url.startsWith('/uploads/')) {
    const base = import.meta.env.BASE_URL || './';
    const cleanBase = base.endsWith('/') ? base : base + '/';
    return cleanBase + url.slice(1);
  }
  return url;
}

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

// Client-side Database Helpers for Offline / GitHub Pages
function getLocalProducts() {
  const cached = localStorage.getItem('kd_products');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      // Fallback
    }
  }
  // Initialize with default 21 products uploaded by the owner
  const initial = defaultProducts.map(p => ({
    ...p,
    image_url: resolveImageUrl(p.image_url)
  }));
  localStorage.setItem('kd_products', JSON.stringify(initial));
  return initial;
}

function saveLocalProducts(products) {
  localStorage.setItem('kd_products', JSON.stringify(products));
}

function getLocalOrders() {
  const cached = localStorage.getItem('kd_orders');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {}
  }
  const initial = [
    {
      id: 101,
      order_number: 'KD-2026-8812',
      tracking_number: 'KD-EXP-992104',
      user_id: 2,
      user_name: 'Rajesh Sharma',
      user_email: 'customer@gmail.com',
      user_phone: '+91 98765 43210',
      shipping_address: 'Flat 402, Royal Palms Residency, MG Road, Mumbai, Maharashtra - 400001',
      items: [
        {
          id: 18,
          title: 'crossing diamond shrines',
          category: 'Marble Mandir',
          price: 3500,
          quantity: 1,
          image_url: resolveImageUrl('/uploads/marble_file_00000000b96081f48de404bf886fb56a_1792778687368.png')
        }
      ],
      total_amount: 3500,
      payment_method: 'UPI / Online Payment',
      payment_status: 'Paid',
      status: 'In Transit',
      tracking_status: 'On The Way (Wooden Crate Dispatched)',
      current_location: 'Jaipur Transport Hub -> En Route to Mumbai sanctum',
      carrier_name: 'Safexpress White Marble Logistics',
      tracking_history: [
        {
          status: 'Order Confirmed',
          location: 'Makrana Workshop Sanctum',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          note: 'Pure Makrana white marble craftsmanship inspected and certified.'
        },
        {
          status: 'Reinforced Crated',
          location: 'Makrana Logistics Hub',
          timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
          note: 'Packed inside double shock-absorbent timber crate.'
        },
        {
          status: 'In Transit',
          location: 'Jaipur Central Freight Division',
          timestamp: new Date().toISOString(),
          note: 'Consignment cleared and moving via dedicated express freight.'
        }
      ],
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
    }
  ];
  localStorage.setItem('kd_orders', JSON.stringify(initial));
  return initial;
}

function saveLocalOrders(orders) {
  localStorage.setItem('kd_orders', JSON.stringify(orders));
}

export const api = {
  // Customer Auth
  login: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      // Backend not running / GitHub Pages fallback
    }

    // Client-side fallback check
    const localUsers = JSON.parse(localStorage.getItem('kd_users') || '[]');
    const foundUser = localUsers.find(u => u.email === email && u.password === password);

    if (foundUser || (email === 'customer@gmail.com' && password === 'customer123')) {
      const user = foundUser || {
        id: 2,
        name: 'Rajesh Sharma',
        email: 'customer@gmail.com',
        role: 'user',
        phone: '+91 98765 43210',
        address: 'Flat 402, Royal Palms Residency, MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      };
      const token = 'gh_kd_user_' + Date.now();
      localStorage.setItem('royal_marble_token', token);
      localStorage.setItem('royal_marble_user', JSON.stringify(user));
      return { success: true, message: 'Login successful!', token, user };
    }

    return { success: false, message: 'Incorrect email or password. Use customer@gmail.com / customer123' };
  },

  register: async (userData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    // Client-side fallback
    const localUsers = JSON.parse(localStorage.getItem('kd_users') || '[]');
    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'user',
      phone: userData.phone || '',
      address: userData.address || '',
      city: userData.city || '',
      state: userData.state || '',
      pincode: userData.pincode || ''
    };
    localUsers.push(newUser);
    localStorage.setItem('kd_users', JSON.stringify(localUsers));

    const token = 'gh_kd_user_' + Date.now();
    localStorage.setItem('royal_marble_token', token);
    localStorage.setItem('royal_marble_user', JSON.stringify(newUser));
    return { success: true, message: 'Account registered successfully!', token, user: newUser };
  },

  // Dedicated Admin Auth
  adminLogin: async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    if (email === 'admin@marbles.com' && password === 'admin123') {
      const adminUser = {
        id: 1,
        name: 'Royal Marbles Admin',
        email: 'admin@marbles.com',
        role: 'admin',
        phone: '+91 98290 12345'
      };
      const token = 'gh_kd_admin_' + Date.now();
      localStorage.setItem('royal_marble_token', token);
      localStorage.setItem('royal_marble_user', JSON.stringify(adminUser));
      return { success: true, message: 'Admin authentication verified.', token, user: adminUser };
    }

    return { success: false, message: 'Invalid Admin Credentials! Use admin@marbles.com / admin123' };
  },

  getAdminStatus: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/admin/status`);
      if (res.ok) return await res.json();
    } catch (err) {}
    return { success: true, adminExists: true, adminEmail: 'admin@marbles.com' };
  },

  setupAdmin: async (adminData) => {
    try {
      const res = await fetch(`${API_BASE}/auth/admin/setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      });
      if (res.ok) return await res.json();
    } catch (err) {}
    return { success: true, message: 'Admin setup verified' };
  },

  getMe: async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const cached = localStorage.getItem('royal_marble_user');
    if (cached) {
      return { success: true, user: JSON.parse(cached) };
    }
    return { success: false, message: 'Not logged in' };
  },

  updateProfile: async (data) => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const cached = localStorage.getItem('royal_marble_user');
    if (cached) {
      const user = { ...JSON.parse(cached), ...data };
      localStorage.setItem('royal_marble_user', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: true };
  },

  // Gallery Photo Upload (Multipart or Base64 Fallback)
  uploadPhoto: async (file, customName = 'marble_photo.jpg') => {
    try {
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
      if (res.ok) return await res.json();
    } catch (err) {}

    // Client-side fallback: Convert Blob/File to Base64 data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          success: true,
          message: 'Photo processed successfully from gallery!',
          url: reader.result
        });
      };
      reader.onerror = () => {
        resolve({ success: false, message: 'Failed to read photo.' });
      };
      reader.readAsDataURL(file);
    });
  },

  // Products
  getProducts: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.products) {
          // Resolve relative images
          const resolved = data.products.map(p => ({
            ...p,
            image_url: resolveImageUrl(p.image_url)
          }));
          return { success: true, products: resolved };
        }
      }
    } catch (err) {}

    // Client-side fallback
    let products = getLocalProducts();
    if (params.category) {
      products = products.filter(p => p.category === params.category);
    }
    if (params.search) {
      const s = params.search.toLowerCase();
      products = products.filter(p =>
        (p.title && p.title.toLowerCase().includes(s)) ||
        (p.category && p.category.toLowerCase().includes(s)) ||
        (p.marble_type && p.marble_type.toLowerCase().includes(s))
      );
    }
    return { success: true, products };
  },

  getProductCategories: async () => {
    return {
      success: true,
      categories: [
        'Marble Mandir',
        'Vrindavan Shrines',
        'Other Marble Products'
      ]
    };
  },

  getProductById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.product) {
          return {
            success: true,
            product: {
              ...data.product,
              image_url: resolveImageUrl(data.product.image_url)
            }
          };
        }
      }
    } catch (err) {}

    const products = getLocalProducts();
    const product = products.find(p => String(p.id) === String(id));
    if (product) {
      return { success: true, product };
    }
    return { success: false, message: 'Product not found' };
  },

  createProduct: async (productData) => {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const products = getLocalProducts();
    const newProduct = {
      id: Date.now(),
      ...productData,
      image_url: resolveImageUrl(productData.image_url),
      created_at: new Date().toISOString()
    };
    products.unshift(newProduct);
    saveLocalProducts(products);
    return { success: true, product: newProduct };
  },

  updateProduct: async (id, productData) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const products = getLocalProducts();
    const idx = products.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      products[idx] = {
        ...products[idx],
        ...productData,
        image_url: resolveImageUrl(productData.image_url || products[idx].image_url)
      };
      saveLocalProducts(products);
      return { success: true };
    }
    return { success: false, message: 'Product not found' };
  },

  deleteProduct: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    let products = getLocalProducts();
    products = products.filter(p => String(p.id) !== String(id));
    saveLocalProducts(products);
    return { success: true };
  },

  // Orders
  createOrder: async (orderData) => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData)
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const orders = getLocalOrders();
    const newOrder = {
      id: Date.now(),
      order_number: 'KD-' + Math.floor(1000 + Math.random() * 9000),
      tracking_number: 'KD-EXP-' + Math.floor(100000 + Math.random() * 900000),
      ...orderData,
      status: 'Confirmed',
      tracking_status: 'Order Placed (Makrana Artisan Sanctified)',
      current_location: 'Makrana Sacred Workshop Hub',
      carrier_name: 'Safexpress White Marble Logistics',
      tracking_history: [
        {
          status: 'Order Confirmed',
          location: 'Makrana Sanctum',
          timestamp: new Date().toISOString(),
          note: 'Your divine marble order has been confirmed and registered for freight transit.'
        }
      ],
      created_at: new Date().toISOString()
    };
    orders.unshift(newOrder);
    saveLocalOrders(orders);
    return { success: true, order: newOrder };
  },

  getMyOrders: async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/my`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const user = JSON.parse(localStorage.getItem('royal_marble_user') || '{}');
    const orders = getLocalOrders();
    const myOrders = orders.filter(o => o.user_id === user.id || o.user_email === user.email);
    return { success: true, orders: myOrders.length > 0 ? myOrders : orders };
  },

  getOrderById: async (id) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const orders = getLocalOrders();
    const order = orders.find(o => String(o.id) === String(id) || o.order_number === id);
    if (order) return { success: true, order };
    return { success: false, message: 'Order not found' };
  },

  trackOrder: async (orderOrTrackingNumber) => {
    try {
      const res = await fetch(`${API_BASE}/orders/track/${encodeURIComponent(orderOrTrackingNumber)}`);
      if (res.ok) return await res.json();
    } catch (err) {}

    const orders = getLocalOrders();
    const query = String(orderOrTrackingNumber).trim().toUpperCase();
    const order = orders.find(o =>
      String(o.tracking_number).toUpperCase() === query ||
      String(o.order_number).toUpperCase() === query ||
      String(o.id) === query
    );

    if (order) {
      return { success: true, order };
    }
    return { success: false, message: 'No consignment found matching tracking ID.' };
  },

  // Admin
  getAdminDashboard: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const products = getLocalProducts();
    const orders = getLocalOrders();
    const totalSales = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);

    return {
      success: true,
      stats: {
        totalProducts: products.length,
        totalOrders: orders.length,
        totalSales,
        totalCustomers: 5
      },
      recentOrders: orders.slice(0, 5)
    };
  },

  getAdminOrders: async (params = {}) => {
    try {
      const query = new URLSearchParams(params);
      const res = await fetch(`${API_BASE}/admin/orders?${query.toString()}`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    let orders = getLocalOrders();
    if (params.status) {
      orders = orders.filter(o => o.status === params.status);
    }
    return { success: true, orders };
  },

  updateOrderStatus: async (orderId, updateData) => {
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    const orders = getLocalOrders();
    const idx = orders.findIndex(o => String(o.id) === String(orderId));
    if (idx !== -1) {
      const order = orders[idx];
      const newStatus = updateData.status || order.status;
      const history = order.tracking_history || [];
      history.push({
        status: newStatus,
        location: updateData.current_location || 'Makrana Freight Facility',
        timestamp: new Date().toISOString(),
        note: updateData.note || 'Milestone update from Krushna Devghar owner admin.'
      });

      orders[idx] = {
        ...order,
        status: newStatus,
        tracking_status: updateData.tracking_status || newStatus,
        current_location: updateData.current_location || order.current_location,
        carrier_name: updateData.carrier_name || order.carrier_name,
        tracking_history: history
      };
      saveLocalOrders(orders);
      return { success: true, order: orders[idx] };
    }
    return { success: false, message: 'Order not found' };
  },

  getAdminCustomers: async () => {
    try {
      const res = await fetch(`${API_BASE}/admin/customers`, {
        headers: getAuthHeaders()
      });
      if (res.ok) return await res.json();
    } catch (err) {}

    return {
      success: true,
      customers: [
        { id: 2, name: 'Rajesh Sharma', email: 'customer@gmail.com', phone: '+91 98765 43210', city: 'Mumbai', orders_count: 1 }
      ]
    };
  }
};
