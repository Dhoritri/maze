import { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="min-h-screen px-4 py-6 ">
      <h2 className="text-white text-3xl font-bold mb-6">Orders</h2>
      <div className="space-y-6">
        {orders.map((order, index) => (
          <div
            className="bg-[#191919] rounded-lg shadow-md overflow-hidden border border-gray-700"
            key={index}
          >
            <div className="grid grid-cols-1 sm:grid-cols-[.5fr_2fr_1fr] lg:grid-cols-[.5fr_2fr_1fr_1fr_1fr] gap-6 p-6">
              <img
                className="w-16 h-16 object-cover mx-auto"
                src={assets.parcel_icon}
                alt="parcel"
              />
              <div>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <p
                      className="text-lg text-gray-300 font-medium"
                      key={index}
                    >
                      {item.name} x {item.quantity} <span>{item.size}</span>
                    </p>
                  ))}
                </div>
                <p className="mt-3 font-bold text-gray-100">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="text-gray-400 text-sm space-y-1">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city +
                      ", " +
                      order.address.state +
                      ", " +
                      order.address.country +
                      ", " +
                      order.address.zipcode}
                  </p>
                  <p>{order.address.phone}</p>
                </div>
              </div>
              <div className="text-gray-300 text-sm space-y-2">
                <p>Items: {order.items.length}</p>
                <p>Method: {order.paymentMethod}</p>
                <p>
                  Payment:{" "}
                  <span
                    className={`font-semibold ${
                      order.payment ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {order.payment ? "Done" : "Pending"}
                  </span>
                </p>
                {(order.paymentMethod === "bKash" ||
                  order.paymentMethod === "Nagad") && (
                  <>
                    <p>Transaction ID: {order.transactionId || "N/A"}</p>
                    <p>Payment Phone: {order.paymentPhone || "N/A"}</p>
                  </>
                )}
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className="text-gray-300 font-semibold text-lg flex justify-center items-center">
                {order.amount}
                {currency}
              </p>
              <div className="flex justify-center items-center">
                <select
                  onChange={(event) => statusHandler(event, order._id)}
                  value={order.status}
                  className="bg-gray-700 text-gray-300 text-sm font-semibold rounded-md p-1 h-12 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Packing">Packing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Not Payed">Not Payed</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
