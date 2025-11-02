import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApiSlice = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }), 
  
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ search, category, price_lt }) => {
        const params = new URLSearchParams();

        if (search) params.append('search', search);
        if (category) params.append('category', category);
        if (price_lt) params.append('price_lt', price_lt);

        return `products?${params.toString()}`;
      },

      providesTags: (result) => 
        result ? [
          ...result.products.map(({ id }) => ({ type: 'Products', id })),
          { type: 'Products', id: 'LIST' },
        ] : [{ type: 'Products', id: 'LIST' }],
    }),
  }),
});

export const { useGetProductsQuery } = productsApiSlice;