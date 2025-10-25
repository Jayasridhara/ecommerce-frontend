import React, { useEffect, useState } from "react";
import { getSellerReports, updateOrderStatusBySeller } from "../Services/orderServices";
import { X } from "lucide-react";
import defaultImage from "../assets/noimagefound.png";
import { toast } from "react-toastify";

export default function ReportSection({ onClose }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  
  // **NEW** — this state holds the status filter
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getSellerReports();
      const orders = res.orders || [];
      setReports(orders);
    } catch (err) {
      console.error("Error loading reports:", err);
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
        if (statusFilter !== "all" && newStatus !== statusFilter) {
        setStatusFilter("all");
        }
      setLoading(true);
      await updateOrderStatusBySeller(orderId, newStatus);
      toast.success(`Order status updated to "${newStatus}" successfully!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      loadReports();
    } catch (err) {
      console.error("Failed to update order status:", err);
      toast.error("Failed to update order status. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleAddress = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // **NEW** — filter the reports based on `statusFilter`
  const filteredReports = reports
    .map(order => ({
      ...order,
      cartItems: statusFilter === "all"
        ? order.cartItems
        : order.cartItems.filter(item => item.status === statusFilter)
    }))
    .filter(order => order.cartItems.length > 0);

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-600">📊 Order Reports</h2>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400 cursor-pointer"
          >
            <option value="all">All</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <button 
            className="flex items-center bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 transition cursor-pointer"
            onClick={onClose}
          >
            <X size={16} className="mr-1" /> Close
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading reports...</p>
      ) : error ? (
        <p className="text-red-600">Error: {error}</p>
      ) : filteredReports.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found for selected status.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block lg:block sm:block overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-blue-50 border-b">
                  <th className="py-2 px-4 text-left">Order ID</th>
                  <th className="py-2 px-4 text-left">Product</th>
                  <th className="py-2 px-4 text-left">Qty × PerUnit</th>
                  <th className="py-2 px-4 text-left">Image</th>
                  <th className="py-2 px-4 text-left">Buyer</th>
                  <th className="py-2 px-4 text-left">Amount</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Change Status</th>
                  <th className="py-2 px-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(order =>
                  order.cartItems.map((item, idx) => (
                    <React.Fragment key={order._id + "-" + idx}>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-2 px-4">{order._id}</td>
                        <td className="py-2 px-4">{item.name}</td>
                        <td className="py-2 px-4">{item.qty} × {item.price}</td>
                        <td className="py-2 px-4">
                          <img
                            src={item.image || defaultImage}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td
                          className="py-2 px-4 text-blue-600 cursor-pointer hover:underline"
                          onClick={() => toggleAddress(order._id)}
                        >
                          {order.buyer?.name || "N/A"} {expandedOrders[order._id] ? "▲" : "▼"}
                        </td>
                        <td className="py-2 px-4">${order.totalAmount}</td>
                        <td className="py-2 px-4 text-green-600 font-medium">{item.status}</td>
                        <td className="py-2 px-4">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="pending">Pending</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="py-2 px-4">{new Date(order.createdAt).toLocaleString()}</td>
                      </tr>

                      {expandedOrders[order._id] && (
                        <tr className="bg-gray-50 border-b">
                          <td colSpan={9} className="py-2 px-4 text-gray-700">
                            <strong>Buyer Name:</strong> {order.buyer?.name || "N/A"} <br />
                            <strong>Buyer Email:</strong> {order.buyer?.email || "N/A"} <br />
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

          {/* Mobile Grid View */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:hidden">
            {filteredReports.map(order =>
              order.cartItems.map((item, idx) => (
                <div key={order._id + "-" + idx} className="border rounded-xl p-3 shadow-sm bg-white">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <p>Order ID:</p><p>{order._id}</p>
                  </div>
                  <div className="flex gap-3 mt-2">
                    <img src={item.image || defaultImage} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-gray-600 text-xs">{item.qty} × {item.price}</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-700 space-y-1">
                    <p><strong>Buyer:</strong> {order.buyer?.name || "N/A"}</p>
                    <p><strong>Amount:</strong> ${order.totalAmount}</p>
                    <p><strong>Status:</strong> {item.status}</p>
                  </div>
                  <div className="mt-2">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full text-xs"
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                  <p className="mt-2 text-[11px] text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  <button
                    onClick={() => toggleAddress(order._id)}
                    className="mt-2 text-blue-600 text-xs underline"
                  >
                    {expandedOrders[order._1d] ? "Hide Details ▲" : "Show Details ▼"}
                  </button>
                  {expandedOrders[order._id] && (
                    <div className="mt-2 text-gray-700 text-xs bg-gray-50 rounded p-2">
                      <strong>Buyer Email:</strong> {order.buyer?.email || "N/A"} <br />
                      <strong>Shipping:</strong>{" "}
                      {order.shippingAddress
                        ? `${order.shippingAddress.fullName}, ${order.shippingAddress.addressLine1}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postalCode}, ${order.shippingAddress.country}, Phone: ${order.shippingAddress.phone}`
                        : "Not provided"}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
