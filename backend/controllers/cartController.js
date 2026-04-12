import userModel from "../models/userModel.js";

//add products to cart
const addToCart = async(req,res)=>{
    try {
        const {userId,itemId,size} = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) return res.json({success:false, message:"User not found"});

        let cartData = userData.cartData;

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            }
            else{
                cartData[itemId][size] = 1;
            }
        }else{
            cartData[itemId] = {};
            cartData[itemId][size] = 1 ;
        }
        await userModel.findByIdAndUpdate(userId, {cartData});
        res.json({success:true, message:"Added To Cart"})
    } catch (error) {
        console.error(error)
        res.json({success: false, message:error.message})
    }
}

//update products cart
const updateCart = async(req,res)=>{
    try {
        const{userId,itemId,size,quantity} = req.body;
        if (quantity < 0) return res.json({success:false, message:"Invalid quantity"});

        const userData = await userModel.findById(userId);
        if (!userData) return res.json({success:false, message:"User not found"});

        let cartData = userData.cartData;
        cartData[itemId][size] = quantity;
        await userModel.findByIdAndUpdate(userId, {cartData});
        res.json({success:true, message:"Cart Updated"})

    } catch (error) {
        console.error(error)
        res.json({success: false, message:error.message})
    }
}

//get user cart data
const getUserCart = async(req,res)=>{
    try {
        const {userId} = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) return res.json({success:false, message:"User not found"});

        res.json({success: true, cartData: userData.cartData});
    } catch (error) {
        console.error(error)
        res.json({success: false, message:error.message})
    }
}

export {addToCart,updateCart,getUserCart}
