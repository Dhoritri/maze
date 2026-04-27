import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId:   { type: String, required: true },
  userName: { type: String, required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  comment:  { type: String, default: "" },
  date:     { type: Date, default: Date.now },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: { type: Array, required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
  reviews: { type: [reviewSchema], default: [] },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
