import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar, FaRegStar, FaStarHalfAlt, FaHeart, FaArrowLeft } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useCart } from "../context/CartContext"; 
import { useTheme } from "../context/ThemeContext";
import { getBackendUrl } from "../services/api";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { darkMode } = useTheme();

  // ⭐ Render stars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-500" />);
      else if (rating >= i - 0.5)
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${getBackendUrl()}/api/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load product details!");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className={`flex justify-center items-center min-h-screen`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );

  if (!product)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-600">
        <p>❌ Product not found</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );

  const discountedPrice = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price.toFixed(2);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? "Removed from Favorites" : "Added to Favorites");
  };
  
  const handleAddToCart = () => {
    const alreadyInCart = cart.some((item) => item.productId?._id === product._id);
    if (alreadyInCart) {
      toast.error("This product is already in your cart!");
      return;
    }

    addToCart(product, 1);
  };

  return (
    <div className={`min-h-screen py-18 px-4 ${darkMode?"bg-black/10":"bg-gray-50"}`}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:underline mb-6"
      >
        <FaArrowLeft className="mr-2" /> Back to Products
      </button>

      <div
        className={`max-w-6xl mx-auto rounded-2xl shadow-lg overflow-hidden 
                   grid grid-cols-1 md:grid-cols-2 gap-6 p-6 ${darkMode?"bg-black":"bg-white"}`}
      >
        {/* Left — Image Section */}
        <div className={`relative flex justify-center items-center rounded-xl ${darkMode?"bg-gray-700":"bg-gray-100"}`}>
          <img
            src={
              product.image ||
              (product.images && product.images.length > 0
                ? product.images[0]
                : "/placeholder.jpg")
            }
            alt={product.name}
            className="object-contain h-[400px] w-full p-4"
          />
          {/* Favorite Button */}
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 text-3xl transition-transform duration-300 hover:scale-110"
          >
            <FaHeart
              className={`${isFavorite ? "text-red-500" : "text-gray-300"
                } drop-shadow-[0_0_6px_rgba(0,0,0,0.5)]`}
            />
          </button>
        </div>

        {/* Right — Info Section */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className={`text-2xl font-bold mb-2 ${darkMode?"text-white":"text-gray-800"}`}>
              {product.name}
            </h1>
            <p className={`text-sm mb-3 ${darkMode?"text-white":"text-gray-500"}`}>
              <span className="font-medium">Brand:</span> {product.brand || "Unknown"}
            </p>

            {/* ⭐ Rating */}
            <div className="flex items-center gap-1 mb-3">
              {renderStars(product.rating)}
              <span className="text-gray-600 text-sm ml-1">
                ({product.rating?.toFixed(2) || "0.00"})
              </span>
            </div>

            {/* 💰 Price */}
            <div className="mb-3">
              {product.discountPercentage > 0 ? (
                <>
                  <span className="text-gray-400 line-through text-lg">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-2xl font-bold text-green-600 ml-2">
                    ${discountedPrice}
                  </span>
                  <span className="text-sm text-green-500 ml-2">
                    ({product.discountPercentage}% off)
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-green-600">
                  ${discountedPrice}
                </span>
              )}
            </div>

            {/* 📝 Description */}
            <p className={`leading-relaxed mb-4 ${darkMode?"text-white/70":"text-gray-700"}`}>
              {product.description || "No description available."}
            </p>

            {/* 📦 Stock */}
            <p className={`text-sm font-medium mb-4 ${darkMode?"text-white":"text-gray-700"}`}>
              Stock:{" "}
              <span
                className={`font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-red-500"
                  }`}
              >
                {product.stock > 0 ? product.stock : "Out of Stock"}
              </span>
            </p>
          </div>

          {/* 🛒 Buttons */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-md ${product.stock > 0
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-indigo-600 hover:to-blue-600 focus:ring-2 focus:ring-blue-300"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            <button
              onClick={toggleFavorite}
              className="px-6 py-3 rounded-lg font-semibold text-sm border border-red-400 text-red-500 hover:bg-red-50 transition-all"
            >
              {isFavorite ? "Remove Favorite" : "Add to Favorite"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;