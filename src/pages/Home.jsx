import React, { useState, useEffect, useMemo, Suspense, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useGetProductsQuery } from "../features/products/productsApiSlice";
import { Listbox, Portal } from "@headlessui/react";
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

  const ratings = [
    { label: "All", value: "" },
    { label: "Above 4.5★", value: "gte:4.5" },
    { label: "Above 4★", value: "gte:4" },
    { label: "Above 3.5★", value: "gte:3.5" },
    { label: "Below 3.5★", value: "lt:3.5" },
    { label: "Below 3★", value: "lt:3" },
  ];

  // Animate on scroll
  useEffect(() => {
    AOS.init({ duration: 700, easing: "ease-in-out", once: false });
  }, [darkMode]);

  // Fetch data
  const {
    data: responseData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetProductsQuery(
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
        const combined =
          page === 1
            ? responseData.products
            : [...prev, ...responseData.products];
        const unique = Array.from(
          new Map(
            combined.map((item) => [item._id || item.id, item])
          ).values()
        );
        return unique;
      });
    }
  }, [responseData]);

  // Category and filter lists
  const categories = [
    { label: "All", value: "" },
    { label: "Smartphones", value: "smartphones" },
    { label: "Laptops", value: "laptops" },
    { label: "Fragrances", value: "fragrances" },
    { label: "Skincare", value: "skincare" },
    { label: "Groceries", value: "groceries" },
    { label: "Home Decoration", value: "home-decoration" },
    { label: "Furniture", value: "furniture" },
    { label: "Tops", value: "tops" },
    { label: "Womens Dresses", value: "womens-dresses" },
    { label: "Mens Shirts", value: "mens-shirts" },
    { label: "Mens Watches", value: "mens-watches" },
    { label: "Womens Jewellery", value: "womens-jewellery" },
    { label: "Sunglasses", value: "sunglasses" },
    { label: "Automotive", value: "automotive" },
    { label: "Lighting", value: "lighting" },
    { label: "Beauty", value: "beauty" },
    { label: "Wearables", value: "wearables" },
    { label: "Sports Accessories", value: "sports-accessories" },
    { label: "Kitchen Accessories", value: "kitchen-accessories" },
  ];

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

  // Refs for portal dropdown positioning
  const categoryBtnRef = useRef(null);
  const ratingBtnRef = useRef(null);

  const [dropdownCoords, setDropdownCoords] = useState({
  category: null,
  rating: null,
});

// 🧭 Automatically update dropdown position/width on resize or scroll
useEffect(() => {
  const updatePositions = () => {
    if (categoryBtnRef.current) {
      const rect = categoryBtnRef.current.getBoundingClientRect();
      setDropdownCoords((prev) => ({
        ...prev,
        category: {
          top: rect.bottom + 6,
          left: rect.left,
          width: rect.width,
        },
      }));
    }
    if (ratingBtnRef.current) {
      const rect = ratingBtnRef.current.getBoundingClientRect();
      setDropdownCoords((prev) => ({
        ...prev,
        rating: {
          top: rect.bottom + 6,
          left: rect.left,
          width: rect.width,
        },
      }));
    }
  };

  // Run once initially and whenever window resizes or scrolls
  setTimeout(updatePositions, 900);
  window.addEventListener("resize", updatePositions);
  window.addEventListener("scroll", updatePositions, true);

  return () => {
    window.removeEventListener("resize", updatePositions);
    window.removeEventListener("scroll", updatePositions, true);
  };
}, []);

useEffect(() => {
  setTimeout(() => {
    categoryBtnRef.current?.blur();
    ratingBtnRef.current?.blur();
  }, 300);
}, []);


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
        <div className="flex-1 min-w-[120px] max-[650px]:min-w-[90px] max-[384px]:min-w-[70px]">
          <label
            className={`block text-xs font-medium mb-1 ${
              darkMode ? "text-gray-300" : "text-blue-700"
            }`}
          >
            Category
          </label>
          <Listbox
            value={category}
            onChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
          >
            <div className="relative">
              <Listbox.Button
                ref={categoryBtnRef}
                className={`w-full py-1.5 px-2 text-xs border rounded-md ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {categories.find((c) => c.value === category)?.label || "All"}
              </Listbox.Button>

              <Portal>
                <Listbox.Options
                  className={`absolute mt-1 w-[${categoryBtnRef.current?.offsetWidth || "100%"}px] rounded-lg shadow-lg z-[9999] max-h-48 overflow-auto ${
                    darkMode
                      ? "bg-gray-800 text-gray-100"
                      : "bg-white text-gray-800"
                  }`}
                 style={{
                  position: "fixed",
                  top: dropdownCoords.category?.top || 0,
                  left: dropdownCoords.category?.left || 0,
                  width: dropdownCoords.category?.width || "150px",
                }}

                >
                  {categories.map((item) => (
                    <Listbox.Option
                      key={item.value}
                      value={item.value}
                      className={({ active }) =>
                        `cursor-pointer select-none py-1 px-2 text-xs ${
                          active
                            ? darkMode
                              ? "bg-blue-600 text-white"
                              : "bg-blue-200 text-black"
                            : ""
                        }`
                      }
                    >
                      {item.label}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Portal>
            </div>
          </Listbox>
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
            className={`w-full px-2 py-1 text-xs rounded-md border-2 focus:outline-none transition-all duration-200
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
          <Listbox value={rating} onChange={setRating}>
            <div className="relative">
              <Listbox.Button
                ref={ratingBtnRef}
                className={`w-full py-1.5 px-2 text-xs border rounded-md ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-white border-gray-300 text-gray-800"
                }`}
              >
                {ratings.find((r) => r.value === rating)?.label || "All"}
              </Listbox.Button>

              <Portal>
                <Listbox.Options
                  className={`absolute mt-1 rounded-lg shadow-lg z-[9999] max-h-48 overflow-auto ${
                    darkMode
                      ? "bg-gray-800 text-gray-100"
                      : "bg-white text-gray-800"
                  }`}
                  style={{
                    position: "fixed",
                    top: dropdownCoords.rating?.top || 0,
                    left: dropdownCoords.rating?.left || 0,
                    width: dropdownCoords.rating?.width || "150px",
                  }}

                >
                  {ratings.map((item) => (
                    <Listbox.Option
                      key={item.value}
                      value={item.value}
                      className={({ active }) =>
                        `cursor-pointer select-none py-1 px-2 text-xs ${
                          active
                            ? darkMode
                              ? "bg-yellow-600 text-white"
                              : "bg-yellow-300 text-black"
                            : ""
                        }`
                      }
                    >
                      {item.label}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Portal>
            </div>
          </Listbox>
        </div>

        {/* Clear Button */}
        <div className="flex items-end mt-4.5">
          <button
            onClick={handleClearFilters}
            className={`px-1 py-1.5 text-xs font-bold rounded-md transition-all duration-200 w-20 max-[366px]:w-15
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
        className="grid max-[640px]:grid-cols-2 max-[640px]:gap-3 max-[640px]:mx-2 max-[600px]:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 max-[650px]:grid-cols-1 max-[400px]:mx-4"
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
