import React, { useState } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPercentage: '',
    rating: '',
    stock: '',
    brand: '',
    category: '',
    image: '',
    images: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminAPI.addProduct(formData);
      toast.success('✅ Product added successfully!');
      navigate('/admin/products');
    } catch {
      toast.error('❌ Failed to add product');
    }
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start px-4 sm:px-8 py-10 transition-all duration-500 ${
        darkMode
          ? 'bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#2a2a2a]'
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
    >
      {/* Card Container */}
      <div
        className={`w-full max-w-4xl p-6 sm:p-10 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 mt-15 ${
          darkMode
            ? 'bg-black/60 border-yellow-600/40 shadow-[0_0_25px_rgba(255,215,0,0.2)]'
            : 'bg-white/60 border-gray-200'
        }`}
      >
       {/* Title */}
      <div className="flex flex-wrap justify-between items-center mb-6 max-[500px]:flex-col max-[500px]:gap-3">
        <h2
          className={`font-bold transition-all duration-300
            text-3xl max-[800px]:text-2xl max-[500px]:text-xl max-[400px]:text-lg
            ${
              darkMode
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_6px_rgba(255,215,0,0.6)]'
                : 'bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-transparent'
            }`}
        >
          Add New Product
        </h2>

          <button
            onClick={() => navigate('/admin/products')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg shadow-md hover:scale-105 transition-transform
              max-[500px]:w-full max-[400px]:text-xs
              ${
                darkMode
                  ? 'bg-gradient-to-r from-yellow-600 to-yellow-800 text-black font-bold shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.6)]'
                  : 'bg-gradient-to-r from-gray-700 to-gray-900 text-white'
              }`}
          >
            ← Back to Products
          </button>
        </div>

       {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 max-[700px]:gap-4 max-[500px]:gap-3"
        >
          {[
            'name',
            'description',
            'price',
            'discountPercentage',
            'rating',
            'stock',
            'brand',
            'category',
            'image',
            'images',
          ].map((field) => (
            <div key={field} className="flex flex-col max-[500px]:col-span-2">
              <label
                htmlFor={field}
                className={`mb-1 ml-1 text-sm font-medium max-[600px]:text-xs max-[400px]:text-[11px]
                  ${
                    darkMode
                      ? 'text-yellow-300/90'
                      : 'text-gray-700'
                  }`}
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                id={field}
                name={field}
                type={
                  ['price', 'stock', 'discountPercentage', 'rating'].includes(field)
                    ? 'number'
                    : 'text'
                }
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                className={`p-3 rounded-lg border focus:ring-2 outline-none shadow-sm transition-all duration-300
                  text-sm max-[600px]:p-2 max-[500px]:text-xs max-[400px]:p-1.5
                  ${
                    darkMode
                      ? 'bg-[#1c1c1c]/80 border-yellow-700/40 text-yellow-100 placeholder-yellow-500/60 focus:ring-yellow-400'
                      : 'bg-white/70 border-gray-300 focus:ring-indigo-400'
                  }`}
              />
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`col-span-2 py-3 font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 shadow-md
              text-sm max-[500px]:py-2 max-[500px]:text-xs max-[400px]:w-full
              ${
                darkMode
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold shadow-[0_0_20px_rgba(255,215,0,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.7)]'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
              }`}
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddProduct;
