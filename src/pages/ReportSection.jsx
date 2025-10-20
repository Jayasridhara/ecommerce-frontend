import React, { useEffect, useState } from "react";

import { getSellerReports, updateOrderStatusBySeller } from "../Services/orderServices";

export default function ReportSection({ onClose }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

const handleStatusUpdate=async(orderId,newStatus)=>{
  try{
    console.log("Updating order:",orderId,"to status:",newStatus);
    setLoading(true);
    const res=await updateOrderStatusBySeller(orderId,newStatus);
    
    console.log("Status update response:",res);
    //refresh reports
    loadReports();
  }catch(err){
    console.error("Failed to update order status:",err);
  }finally{
    setLoading(false);
  }
}



  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-blue-600">
          📊 Order Reports (Succeeded)
        </h2>
        <button
          className="text-red-600 hover:underline"
          onClick={onClose}
        >
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
                  <tr
                    key={order._id + "-" + idx}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-2 px-4">{order._id}</td>
                    <td className="py-2 px-4">{item.name}</td>
                    <td className="py-2 px-4">
                      <img
                        src={item.image || "https://via.placeholder.com/60"}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    </td>
                    <td className="py-2 px-4">{order.buyer.name}</td>
                    <td className="py-2 px-4">${order.totalAmount}</td>
                    <td className="py-2 px-4 text-green-600 font-medium">
                      {item.status}
                    </td>
                    <td className="py-2 px-4">
                      <select value={item.status} onChange={(e)=>handleStatusUpdate(order._id,e.target.value)} className="border border-gray-300 rounded px-2 py-1">
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                       
                      </select>
                    </td>

                    <td className="py-2 px-4">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
