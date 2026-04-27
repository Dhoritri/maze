import validator from "validator";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      res.json({ success: true, token: createToken(user._id) });
    } else {
      res.json({ success: false, message: "Invalid password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) return res.json({ success: false, message: "Email already exists" });
    if (!validator.isEmail(email)) return res.json({ success: false, message: "Invalid email" });
    if (password.length < 6) return res.json({ success: false, message: "Password must be at least 6 characters" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await new userModel({ name, email, password: hashedPassword }).save();

    res.json({ success: true, token: createToken(user._id) });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const googleAuth = async (req, res) => {
  try {
    const { access_token } = req.body;

    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const userInfo = await response.json();

    if (userInfo.error) {
      return res.json({ success: false, message: "Invalid Google token" });
    }

    const { email, name, sub: googleId } = userInfo;

    let user = await userModel.findOne({ email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomBytes(32).toString("hex"), salt);
      user = await new userModel({
        name: name || email.split("@")[0],
        email,
        password: hashedPassword,
        googleId,
      }).save();
    }

    res.json({ success: true, token: createToken(user._id) });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId).select("-password -cartData");
    if (!user) return res.json({ success: false, message: "User not found" });

    const orders = await orderModel.find({ userId });
    const totalSpent = orders.reduce((sum, o) => sum + o.amount, 0);
    const reviewCount = await productModel.countDocuments({ "reviews.userId": userId });

    res.json({
      success: true,
      profile: {
        name: user.name,
        email: user.email,
        isGoogleUser: !!user.googleId,
        joinedAt: user._id.getTimestamp(),
        orderCount: orders.length,
        totalSpent,
        reviewCount,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, currentPassword, newPassword } = req.body;
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    if (name && name.trim()) {
      user.name = name.trim();
    }

    if (newPassword) {
      if (!currentPassword) return res.json({ success: false, message: "Current password required" });
      if (user.googleId) return res.json({ success: false, message: "Google accounts cannot change password here" });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.json({ success: false, message: "Current password is incorrect" });
      if (newPassword.length < 6) return res.json({ success: false, message: "New password must be at least 6 characters" });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.json({ success: true, message: "Profile updated", name: user.name });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, googleAuth, adminLogin, getProfile, updateProfile };
