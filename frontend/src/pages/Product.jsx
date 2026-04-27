import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import optimizeCloudinaryUrl from "../utils/cloudinary";

const Product = () => {
  const { productId } = useParams();
  const { currency, addToCart, productMap } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    const item = productMap[productId];
    if (item) {
      setProductData(item);
      setImage(optimizeCloudinaryUrl(item.image[0], 800));
    }
  }, [productId, productMap]);

  if (!productData) return <div className="min-h-[60vh]" />;

  return (
    <div className="pt-10 pb-20">
      <div className="flex gap-10 sm:gap-14 flex-col sm:flex-row">

        {/* Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* Thumbnails */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto gap-2 sm:w-20 sm:max-h-[520px]">
            {productData.image.map((img, i) => (
              <button
                key={i}
                onClick={() => setImage(optimizeCloudinaryUrl(img, 800))}
                className={`flex-shrink-0 border transition-colors overflow-hidden ${
                  image === optimizeCloudinaryUrl(img, 800)
                    ? "border-[#FAB29E]/60"
                    : "border-white/5 hover:border-white/20"
                }`}
              >
                <img
                  src={optimizeCloudinaryUrl(img, 120)}
                  className="w-16 h-20 sm:w-20 sm:h-24 object-cover"
                  alt=""
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center overflow-hidden" style={{ maxHeight: "600px" }}>
            <img
              src={image}
              alt={productData.name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 max-w-md">
          <h1 className="text-2xl font-medium text-white mb-3">{productData.name}</h1>

          {/* Stars */}
          <div className="flex items-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={assets.star_icon} className="w-3" alt="" />
            ))}
            <span className="text-xs text-neutral-600 ml-2">(199)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            {productData.discount > 0 ? (
              <>
                <span className="text-2xl text-[#FAB29E] font-medium">{productData.discount}{currency}</span>
                <span className="text-sm text-neutral-600 line-through">{productData.price}{currency}</span>
              </>
            ) : (
              <span className="text-2xl text-white font-medium">{productData.price}{currency}</span>
            )}
          </div>

          <p className="text-sm text-neutral-400 leading-relaxed mb-8">{productData.description}</p>

          {/* Size */}
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-4">Select Size</p>
            <div className="flex flex-wrap gap-2">
              {productData.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 text-sm border transition-colors ${
                    s === size
                      ? "border-[#FAB29E] text-white bg-[#FAB29E]/5"
                      : "border-white/10 text-neutral-500 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => addToCart(productData._id, size)}
            className="w-full sm:w-auto bg-white text-black px-12 py-3.5 text-[11px] tracking-[0.2em] hover:bg-[#FAB29E] transition-colors font-medium"
          >
            ADD TO CART
          </button>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-2 text-xs text-neutral-600">
            <span>100% Organic Cotton</span>
            <span>Cash On Delivery Available</span>
            <span>Easy Return & Exchange Within 7 Days</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-20">
        <div className="flex gap-0 mb-0">
          <button className="border-b border-white text-sm text-white px-5 py-2.5 font-medium">
            Description
          </button>
          <button className="border-b border-white/10 text-sm text-neutral-600 px-5 py-2.5">
            Reviews
          </button>
        </div>
        <div className="border border-t-0 border-white/5 px-5 py-6">
          <p className="text-sm text-neutral-500 leading-relaxed mb-3">
            We're a rising brand dedicated to delivering 100% organic cotton products with unique designs and
            unparalleled comfort.
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Every piece is crafted with care, ensuring softness, durability, and a style that stands out.
            Wear it your way.
          </p>
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
