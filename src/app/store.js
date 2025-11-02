import { configureStore } from '@reduxjs/toolkit';
import { productsApiSlice } from '../features/products/productsApiSlice.js';
import { ordersApiSlice } from '../features/orders/ordersApiSlice';

export const store = configureStore({
  reducer: {
    [productsApiSlice.reducerPath]: productsApiSlice.reducer,
    [ordersApiSlice.reducerPath]: ordersApiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productsApiSlice.middleware).concat(ordersApiSlice.middleware),
});