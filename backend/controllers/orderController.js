import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
// placing orders using cod method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// placing orders using bkash method
const placeOrderBkash = async (req, res) => {
  try {
    const { userId, items, amount, address, transactionId, paymentPhone } =
      req.body;

    if (!transactionId || !paymentPhone) {
      return res.json({
        success: false,
        message: "Transaction ID and Phone Number are required",
      });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "bKash",
      transactionId,
      paymentPhone,
      payment: true, // Assume payment is successful for simplicity
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully via bKash" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// placing orders using nagad method
const placeOrderNagad = async (req, res) => {
  try {
    const { userId, items, amount, address, transactionId, paymentPhone } =
      req.body;

    if (!transactionId || !paymentPhone) {
      return res.json({
        success: false,
        message: "Transaction ID and Phone Number are required",
      });
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Nagad",
      transactionId,
      paymentPhone,
      payment: true, // Assume payment is successful for simplicity
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Order placed successfully via Nagad" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//All ordeer data adminn paneel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).lean();
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//user ordeer data
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId }).lean();
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//update OrderStatus ffrom admin

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


export {
  placeOrder,
  placeOrderBkash,
  placeOrderNagad,
  allOrders,
  userOrders,
  updateStatus,
};
