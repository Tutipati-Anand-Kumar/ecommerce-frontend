import React, { useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt, FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const ProductCard = ({ product, onAddToCart, onViewProduct }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [favorites, setFavorites] = useState({});
  const { darkMode } = useTheme();

  const navigate = useNavigate();

  // ⭐ Stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-300" />);
    }
    return stars;
  };

  const imageSrc =
    product.thumbnail ||
    product.image ||
    (Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "/placeholder.jpg");

  const discountedPrice = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price.toFixed(2);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      data-aos="fade-up"
      className={`rounded-2xl overflow-hidden flex flex-col w-full max-w-[380px] mx-auto 
        min-h-[520px] sm:min-h-[480px] transition-all duration-300 hover:-translate-y-2
        ${
          darkMode
            ? "bg-[rgba(20,30,50,0.95)] text-gray-100 shadow-[0_0_15px_rgba(0,255,255,0.15)] hover:shadow-[0_0_25px_rgba(0,255,255,0.25)]"
            : "bg-white text-gray-800 shadow-md hover:shadow-lg"
        }`}
    >
      {/* Image */}
      <div
        className={`relative cursor-pointer group flex justify-center items-center h-72 ${
          darkMode ? "bg-[rgba(255,255,255,0.05)]" : "bg-gray-50"
        }`}
        onClick={() => onViewProduct?.(product.id || product._id)}
      >
        <img
          src={imageSrc}
          alt={product.title || product.name}
          loading="lazy"
          className="object-contain h-full w-auto group-hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id || product._id);
          }}
          className="absolute top-3 right-3 text-2xl transition-transform duration-300 hover:scale-110"
        >
          <FaHeart
            className={`${
              favorites[product.id || product._id]
                ? "text-red-500"
                : darkMode
                ? "text-gray-400"
                : "text-gray-200"
            } drop-shadow-[0_0_4px_rgba(0,0,0,0.6)]`}
          />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col grow px-4 py-3">
        <h2
          className={`text-lg font-semibold mb-1 line-clamp-1 ${
            darkMode ? "text-gray-100" : "text-gray-800"
          }`}
        >
          {product.title || product.name}
        </h2>

        <p
          className={`mb-2 text-sm transition-all duration-300 ${
            darkMode ? "text-gray-300" : "text-gray-600"
          } ${showFullDesc ? "max-h-16 overflow-y-auto" : "line-clamp-2"}`}
        >
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="px-0 py-1 text-sm font-semibold bg-gradient-to-r 
              from-blue-500 to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-all duration-300"
          >
            {showFullDesc ? "Show Less" : "Show More"}
          </button>

          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            <span className="font-medium">Brand:</span>{" "}
            {product.brand || "Unknown"}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2 min-w-0">
          <div className="flex items-center gap-1 min-w-0">
            {renderStars(product.rating)}
            <span className={`text-sm ml-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              ({product.rating?.toFixed(2) || "0.00"})
            </span>
          </div>

          <div className="text-right min-w-[100px] shrink-0">
            {product.discountPercentage > 0 ? (
             <div className="md:flex md:flex-col lg:flex lg:flex-row items-end gap-1"> 
                <span
                  className={`line-through text-sm ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  } truncate sm:max-w-full`} 
                >
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-base font-bold text-green-500">
                  ${discountedPrice}
                </span>
            </div>
            ) : (
              <span className="text-base font-bold text-green-500">
                ${discountedPrice}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-green-400 text-right mt-1">
          {product.discountPercentage > 0 && `(${product.discountPercentage}% off)`}
        </p>

        <div className="flex items-center justify-between mt-3">
          <p
            className={`flex items-center text-sm font-medium ${
              darkMode ? "text-green-400" : "text-green-600"
            }`}
          >
            🛒 Stock:
            <span
              className={`ml-1 font-semibold ${
                product.stock > 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {product.stock > 0 ? product.stock : "Out of Stock"}
            </span>
          </p>

          <button
            onClick={() => onAddToCart?.(product.id || product._id, 1)}
            disabled={product.stock <= 0}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 shadow-md ${
              product.stock > 0
                ? darkMode
                  ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500"
                  : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-indigo-600 hover:to-blue-600"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;