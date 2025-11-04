import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import { useGetProductsQuery } from "../features/products/productsApiSlice.js";
import { useTheme } from "../context/ThemeContext";
import AOS from "aos";
import "aos/dist/aos.css";

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

  useEffect(() => {
    AOS.init({ duration: 700, easing: "ease-in-out", once: false });
  }, [darkMode]);

  const { data: responseData, isLoading, isError, error } = useGetProductsQuery({
    search,
    category,
    price_lt: priceLt,
  });

  const products = useMemo(() => {
    let items = responseData?.products || [];
    if (rating) {
      items = items.filter((item) => item.rating >= parseFloat(rating));
    }
    return items;
  }, [responseData, rating]);

  const hasNoResults = !isLoading && !isError && products.length === 0;
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
    setIsCleared(true);
    setTimeout(() => setIsCleared(false), 800);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-22 w-22 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div
      className={`sm:p-2 md:p-4 mt-15 min-h-screen transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-4 gap-3 mb-4 p-3 rounded-xl shadow border transition-colors duration-500 max-[640px]:grid-cols-3 max-[445px]:ml-2 max-[445px]:mr-2 max-[650px]:mx-2 ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        }`}
        data-aos="fade-down"
      >
        <div>
          <label
            className={`block font-medium text-sm mb-1 max-[445px]:text-[12px] ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Category
          </label>
          <select
            className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 transition-colors duration-100 max-[445px]:text-[12px] max-[445px]:px-1 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-blue-400"
                : "bg-white border-gray-300 text-gray-800 focus:ring-blue-500"
            }`}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className={`block text-sm font-medium mb-1 max-[445px]:text-[12px] ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Max Price
          </label>
          <input
            type="number"
            placeholder="Enter max price"
            className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 transition-colors duration-100 max-[445px]:text-[12px] max-[445px]:px-1 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-green-400"
                : "bg-white border-gray-300 text-gray-800 focus:ring-green-500"
            }`}
            value={priceLt}
            onChange={(e) => setPriceLt(e.target.value)}
          />
        </div>

        <div>
          <label
            className={`block font-medium text-sm mb-1 max-[445px]:text-[12px] ${
              darkMode ? "text-gray-200" : "text-gray-700"
            }`}
          >
            Minimum Rating
          </label>
          <select
            className={`w-full px-2 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 transition-colors duration-100 max-[445px]:text-[12px] max-[445px]:px-1 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-gray-100 focus:ring-yellow-400"
                : "bg-white border-gray-300 text-gray-800 focus:ring-yellow-500"
            }`}
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">All Ratings</option>
            <option value="4.5">4.5★ & above</option>
            <option value="4">4★ & above</option>
            <option value="3.5">3.5★ & above</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleClearFilters}
            className={`w-full px-2 py-2 text-sm font-medium rounded-md transition-colors duration-100 max-[445px]:text-[12px] max-[445px]:p-0 ${
              isCleared
                ? "bg-green-500 text-white"
                : darkMode
                ? "bg-gray-700 hover:bg-gray-600 text-gray-100"
                : "bg-cyan-400 hover:bg-cyan-500 text-gray-800"
            }`}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {isError && (
        <div
          className={`p-3 border rounded text-center transition-colors duration-500 ${
            darkMode
              ? "bg-red-900 text-red-200 border-red-700"
              : "bg-red-100 text-red-700 border-red-400"
          }`}
        >
          {error?.data?.message || "Failed to load products."}
        </div>
      )}

      {hasNoResults && (
        <div
          className={`p-3 border rounded text-center transition-colors duration-500 ${
            darkMode
              ? "bg-yellow-900 text-yellow-200 border-yellow-700"
              : "bg-yellow-100 text-yellow-700 border-yellow-400"
          }`}
        >
          No products found for your filters.
        </div>
      )}

      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-[445px]:ml-2 max-[445px]:mr-2 max-[650px]:grid-cols-1 min-[580px]:grid-cols-2 max-[650px]:mx-2"
        data-aos="fade-up"
      >
        {products.map((product) => (
          <ProductCard
            key={product.id || product._id}
            product={product}
            onAddToCart={addToCart}
            onViewProduct={(id) => navigate(`/product/${id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;