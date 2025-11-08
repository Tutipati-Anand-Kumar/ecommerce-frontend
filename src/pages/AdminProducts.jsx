import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const navigate = useNavigate();
  const {darkMode}  = useTheme();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getProducts();
      setProducts(data.products);
    } catch {
      toast.error('Failed to load products');
    }
    setLoading(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product.externalId);
    setFormData({ ...product, images: product.images?.join(',') });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.updateProduct(editingProduct, formData);
      toast.success('Product updated successfully!');
      setEditingProduct(null);
      fetchProducts();
    } catch {
      toast.error('Failed to update product');
    }
  };

  const handleDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    try {
      await adminAPI.deleteProduct(deleteConfirm.id);
      toast.success('Product deleted!');
      fetchProducts();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleteConfirm({ show: false, id: null });
    }
  };

  const cancelDelete = () => setDeleteConfirm({ show: false, id: null });

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className={`min-h-screen p-6 max-[500px]:p-3 ${darkMode?"bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white":"bg-white text-amber-50"}`}>
     <div
  className={`mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 mt-15 
  p-6 max-[800px]:p-4 max-[500px]:p-2 
  w-full max-w-[1400px] overflow-hidden`}
>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 max-[400px]:mb-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent max-[400px]:text-2xl">
            🛠️ Manage Products
          </h2>

          <div className="flex gap-3 mt-4 sm:mt-0 max-[400px]:mt-3 max-[400px]:w-[238px] justify-around max-[640px]:w-[297px]">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 border border-white/20 transition-all duration-200 max-[400px]:px-2 max-[400px]:py-0"
            >
              ⬅️ Back
            </button>
            <Link
              to="/admin/add-product"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow transition-all duration-200 max-[400px]:px-2"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto rounded-xl border border-white/20 w-full max-w-full">
          <table className="w-full table-auto text-sm text-gray-200">
            <thead className={`bg-white/10 ${darkMode?"text-white":"text-black"} uppercase text-xs`}>
              <tr>
                <th className="px-4 py-3 text-left w-[8%]">ID</th>
                <th className="px-4 py-3 text-left w-[20%]">Name</th>
                <th className="px-4 py-3 text-left w-[10%]">Price</th>
                <th className="px-4 py-3 text-left w-[10%]">Stock</th>
                <th className="px-4 py-3 text-left w-[10%]">Discount</th>
                <th className="px-4 py-3 text-center w-[10%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.externalId}
                  className={`border-t ${darkMode?"border-white/10":"border-black/50 text-black"} hover:bg-white/5 transition`}
                >
                  <td className="px-4 py-3">{p.externalId}</td>
                  <td className="px-4 py-3 font-semibold">{p.name}</td>
                  <td className="px-4 py-3">₹{p.price}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">{p.discountPercentage}%</td>
                  <td className="px-4 py-3 text-center flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(p)}
                      className="py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 transition-all duration-200 px-5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.externalId)}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {products.length === 0 && (
            <div className="text-center py-6 text-gray-400">
              No products available.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Popup */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl text-center max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Are you sure you want to delete this product?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold transition-all duration-200"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 font-semibold text-white transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Popup */}
{editingProduct && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4 max-[500px]:px-2">
    <div
      className={`w-full max-w-2xl rounded-2xl shadow-2xl p-8 max-[600px]:p-5 max-[450px]:p-4 border backdrop-blur-xl transition-all duration-500
        ${darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-gray-700"
          : "bg-gradient-to-br from-white via-gray-100 to-white border-gray-300"
        }`}
    >
      {/* Title */}
      <h3
        className={`text-center mb-6 font-bold text-3xl max-[700px]:text-2xl max-[500px]:text-xl 
          ${darkMode
            ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300"
            : "text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500"
          }`}
      >
        ✏️ Edit Product
      </h3>

      <form
        onSubmit={handleUpdate}
        className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-[500px]:gap-3 text-sm"
      >
        {/* Name */}
        <div className="flex flex-col col-span-2">
          <label className={`mb-1 font-medium ${darkMode ? "text-blue-300" : "text-gray-700"}`}>
            Product Name
          </label>
          <input
            type="text"
            value={formData.name || ""}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter product name"
            className={`p-3 rounded-lg border focus:ring-2 outline-none transition-all duration-300
              ${darkMode
                ? "bg-gray-800/80 border-blue-700/40 text-blue-100 placeholder-blue-400/60 focus:ring-cyan-400"
                : "bg-white border-gray-300 text-gray-800 focus:ring-indigo-400"
              }`}
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className={`mb-1 font-medium ${darkMode ? "text-green-300" : "text-gray-700"}`}>
            Price
          </label>
          <input
            type="number"
            value={formData.price || ""}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="Enter price"
            className={`p-3 rounded-lg border focus:ring-2 outline-none transition-all duration-300
              ${darkMode
                ? "bg-gray-800/80 border-green-700/40 text-green-100 placeholder-green-400/60 focus:ring-green-400"
                : "bg-white border-gray-300 text-gray-800 focus:ring-green-500"
              }`}
          />
        </div>

        {/* Stock */}
        <div className="flex flex-col">
          <label className={`mb-1 font-medium ${darkMode ? "text-yellow-300" : "text-gray-700"}`}>
            Stock
          </label>
          <input
            type="number"
            value={formData.stock || ""}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            placeholder="Enter stock quantity"
            className={`p-3 rounded-lg border focus:ring-2 outline-none transition-all duration-300
              ${darkMode
                ? "bg-gray-800/80 border-yellow-700/40 text-yellow-100 placeholder-yellow-400/60 focus:ring-yellow-400"
                : "bg-white border-gray-300 text-gray-800 focus:ring-yellow-500"
              }`}
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className={`mb-1 font-medium ${darkMode ? "text-purple-300" : "text-gray-700"}`}>
            Category
          </label>
          <input
            type="text"
            value={formData.category || ""}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Enter category"
            className={`p-3 rounded-lg border focus:ring-2 outline-none transition-all duration-300
              ${darkMode
                ? "bg-gray-800/80 border-purple-700/40 text-purple-100 placeholder-purple-400/60 focus:ring-purple-400"
                : "bg-white border-gray-300 text-gray-800 focus:ring-purple-500"
              }`}
          />
        </div>

        {/* Description */}
        <div className="flex flex-col col-span-2">
          <label className={`mb-1 font-medium ${darkMode ? "text-pink-300" : "text-gray-700"}`}>
            Description
          </label>
          <textarea
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter description"
            className={`p-3 rounded-lg border min-h-[100px] resize-y focus:ring-2 outline-none transition-all duration-300
              ${darkMode
                ? "bg-gray-800/80 border-pink-700/40 text-pink-100 placeholder-pink-400/60 focus:ring-pink-400"
                : "bg-white border-gray-300 text-gray-800 focus:ring-pink-500"
              }`}
          />
        </div>

        {/* Buttons */}
        <div className="col-span-2 flex justify-end gap-4 max-[500px]:flex-col max-[500px]:gap-2 mt-2">
          <button
            type="button"
            onClick={() => setEditingProduct(null)}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:scale-105
              max-[500px]:w-full
              ${darkMode
                ? "bg-gradient-to-r from-gray-600 to-gray-800 text-white hover:from-gray-500 hover:to-gray-700"
                : "bg-gradient-to-r from-gray-200 to-gray-400 text-gray-800 hover:from-gray-300 hover:to-gray-500"
              }`}
          >
            Cancel
          </button>

          <button
            type="submit"
            className={`px-6 py-2.5 rounded-lg font-semibold shadow-md hover:scale-105 transition-all duration-300
              max-[500px]:w-full
              ${darkMode
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500"
                : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600"
              }`}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default AdminProducts;