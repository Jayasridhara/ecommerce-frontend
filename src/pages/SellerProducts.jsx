
import { useState } from "react";
import { useEffect } from "react";
import { deleteProducts, fetchSellerProducts } from "../Services/productServices";

import { useNavigate } from "react-router";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const list = await fetchSellerProducts();
        setProducts(list);
      } catch (err) {
        console.error("Could not fetch seller products", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    try {
      await deleteProducts(id);
      // remove from UI
      setProducts(products.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (loading) {
    return <div>Loading your products...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">My Products</h2>
        <button
          onClick={() => navigate("product/new")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add New Product
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const pid = product._id || product.id;
          return (
            <div key={pid} className="border p-4 rounded shadow">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover mb-2"
              />
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600 mb-2">${product.price}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`product/${pid}/edit`)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(pid)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
