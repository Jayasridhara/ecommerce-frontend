import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { FiTruck, FiClock, FiCheckCircle, FiChevronDown } from "react-icons/fi";
import protectedInstance from "../instance/protectedInstance";
import Navbar from "../components/Navbar";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await protectedInstance.get("/orders/my");
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto py-20 text-center">
          <h2 className="text-3xl font-semibold mb-4">My Orders</h2>
          <div className="text-gray-500">You have no completed orders yet.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold mb-8">My Orders</h2>

        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-md rounded-2xl p-6 mb-8"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-sm text-gray-500">
                  Order ID:{" "}
                  <span className="font-medium text-gray-800">{order._id}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Placed: {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {order.status}
                </div>
                <div className="text-sm text-gray-600 mt-2 font-semibold">
                  Total ₹{Number(order.totalAmount).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="divide-y">
              {order.cartItems.map((item, idx) => {
                const itemKey = `${order._id}-${idx}`;
                const isExpanded = expandedItem === itemKey;

                return (
                  <div key={itemKey} className="py-1">
                    <div className="flex flex-col md:flex-row md:items-center">
                      <div className="flex items-center md:w-2/3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg mr-4 border"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-lg font-semibold">{item.name}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                Seller: {item.seller?.name || "—"}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-gray-600">Qty: {item.qty}</div>
                              <div className="text-md font-medium">
                                ₹{Number(item.price).toFixed(2)}
                              </div>
                              <div className="text-sm text-gray-400">
                                Sub: ₹
                                {Number(item.subtotal ?? item.price * item.qty).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Status Button */}
                      <div className="mt-4 md:mt-0 md:w-1/3 text-right">
                        <button
                          onClick={() =>
                            setExpandedItem(isExpanded ? null : itemKey)
                          }
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-4 py-2 rounded-full shadow-md hover:scale-105 transition-transform duration-200"
                        >
                          View Status
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <FiChevronDown className="text-white" />
                          </motion.div>
                        </button>
                      </div>
                    </div>

                    {/* Expandable Status Bar */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden mt-6 bg-gray-50 p-5 rounded-xl border"
                        >
                          <StatusProgress
                            status={item.status || order.status}
                            paymentDate={order.payment?.paidAt}
                            shippedDate={item.shippedAt}
                            deliveredDate={item.deliveredAt}
                            expectedDate={item.deliveryExpectedAt}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/** ✅ Modern horizontal timeline design */
function StatusProgress({ status, paymentDate, shippedDate, deliveredDate, expectedDate }) {
  const steps = [
    { key: "paid", label: "Payment Completed", icon: <FiCheckCircle /> },
    { key: "shipped", label: "Item Shipped", icon: <FiTruck /> },
    { key: "delivered", label: "Delivered", icon: <FiClock /> },
  ];

  const statusIndex = (() => {
    if (status === "succeeded" || status === "paid") return 0;
    if (status === "shipped") return 1;
    if (status === "delivered") return 2;
    return -1;
  })();

  const getDateLabel = (key) => {
    switch (key) {
      case "paid":
        return paymentDate ? format(new Date(paymentDate), "dd MMM yyyy") : "Pending";
      case "shipped":
        return shippedDate
          ? format(new Date(shippedDate), "dd MMM yyyy")
          : expectedDate
          ? `Expected by ${format(new Date(expectedDate), "dd MMM yyyy")}`
          : "Awaiting shipment";
      case "delivered":
        return deliveredDate
          ? format(new Date(deliveredDate), "dd MMM yyyy")
          : expectedDate
          ? `Expected by ${format(new Date(expectedDate), "dd MMM yyyy")}`
          : "Pending delivery";
      default:
        return "";
    }
  };

  return (
    <div className="relative mt-3">
      {/* Background line */}
      <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 rounded-full z-0" />
      {/* Progress line */}
      <motion.div
        className="absolute top-5 left-0 h-1 bg-green-500 rounded-full z-10"
        initial={{ width: "0%" }}
        animate={{ width: `${(statusIndex / (steps.length - 1)) * 100}%` }}
        transition={{ duration: 0.6 }}
      />

      <div className="relative flex justify-between z-20">
        {steps.map((s, i) => {
          const active = i <= statusIndex;
          return (
            <div key={s.key} className="flex flex-col items-center w-1/3 text-center">
              {/* Icon */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 border-4 transition-colors duration-300 ${
                  active
                    ? "bg-green-500 text-white border-green-200 shadow-md"
                    : "bg-gray-200 text-gray-500 border-gray-300"
                }`}
              >
                {s.icon}
              </div>

              {/* Label */}
              <div
                className={`text-sm font-semibold ${
                  active ? "text-green-700" : "text-gray-500"
                }`}
              >
                {s.label}
              </div>

              {/* Date */}
              <div className="text-xs text-gray-400 mt-1">{getDateLabel(s.key)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
