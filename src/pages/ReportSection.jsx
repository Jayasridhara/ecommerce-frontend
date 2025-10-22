import React, { useEffect, useState } from "react";
import { getSellerReports, updateOrderStatusBySeller } from "../Services/orderServices";

export default function ReportSection({ onClose }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({}); // Track expanded rows

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSellerReports();
      const orders = res.orders || [];
      const succeeded = orders.filter((o) => o.status === "paid");
      setReports(succeeded);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await updateOrderStatusBySeller(orderId, newStatus);
      loadReports();
    } catch (err) {
      console.error("Failed to update order status:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAddress = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-600">
          📊 Order Reports (Succeeded)
        </h2>
        <button className="text-red-600 hover:underline" onClick={onClose}>
          Close
        </button>
      </div>

      {loading ? (
        <p>Loading reports...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : reports.length === 0 ? (
        <p className="text-gray-500 text-center">No successful orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-50 border-b">
                <th className="py-2 px-4 text-left">Order ID</th>
                <th className="py-2 px-4 text-left">Product</th>
                <th className="py-2 px-4 text-left">Quantity<br/>XPerUnit</th>
                <th className="py-2 px-4 text-left">Image</th>
                <th className="py-2 px-4 text-left">Buyer Name</th>
                <th className="py-2 px-4 text-left">Amount</th>
                <th className="py-2 px-4 text-left">Status</th>
                <th className="py-2 px-4 text-left">Change Status</th>
                <th className="py-2 px-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((order) =>
                order.cartItems.map((item, idx) => (
                  <React.Fragment key={order._id + "-" + idx}>
                    <tr className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{order._id}</td>
                      <td className="py-2 px-4">{item.name}</td>
                      <td className="py-2 px-4">{item.qty}X{item.price}</td>
                      <td className="py-2 px-4">
                        <img
                          src={item.image || "https://via.placeholder.com/60"}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      </td>
                      <td
                        className="py-2 px-4 text-blue-600 cursor-pointer hover:underline"
                        onClick={() => toggleAddress(order._id)}
                      >
                        {order.buyer.name} {expandedOrders[order._id] ? "▲" : "▼"}
                      </td>
                      <td className="py-2 px-4">${order.totalAmount}</td>
                      <td className="py-2 px-4 text-green-600 font-medium">
                        {item.status}
                      </td>
                      <td className="py-2 px-4">
                        <select
                          value={item.status}
                          onChange={(e) =>
                            handleStatusUpdate(order._id, e.target.value)
                          }
                          className="border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="py-2 px-4">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                    </tr>

                    {/* Shipping Address Row */}
                    {expandedOrders[order._id] && (
                      <tr className="bg-gray-50 border-b">
                        <td colSpan={8} className="py-2 px-4 text-gray-700">
                          <strong>Shipping Address:</strong>{" "}
                          {order.shippingAddress
                            ? `${order.shippingAddress.fullName}, ${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}, Phone: ${order.shippingAddress.phone}`
                            : "Not provided"}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
