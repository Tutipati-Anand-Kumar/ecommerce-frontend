import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ordersApiSlice = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getMyOrders: builder.query({
      query: () => '/orders',
      providesTags: ['Order'],
    }),

    createOrder: builder.mutation({
      query: (orderDetails) => ({
        url: '/orders',
        method: 'POST',
        body: orderDetails,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const { useGetMyOrdersQuery, useCreateOrderMutation } = ordersApiSlice;