import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const inputCls =
  "bg-transparent border border-white/10 text-white text-sm py-3 px-4 placeholder:text-neutral-700 focus:border-white/25 focus:outline-none transition-colors w-full";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const selectMethod = (m) => { setMethod(m); setPaymentDetails({ transactionId: "", paymentPhone: "" }); };
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [paymentDetails, setPaymentDetails] = useState({ transactionId: "", paymentPhone: "" });
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", street: "",
    city: "", state: "", zipcode: "", phone: "", country: "",
  });

  const onChangeHandler = (e) => setFormData((d) => ({ ...d, [e.target.name]: e.target.value }));

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let orderItems = [];
      for (const id in cartItems) {
        for (const size in cartItems[id]) {
          if (cartItems[id][size] > 0) {
            const item = structuredClone(products.find((p) => p._id === id));
            if (item) { item.size = size; item.quantity = cartItems[id][size]; orderItems.push(item); }
          }
        }
      }

      const orderData = { address: formData, items: orderItems, amount: getCartAmount() + delivery_fee };

      const success = (data) => { setCartItems({}); navigate("/orders"); };

      switch (method) {
        case "cod": {
          const { data } = await axios.post(backendUrl + "/api/order/place", orderData, { headers: { token } });
          data.success ? success() : toast.error(data.message);
          break;
        }
        case "bkash": {
          const { transactionId, paymentPhone } = paymentDetails;
          if (!transactionId || !paymentPhone) { toast.error("Account number and transaction ID required"); return; }
          const { data } = await axios.post(backendUrl + "/api/order/bkash", { ...orderData, transactionId, paymentPhone }, { headers: { token } });
          data.success ? success() : toast.error(data.message);
          break;
        }
        case "nagad": {
          const { transactionId, paymentPhone } = paymentDetails;
          if (!transactionId || !paymentPhone) { toast.error("Account number and transaction ID required"); return; }
          const { data } = await axios.post(backendUrl + "/api/order/nagad", { ...orderData, transactionId, paymentPhone }, { headers: { token } });
          data.success ? success() : toast.error(data.message);
          break;
        }
        default: toast.error("Invalid payment method");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="pt-10 pb-24">
      <div className="mb-10">
        <Title text1="PLACE" text2="ORDER" />
      </div>

      <div className="flex flex-col lg:flex-row gap-14">
        {/* Left */}
        <div className="flex-1">
          <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-6">Delivery Information</p>
          <div className="grid grid-cols-2 gap-3">
            <input required name="firstName" value={formData.firstName} onChange={onChangeHandler} placeholder="First Name" className={inputCls} />
            <input required name="lastName" value={formData.lastName} onChange={onChangeHandler} placeholder="Last Name" className={inputCls} />
            <input required name="email" type="email" value={formData.email} onChange={onChangeHandler} placeholder="Email Address" className={`${inputCls} col-span-2`} />
            <input required name="street" value={formData.street} onChange={onChangeHandler} placeholder="Street Address" className={`${inputCls} col-span-2`} />
            <input required name="city" value={formData.city} onChange={onChangeHandler} placeholder="City" className={inputCls} />
            <input required name="state" value={formData.state} onChange={onChangeHandler} placeholder="State" className={inputCls} />
            <input required name="zipcode" type="number" value={formData.zipcode} onChange={onChangeHandler} placeholder="Zip Code" className={inputCls} />
            <input required name="country" value={formData.country} onChange={onChangeHandler} placeholder="Country" className={inputCls} />
            <input required name="phone" type="number" value={formData.phone} onChange={onChangeHandler} placeholder="Phone Number" className={`${inputCls} col-span-2`} />
          </div>

          {/* Payment */}
          <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mt-10 mb-5">Payment Method</p>
          <div className="flex flex-col sm:flex-row gap-2.5">
            {[
              { id: "bkash", logo: assets.bkash_logo },
              { id: "nagad", logo: assets.nagad_logo },
              { id: "cod", label: "CASH ON DELIVERY" },
            ].map(({ id, logo, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => selectMethod(id)}
                className={`flex items-center gap-3 px-4 py-3 border text-sm transition-all ${
                  method === id
                    ? "border-[#FAB29E]/50 bg-[#FAB29E]/5"
                    : "border-white/8 hover:border-white/20"
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full border flex-shrink-0 transition-colors ${
                  method === id ? "border-[#FAB29E] bg-[#FAB29E]" : "border-white/25"
                }`} />
                {logo
                  ? <img src={logo} className="h-5" alt={id} />
                  : <span className="text-[10px] tracking-wider text-white">{label}</span>
                }
              </button>
            ))}
          </div>

          {(method === "bkash" || method === "nagad") && (
            <div className="mt-4 flex flex-col gap-3">
              <input
                type="text"
                placeholder={`${method === "bkash" ? "bKash" : "Nagad"} Account Number`}
                value={paymentDetails.paymentPhone}
                onChange={(e) => setPaymentDetails((d) => ({ ...d, paymentPhone: e.target.value }))}
                className={inputCls}
              />
              <input
                type="text"
                placeholder="Transaction ID"
                value={paymentDetails.transactionId}
                onChange={(e) => setPaymentDetails((d) => ({ ...d, transactionId: e.target.value }))}
                className={inputCls}
              />
            </div>
          )}
        </div>

        {/* Right */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-6">Order Summary</p>
          <CartTotal />
          <button
            type="submit"
            className="w-full mt-5 bg-white text-black py-4 text-[11px] tracking-[0.2em] hover:bg-[#FAB29E] transition-colors"
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
