import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import Title from "../components/Title";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const selectMethod = (m) => { setMethod(m); setPaymentDetails({ transactionId: "", paymentPhone: "" }); };
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(ShopContext);
  const [paymentDetails, setPaymentDetails] = useState({ transactionId: "", paymentPhone: "" });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    phone: "",
    country: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      let orderItems = [];
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartItems[items][item];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };

      switch (method) {
        case "cod": {
          const response = await axios.post(
            backendUrl + "/api/order/place",
            orderData,
            { headers: { token } }
          );

          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        case "bkash": {
          const { transactionId, paymentPhone } = paymentDetails;
          if (!transactionId || !paymentPhone) {
            toast.error("Transaction ID and Phone Number are required");
            return;
          }
          orderData.transactionId = transactionId;
          orderData.paymentPhone = paymentPhone;
          const response = await axios.post(
            backendUrl + "/api/order/bkash",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        case "nagad": {
          const { transactionId, paymentPhone } = paymentDetails;
          if (!transactionId || !paymentPhone) {
            toast.error("Transaction ID and Phone Number are required");
            return;
          }
          orderData.transactionId = transactionId;
          orderData.paymentPhone = paymentPhone;
          const response = await axios.post(
            backendUrl + "/api/order/nagad",
            orderData,
            { headers: { token } }
          );
          if (response.data.success) {
            setCartItems({});
            navigate("/orders");
          } else {
            toast.error(response.data.message);
          }
          break;
        }
        default: {
          toast.error("Invalid payment method selected");
          break;
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]"
    >
      {/* Left Side Information */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="firstName"
            value={formData.firstName}
            type="text"
            placeholder="First Name"
            className="border border-white rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="lastName"
            value={formData.lastName}
            type="text"
            placeholder="Last Name"
            className="border border-white rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="email"
          value={formData.email}
          type="email"
          placeholder="Email Address"
          className="border border-white rounded py-1.5 px-3.5 w-full"
        />
        <input
          required
          onChange={onChangeHandler}
          name="street"
          value={formData.street}
          type="text"
          placeholder="Street"
          className="border border-white rounded py-1.5 px-3.5 w-full"
        />
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="city"
            value={formData.city}
            type="text"
            placeholder="City"
            className="border border-white rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="state"
            value={formData.state}
            type="text"
            placeholder="State"
            className="border border-white rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <div className="flex gap-3">
          <input
            required
            onChange={onChangeHandler}
            name="zipcode"
            value={formData.zipcode}
            type="number"
            placeholder="ZipCode"
            className="border border-white rounded py-1.5 px-3.5 w-full"
          />
          <input
            required
            onChange={onChangeHandler}
            name="country"
            value={formData.country}
            type="text"
            placeholder="Country"
            className="border border-white rounded py-1.5 px-3.5 w-full"
          />
        </div>
        <input
          required
          onChange={onChangeHandler}
          name="phone"
          value={formData.phone}
          type="number"
          placeholder="Phone"
          className="border border-white rounded py-1.5 px-3.5 w-full"
        />
      </div>

      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* Payment Methods */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div
              onClick={() => selectMethod("bkash")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer bg-white"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full border-black ${
                  method === "bkash" ? "bg-[#292929]" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.bkash_logo} alt="bkash" />
            </div>
            <div
              onClick={() => selectMethod("nagad")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer bg-white"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full border-black ${
                  method === "nagad" ? "bg-[#292929]" : ""
                }`}
              ></p>
              <img className="h-5 mx-4" src={assets.nagad_logo} alt="nagad" />
            </div>
            <div
              onClick={() => selectMethod("cod")}
              className="flex items-center gap-3 border p-2 px-3 cursor-pointer bg-white"
            >
              <p
                className={`min-w-3.5 h-3.5 border rounded-full border-black ${
                  method === "cod" ? "bg-[#292929]" : ""
                }`}
              ></p>
              <p className="text-black text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>
          </div>

          {/* Conditional Inputs for Payment Details */}
          {method === "bkash" && (
            <div className="mt-6">
              <input
                type="text"
                placeholder="Your bKash Account Number"
                value={paymentDetails.paymentPhone}
                onChange={(e) => setPaymentDetails(d => ({ ...d, paymentPhone: e.target.value }))}
                className="border border-white rounded py-1.5 px-3.5 w-full mb-4"
              />
              <input
                type="text"
                placeholder="bKash Transaction ID"
                value={paymentDetails.transactionId}
                onChange={(e) => setPaymentDetails(d => ({ ...d, transactionId: e.target.value }))}
                className="border border-white rounded py-1.5 px-3.5 w-full"
              />
            </div>
          )}

          {method === "nagad" && (
            <div className="mt-6">
              <input
                type="text"
                placeholder="Your Nagad Account Number"
                value={paymentDetails.paymentPhone}
                onChange={(e) => setPaymentDetails(d => ({ ...d, paymentPhone: e.target.value }))}
                className="border border-white rounded py-1.5 px-3.5 w-full mb-4"
              />
              <input
                type="text"
                placeholder="Nagad Transaction ID"
                value={paymentDetails.transactionId}
                onChange={(e) => setPaymentDetails(d => ({ ...d, transactionId: e.target.value }))}
                className="border border-white rounded py-1.5 px-3.5 w-full"
              />
            </div>
          )}

          <div className="w-full text-end mt-8">
            <button
              type="submit"
              className="bg-black text-white px-16 py-3 text-sm hover:bg-[#FAB29E]"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
