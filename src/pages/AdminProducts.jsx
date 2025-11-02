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
    <div className={`min-h-screen p-6 ${darkMode?"bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white":"bg-white text-amber-50"}`}>
      <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-white/20">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            🛠️ Manage Products
          </h2>

          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 border border-white/20 transition-all duration-200"
            >
              ⬅️ Back
            </button>
            <Link
              to="/admin/add-product"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold shadow transition-all duration-200"
            >
              + Add Product
            </Link>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto rounded-xl border border-white/20">
          <table className="min-w-full text-sm text-gray-200">
            <thead className={`bg-white/10 ${darkMode?"text-white":"text-black"} uppercase text-xs`}>
              <tr>
                <th className="px-4 py-3 text-left w-[8%]">ID</th>
                <th className="px-4 py-3 text-left w-[20%]">Name</th>
                <th className="px-4 py-3 text-left w-[10%]">Price</th>
                <th className="px-4 py-3 text-left w-[10%]">Stock</th>
                <th className="px-4 py-3 text-left w-[10%]">Discount</th>
                <th className="px-4 py-3 text-center w-[20%]">Actions</th>
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
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-700 hover:from-yellow-600 hover:to-yellow-800 transition-all duration-200"
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
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-[90%] max-w-2xl">
            <h3 className="text-2xl font-semibold mb-6 text-center text-white">
              ✏️ Edit Product
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4 text-white">
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Product Name"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="Price"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                value={formData.stock || ''}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="Stock"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="Category"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description"
                className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-blue-400"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 font-semibold text-white transition-all duration-200"
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
