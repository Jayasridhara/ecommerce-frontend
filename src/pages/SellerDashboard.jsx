import React, { useState, useEffect } from 'react';
import { fetchSellerProducts, createProducts, updateProducts, deleteProducts } from '../Services/productServices'
import { Edit, Trash2, PlusCircle, Search } from 'lucide-react';
import { Link } from 'react-router';

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', price: '', color: '', productType: '', description: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchSellerProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleCategory = (e) => setCategory(e.target.value);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (category === 'All' || p.productType === category)
  );

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProducts(editingProduct._id, formData);
      } else {
        await createProducts(formData);
      }
      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', price: '', color: '', productType: '', description: '' });
      loadProducts();
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProducts(id);
    loadProducts();
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsModalOpen(true);
  };
console.log(products)
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <Link to={"/"} className="text-2xl font-semibold text-blue-600">Seller Dashboard</Link>
        <div className="space-x-8">
          <button className="text-gray-600 hover:text-blue-600">Dashboard</button>
          <button className="text-blue-600 font-medium border-b-2 border-blue-600">Products</button>
          <button className="text-gray-600 hover:text-blue-600">Orders</button>
          <button className="text-gray-600 hover:text-blue-600">Settings</button>
        </div>
      </nav>

      {/* Controls */}
      <div className="flex justify-between items-center px-8 py-6 bg-white shadow-sm mt-4 rounded-lg">
        <div className="flex items-center space-x-3">
          <Search className="text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="border rounded-lg px-3 py-2 w-64"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            className="border rounded-lg px-3 py-2"
            value={category}
            onChange={handleCategory}
          >
            <option>All</option>
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home</option>
          </select>
        </div>
        <button
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusCircle className="mr-2" /> Add Product
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 py-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-all">
            <img
              src={product.image || 'https://via.placeholder.com/200'}
              alt={product.name}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h2 className="font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-500 text-sm">{product.productType}</p>
            <p className="text-blue-600 font-semibold">${product.price}</p>
            <div className="flex justify-between mt-3">
              <button
                onClick={() => openEditModal(product)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Edit className="mr-1 w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="flex items-center text-sm text-red-600 hover:text-red-800"
              >
                <Trash2 className="mr-1 w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </h2>
            <form onSubmit={handleAddOrUpdate} className="space-y-3">
              {['name', 'price', 'color', 'productType', 'description'].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="border w-full px-3 py-2 rounded-lg"
                  value={formData[field]}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  required
                />
              ))}
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
