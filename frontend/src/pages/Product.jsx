import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
const Product = () => {
  const { productId } = useParams();
  const { currency, addToCart, productMap } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const item = productMap[productId];
    if (item) {
      setProductData(item);
      setImage(item.image[0]);
    }
  }, [productId, productMap]);

  return productData ? (
    <div className=" pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* product dattaa */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* product images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="products" />
          </div>
        </div>
        {/* Product info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2 text-white">
            {productData.name}
          </h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <p className="pl-2 text-white">(199)</p>
          </div>
          <p className="text-gray-500 mt-5 text-3xl font-medium">
            {productData.discount > 0 ? (
              <>
                <span className="text-red-500">
                  {productData.discount}
                  {currency}
                </span>
                <span className="text-sm text-gray-400 line-through ml-2">
                  {productData.price}
                  {currency}
                </span>
              </>
            ) : (
              <>
                {productData.price}
                {currency}
              </>
            )}
          </p>

          <p className="mt-5 text-gray-300 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p className="text-white text-xl">Select Size</p>
            <div className="flex gap-2 text-white">
              {productData.sizes.map((item, index) => (
                <button
                  onClick={() => setSize(item)}
                  className={`border py-2 px-4 bg-[#424242] ${
                    item === size ? "border-orange-300" : ""
                  } `}
                  key={index}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => addToCart(productData._id, size)}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-400 mt-5 flex flex-col gap-1">
            <p>100% Organic Cotton</p>
            <p>Cash On Delivery Is Available</p>
            <p>Easy Return And Exchange Within 7 Days</p>
          </div>
        </div>
      </div>
      {/* Description & review */}
      <div className="mt-20">
        <div className="flex ">
          <b className="border bg-slate-300 px-5 py-3 text-sm">Description</b>
          <p className="border border-[#191919] bg-slate-300 px-5 py-3 text-sm">
            Reviews
          </p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            We're a rising brand dedicated to delivering 100% organic cotton
            products with unique designs and unparalleled comfort.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellendus
            placeat vero in recusandae. Rerum ipsam, aliquid ducimus deleniti
            debitis dolorum, molestiae beatae non laboriosam explicabo
            reiciendis quibusdam nobis magnam hic.
          </p>
        </div>
      </div>
      {/* latest prodds */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      ></RelatedProducts>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
