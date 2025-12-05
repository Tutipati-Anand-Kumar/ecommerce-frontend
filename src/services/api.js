import axios from 'axios';

// api.js (add this export)
export const getBackendUrl = () => {
  return import.meta.env.MODE === 'development'
    ? 'http://localhost:3000'
    : (import.meta.env.VITE_BACKEND_URL?.trim() || 'https://ecommerce-backend-1-26u7.onrender.com');
};

console.log('Backend URL (final):', getBackendUrl());

const API = axios.create({
  baseURL: `${getBackendUrl()}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(err);
  }
);

// =====================
// 🔹 AUTH ENDPOINTS
// =====================
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
};

// =====================
// 🔹 PRODUCTS ENDPOINTS
// =====================
export const productsAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`),
};

// =====================
// 🔹 USER ENDPOINTS
// =====================
export const userAPI = {
  updateProfile: (data) => API.put('/users/profile', data),
  getCart: () => API.get('/users/cart'),
  addToCart: (data) => API.post('/users/cart', data),
  updateCartItem: (data) => API.put('/users/cart', data),
  removeFromCart: (productId) => API.delete(`/users/cart/${productId}`),
};

// =====================
// 🔹 ORDERS ENDPOINTS
// =====================
export const orderAPI = {
  create: (data) => API.post('/orders', data),
};

// =====================
// 🔹 ADMIN ENDPOINTS
// =====================
export const adminAPI = {
  // getProducts: (params) => API.get('/admin/products', { params }),
  getProducts: () => API.get('/products?all=true'),
  getOrders: () => API.get('/admin/orders'),
  getCarts: () => API.get('/admin/carts'),
  addProduct: (data) => API.post('/products', data),
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`),
};

export default API;
