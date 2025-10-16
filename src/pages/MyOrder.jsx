import React, { useEffect, useState } from 'react';
 // your axios instance
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FiTruck, FiClock, FiCheckCircle } from 'react-icons/fi';
import protectedInstance from '../instance/protectedInstance';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchOrders() {
      try {
        setLoading(true);
        const res = await protectedInstance.get('/orders/my');
        if (!mounted) return;
        setOrders(res.data || []);
      } catch (err) {   
        console.error('Failed to load orders:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchOrders();
    return () => { mounted = false; };
  }, []);

  const calcExpected = (order) => {
    // prefer stored deliveryExpectedAt, otherwise compute from paidAt + 10 days
    if (order.deliveryExpectedAt) return new Date(order.deliveryExpectedAt);
    if (order.paidAt) {
      const d = new Date(order.paidAt);
      d.setDate(d.getDate() + 10);
      return d;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen p-8">
        <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
        <div className="text-gray-500">You have no completed orders yet.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-3xl font-bold mb-6">My Orders</h2>

      <div className="space-y-6 max-w-5xl mx-auto">
        {orders.map(order => {
          const expected = calcExpected(order);
          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white shadow-md rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-sm text-gray-500">Order ID: <span className="font-medium text-gray-800">{order._id}</span></div>
                  <div className="text-xs text-gray-400 mt-1">Placed: {format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium"
                       style={{ background: order.status === 'succeeded' ? '#DEF7EC' : '#EEF2FF', color: order.status === 'succeeded' ? '#065F46' : '#3730A3' }}>
                    {order.status}
                  </div>
                  <div className="text-sm text-gray-600 mt-2 font-semibold">Total ₹{Number(order.totalAmount).toFixed(2)}</div>
                </div>
              </div>

              {/* Products list */}
              <div className="divide-y">
                {order.cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center py-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg mr-4 border" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-lg font-semibold">{item.name}</div>
                          <div className="text-sm text-gray-500 mt-1">Seller: {item.seller?.name || '—'}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">Qty: {item.qty}</div>
                          <div className="text-md font-medium">₹{Number(item.price).toFixed(2)}</div>
                          <div className="text-sm text-gray-400">Sub: ₹{Number(item.subtotal ?? (item.price * item.qty)).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dates & progress */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="text-sm">
                  <div className="text-gray-500">Order Date</div>
                  <div className="font-medium">{format(new Date(order.createdAt), 'dd MMM yyyy')}</div>
                </div>

                <div className="text-sm">
                  <div className="text-gray-500">Payment Date</div>
                  <div className="font-medium">{order.paidAt ? format(new Date(order.paidAt), 'dd MMM yyyy') : 'Not paid'}</div>
                </div>

                <div className="text-sm">
                  <div className="text-gray-500">Expected Delivery</div>
                  <div className="font-medium">{expected ? format(expected, 'dd MMM yyyy') : '—'}</div>
                </div>
              </div>

              {/* Small status bar */}
              <div className="mt-4">
                <StatusProgress status={order.status} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** Progress visualization - simple 3 step */
function StatusProgress({ status }) {
  // order of progression
  const steps = [
    { key: 'succeeded', label: 'Payment' },
    { key: 'shipped',   label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  // determine current step index
  const statusIndex = (() => {
    if (status === 'succeeded') return 0;
    if (status === 'shipped') return 1;
    if (status === 'delivered') return 2;
    return -1;
  })();

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        {steps.map((s, i) => {
          const active = i <= statusIndex;
          return (
            <div key={s.key} className="flex items-center gap-3">
              <div className={`w-9 h-9 flex items-center justify-center rounded-full ${active ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i === 0 ? <FiCheckCircle/> : i === 1 ? <FiTruck/> : <FiClock/>}
              </div>
              <div className={`${active ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>{s.label}</div>
              {i < steps.length - 1 && <div className={`h-1 flex-1 ${i < statusIndex ? 'bg-green-500' : 'bg-gray-200'} rounded`}></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
