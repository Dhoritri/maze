import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
//add product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );
    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();
    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//list products — exclude reviews to keep payload small
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({}).select("-reviews");
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//remove products
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//single product data
const singleProduct = async (req, res) => {

  try {
    const {productId} = req.body
    const product = await productModel.findById(productId)
    res.json({ success: true, product })
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//product update
// Inside productController.js

const updateDiscount = async (req, res) => {
  try {
    const { id, discount } = req.body;

    // Validate discount is a number and >= 0
    if (typeof discount !== 'number' || discount < 0) {
      return res.json({ success: false, message: "Invalid discount value" });
    }

    const product = await productModel.findByIdAndUpdate(
      id, 
      { discount },
      { new: true }
    );

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Discount updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// add / update review (one per user per product)
const addReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;
    if (!productId || !rating) {
      return res.json({ success: false, message: "productId and rating are required" });
    }
    const ratingNum = Number(rating);
    if (ratingNum < 1 || ratingNum > 5) {
      return res.json({ success: false, message: "Rating must be between 1 and 5" });
    }

    const user = await userModel.findById(userId).select("name");
    if (!user) return res.json({ success: false, message: "User not found" });

    const product = await productModel.findById(productId);
    if (!product) return res.json({ success: false, message: "Product not found" });

    const existing = product.reviews.findIndex((r) => r.userId === userId);
    if (existing !== -1) {
      product.reviews[existing].rating = ratingNum;
      product.reviews[existing].comment = comment || "";
      product.reviews[existing].date = new Date();
    } else {
      product.reviews.push({ userId, userName: user.name, rating: ratingNum, comment: comment || "" });
    }

    await product.save();
    res.json({ success: true, message: "Review saved", reviews: product.reviews });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct, updateDiscount, addReview };
