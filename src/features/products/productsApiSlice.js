import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBackendUrl } from "../../services/api";

export const productsApiSlice = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBackendUrl()}/api`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
   getProducts: builder.query({
  query: ({ search, category, price_lt, rating, page = 1, limit = 12 }) => {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (price_lt) params.append("price_lt", price_lt);
    if (rating) params.append("rating", rating); // ✅ add this line
    params.append("page", page);
    params.append("limit", limit);
    return `/products?${params.toString()}`;
  },
      keepUnusedDataFor: 30, // cache for 30s
      refetchOnMountOrArgChange: true,
      providesTags: (result) =>
        result
          ? [
              ...result.products.map((product) => ({
                type: "Products",
                id: product.id || product._id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
  }),
});

export const { useGetProductsQuery } = productsApiSlice;
