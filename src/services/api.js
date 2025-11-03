import axios from 'axios';

const API = axios.create({
  baseURL:
    import.meta.env.MODE === 'development'
      ? 'http://localhost:5000/api'
      : 'https://render.com/docs/web-services#port-binding/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) localStorage.removeItem('token');
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data)
};

export const productsAPI = {
  getAll: (params) => API.get('/products', { params }),
  getById: (id) => API.get(`/products/${id}`)
};

export const userAPI = {
  updateProfile: (data) => API.put('/users/profile', data),
  getCart: () => API.get('/users/cart'),
  addToCart: (data) => API.post('/users/cart', data),
  updateCartItem: (data) => API.put('/users/cart', data), 
  removeFromCart: (productId) => API.delete(`/users/cart/${productId}`)
};

export const orderAPI = {
  create: (data) => API.post('/orders', data) 
};

export const adminAPI = {
  getProducts: (params) => API.get('/admin/products', { params }),
  getOrders: () => API.get('/admin/orders'),
  getCarts: () => API.get('/admin/carts'),
  addProduct: (data) => API.post('/products', data),
  updateProduct: (id, data) => API.put(`/products/${id}`, data),
  deleteProduct: (id) => API.delete(`/products/${id}`)
};

export default API;