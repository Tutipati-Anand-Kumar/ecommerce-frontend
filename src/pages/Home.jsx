import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useGetProductsQuery } from "../features/products/productsApiSlice";
import AOS from "aos";
import "aos/dist/aos.css";

const ProductCard = React.lazy(() => import("../components/ProductCard"));

const Home = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { darkMode } = useTheme();
  const [category, setCategory] = useState("");
  const [priceLt, setPriceLt] = useState("");
  const [rating, setRating] = useState("");
  const [isCleared, setIsCleared] = useState(false);
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);

  // Animate on scroll
  useEffect(() => {
    AOS.init({ duration: 700, easing: "ease-in-out", once: false });
  }, [darkMode]);

  // Fetch data
  const { data: responseData, isLoading, isFetching, isError, refetch } = useGetProductsQuery(
    { search, category, price_lt: priceLt, rating, page, limit: 12 },
    { refetchOnMountOrArgChange: true }
  );

  // Filter locally by rating
  const products = useMemo(() => {
    let items = responseData?.products || [];
    if (rating) {
      const [op, value] = rating.split(":");
      const num = parseFloat(value);
      if (op === "gte") items = items.filter((i) => i.rating >= num);
      else if (op === "lt") items = items.filter((i) => i.rating < num);
    }
    return items;
  }, [responseData, rating]);

  // Combine and remove duplicates
  useEffect(() => {
    if (responseData?.products) {
      setAllProducts((prev) => {
        const combined = page === 1 ? responseData.products : [...prev, ...responseData.products];
        const unique = Array.from(new Map(combined.map((item) => [item._id || item.id, item])).values());
        return unique;
      });
    }
  }, [responseData]);

  // Category and filter lists
  const categories = useMemo(
    () => [
      "smartphones", "laptops", "fragrances", "skincare", "groceries",
      "home-decoration", "furniture", "tops", "womens-dresses", "womens-shoes",
      "mens-shirts", "mens-shoes", "mens-watches", "womens-watches",
      "womens-bags", "womens-jewellery", "sunglasses", "automotive",
      "motorcycle", "lighting", "kitchen-accessories", "sports-accessories",
      "mobile-accessories", "beauty", "tablets", "wearables",
    ],
    []
  );

  const handleClearFilters = () => {
    setCategory("");
    setPriceLt("");
    setRating("");
    setPage(1);
    setIsCleared(true);
    setTimeout(() => setIsCleared(false), 800);
    refetch();
  };

  const hasNoResults = !isLoading && !isError && products.length === 0;

  return (
    <div
      className={`sm:p-2 md:p-4 mt-15 min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Filters */}
<div
  className={`flex flex-wrap justify-between items-center gap-2 mb-4 p-3 rounded-xl shadow border transition-colors duration-500
    ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
    max-[650px]:mx-3 max-[650px]:px-2 max-[650px]:py-2 max-[650px]:gap-1`}
  data-aos="fade-down"
>
  {/* Category */}
  <div className="flex-1 min-w-[120px] max-[650px]:min-w-[90px]">
    <label
      className={`block text-xs font-medium mb-1 ${
        darkMode ? "text-gray-300" : "text-blue-700"
      }`}
    >
      Category
    </label>
    <select
      className={`w-full px-2 py-1 text-xs rounded-md border focus:outline-none transition-all duration-200
        ${
          darkMode
            ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-400"
            : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
        }`}
      value={category}
      onChange={(e) => {
        setCategory(e.target.value);
        setPage(1);
      }}
    >
      <option value="">All</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
        </option>
      ))}
    </select>
  </div>

  {/* Max Price */}
  <div className="flex-1 min-w-[100px] max-[650px]:min-w-[80px]">
    <label
      className={`block text-xs font-medium mb-1 ${
        darkMode ? "text-gray-300" : "text-green-700"
      }`}
    >
      Max Price
    </label>
    <input
      type="number"
      placeholder="Enter max"
      className={`w-full px-2 py-1 text-xs rounded-md border focus:outline-none transition-all duration-200
        ${
          darkMode
            ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-green-400"
            : "bg-white border-gray-300 text-gray-800 focus:border-green-500"
        }`}
      value={priceLt}
      onChange={(e) => {
        setPriceLt(e.target.value);
        setPage(1);
      }}
    />
  </div>

  {/* Rating */}
<div className="flex-1 min-w-[100px] max-[650px]:min-w-[80px]">
  <label
    className={`block text-xs font-medium mb-1 ${
      darkMode ? "text-gray-300" : "text-yellow-700"
    }`}
  >
    Rating
  </label>
  <select
    className={`w-full px-2 py-1 text-xs rounded-md border focus:outline-none transition-all duration-200
      ${
        darkMode
          ? "bg-gray-700 border-gray-600 text-gray-100 focus:border-yellow-400"
          : "bg-white border-gray-300 text-gray-800 focus:border-yellow-500"
      }`}
    value={rating}
    onChange={(e) => setRating(e.target.value)}
  >
    <option value="">All</option>
    <option value="gte:4.5">Above 4.5★</option>
    <option value="gte:4">Above 4★</option>
    <option value="gte:3.5">Above 3.5★</option>
    <option value="lt:3.5">Below 3.5★</option>
    <option value="lt:3">Below 3★</option>
  </select>
</div>

  {/* Clear Button */}
  <div className="flex items-end mt-3.5">
    <button
      onClick={handleClearFilters}
      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all duration-200 w-20
        ${
          isCleared
            ? "bg-green-500 text-white"
            : darkMode
            ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
            : "bg-cyan-500 hover:bg-cyan-600 text-white"
        }`}
    >
      Clear
    </button>
  </div>
</div>

      {/* Spinner while loading */}
      {(isLoading || isFetching) && (
        <div className="flex justify-center items-center my-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* No results */}
      {hasNoResults && (
        <div className="p-3 text-center text-yellow-500 border rounded bg-yellow-100 border-yellow-400">
          No products found for your filters.
        </div>
      )}

      {/* Product Grid */}
      <div
        className="grid max-[640px]:grid-cols-2 max-[640px]:gap-3 max-[640px]:mx-2 max-[600px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-[650px]:grid-cols-1 max-[400px]:mx-2"
        data-aos="fade-up"
      >
        <Suspense
          fallback={
            <div className="flex justify-center items-center my-10">
              <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        >
          {allProducts.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
              onAddToCart={addToCart}
              onViewProduct={(id) => navigate(`/product/${id}`)}
            />
          ))}
        </Suspense>
      </div>

      {/* Load More */}
      {responseData?.currentPage < responseData?.totalPages && (
        <div className="flex justify-center my-6">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isFetching}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 disabled:opacity-50"
          >
            {isFetching ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
