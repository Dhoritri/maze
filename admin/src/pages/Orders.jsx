import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const STATUS_OPTIONS = ["Order Placed", "Packing", "Shipped", "Out for delivery", "Delivered", "Not Payed"];

const statusDot = (status) => {
  const map = {
    "Delivered": "bg-emerald-400",
    "Shipped": "bg-blue-400",
    "Out for delivery": "bg-sky-400",
    "Packing": "bg-amber-400",
    "Order Placed": "bg-neutral-500",
    "Not Payed": "bg-red-400",
  };
  return map[status] || "bg-neutral-600";
};

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;
    try {
      const { data } = await axios.post(backendUrl + "/api/order/list", {}, { headers: { token } });
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: e.target.value },
        { headers: { token } }
      );
      if (data.success) await fetchAllOrders();
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  useEffect(() => { fetchAllOrders(); }, [token]);

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-1">Management</p>
        <h1 className="text-xl font-medium text-white">Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="border border-white/5 py-16 flex flex-col items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-700">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
          </svg>
          <p className="text-xs text-neutral-700 tracking-wider">NO ORDERS YET</p>
        </div>
      ) : (
        <div className="flex flex-col gap-px">
          {orders.map((order, index) => (
            <div
              key={index}
              className="border border-white/4 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr_160px_80px_160px] gap-0 divide-y lg:divide-y-0 lg:divide-x divide-white/4">

                {/* Items */}
                <div className="p-4 flex flex-col gap-1.5">
                  <p className="text-[9px] tracking-[0.18em] text-neutral-600 uppercase mb-2">Items</p>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-baseline gap-2">
                      <span className="text-xs text-white leading-snug">{item.name}</span>
                      <span className="text-[10px] text-neutral-600">×{item.quantity}</span>
                      {item.size && <span className="text-[9px] border border-white/10 text-neutral-500 px-1.5 py-0.5">{item.size}</span>}
                    </div>
                  ))}
                </div>

                {/* Address */}
                <div className="p-4">
                  <p className="text-[9px] tracking-[0.18em] text-neutral-600 uppercase mb-2">Delivery</p>
                  <p className="text-xs text-white font-medium mb-1">
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    {order.address.street}, {order.address.city}, {order.address.state},<br />
                    {order.address.country} {order.address.zipcode}
                  </p>
                  <p className="text-[11px] text-neutral-600 mt-1">{order.address.phone}</p>
                </div>

                {/* Payment info */}
                <div className="p-4">
                  <p className="text-[9px] tracking-[0.18em] text-neutral-600 uppercase mb-2">Payment</p>
                  <p className="text-xs text-neutral-400 mb-1">{order.paymentMethod}</p>
                  <p className={`text-[10px] font-medium tracking-wide ${order.payment ? "text-emerald-400" : "text-amber-400"}`}>
                    {order.payment ? "PAID" : "PENDING"}
                  </p>
                  {(order.paymentMethod === "bKash" || order.paymentMethod === "Nagad") && (
                    <div className="mt-2 space-y-1">
                      <p className="text-[10px] text-neutral-600">TXN: {order.transactionId || "—"}</p>
                      <p className="text-[10px] text-neutral-600">Phone: {order.paymentPhone || "—"}</p>
                    </div>
                  )}
                  <p className="text-[10px] text-neutral-700 mt-2">{new Date(order.date).toLocaleDateString()}</p>
                </div>

                {/* Amount */}
                <div className="p-4 flex flex-col justify-center items-center">
                  <p className="text-[9px] tracking-[0.18em] text-neutral-600 uppercase mb-1">Total</p>
                  <p className="text-base text-white font-medium">{order.amount}{currency}</p>
                  <p className="text-[10px] text-neutral-600 mt-1">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                </div>

                {/* Status */}
                <div className="p-4 flex flex-col justify-center gap-3">
                  <p className="text-[9px] tracking-[0.18em] text-neutral-600 uppercase">Status</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot(order.status)}`} />
                    <span className="text-xs text-neutral-400">{order.status}</span>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => statusHandler(e, order._id)}
                    className="w-full bg-transparent border border-white/8 text-neutral-400 text-[11px] py-2 px-2.5 focus:border-white/25 focus:outline-none transition-colors cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} className="bg-[#141414]">{s}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-neutral-700 mt-4">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
    </div>
  );
};

export default Orders;
