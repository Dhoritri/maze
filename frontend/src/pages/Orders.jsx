import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import optimizeCloudinaryUrl from "../utils/cloudinary";

const statusColor = (status) => {
  switch (status) {
    case "Delivered": return "bg-green-400";
    case "Shipped": return "bg-purple-400";
    case "Out for delivery": return "bg-orange-400";
    case "Packing": return "bg-yellow-400";
    default: return "bg-blue-400";
  }
};

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;
      const { data } = await axios.post(backendUrl + "/api/order/userorders", {}, { headers: { token } });
      if (data.success) {
        const items = [];
        data.orders.forEach((order) => {
          order.items.forEach((item) => {
            items.push({ ...item, status: order.status, payment: order.payment, paymentMethod: order.paymentMethod, date: order.date });
          });
        });
        setOrderData(items.reverse());
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => { loadOrderData(); }, [token]);

  return (
    <div className="pt-10 pb-24">
      <div className="mb-10">
        <Title text1="MY" text2="ORDERS" />
      </div>

      {orderData.length === 0 ? (
        <p className="text-neutral-600 text-sm text-center py-24">No orders yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-white/5">
          {orderData.map((item, index) => (
            <div
              key={index}
              className="py-6 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
            >
              <img
                src={optimizeCloudinaryUrl(item.image[0], 120)}
                className="w-[72px] h-20 object-cover flex-shrink-0"
                alt={item.name}
                loading="lazy"
              />

              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate mb-1">{item.name}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-600">
                  <span>{item.price}{currency}</span>
                  <span>·</span>
                  <span>Qty {item.quantity}</span>
                  <span>·</span>
                  <span>Size {item.size}</span>
                  <span>·</span>
                  <span>{new Date(item.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
                <p className="text-[11px] text-neutral-700 mt-1">{item.paymentMethod}</p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-5 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusColor(item.status)}`} />
                  <span className="text-xs text-neutral-400">{item.status}</span>
                </div>
                <button
                  onClick={loadOrderData}
                  className="text-[10px] tracking-[0.15em] border border-white/10 px-4 py-2 text-neutral-500 hover:text-white hover:border-white/25 transition-colors"
                >
                  TRACK
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
