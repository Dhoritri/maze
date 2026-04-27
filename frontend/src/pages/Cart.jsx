import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import optimizeCloudinaryUrl from "../utils/cloudinary";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } = useContext(ShopContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const temp = [];
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          if (cartItems[productId][size] > 0) {
            temp.push({ _id: productId, size, quantity: cartItems[productId][size] });
          }
        }
      }
      setCartData(temp);
    }
  }, [cartItems, products]);

  return (
    <div className="pt-10 pb-24">
      <div className="mb-10">
        <Title text1="YOUR" text2="CART" />
      </div>

      {cartData.length === 0 ? (
        <div className="py-24 flex flex-col items-center gap-5">
          <p className="text-neutral-600 text-sm">Your cart is empty.</p>
          <button
            onClick={() => navigate("/collection")}
            className="text-[11px] tracking-[0.2em] border border-white/10 px-8 py-3 text-white hover:border-white/30 transition-colors"
          >
            BROWSE COLLECTION
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col divide-y divide-white/5">
            {cartData.map((item, index) => {
              const product = products.find((p) => p._id === item._id);
              if (!product) return null;
              const hasDiscount = product.discount && product.discount > 0;

              return (
                <div
                  key={index}
                  className="py-5 grid grid-cols-[72px_1fr_auto] sm:grid-cols-[72px_1fr_100px_auto] items-center gap-4"
                >
                  <img
                    src={optimizeCloudinaryUrl(product.image[0], 120)}
                    className="w-[72px] h-20 object-cover"
                    alt={product.name}
                    loading="lazy"
                  />

                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate mb-1.5">{product.name}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {hasDiscount ? (
                        <>
                          <span className="text-xs text-[#FAB29E]">{product.discount}{currency}</span>
                          <span className="text-xs text-neutral-600 line-through">{product.price}{currency}</span>
                        </>
                      ) : (
                        <span className="text-xs text-neutral-400">{product.price}{currency}</span>
                      )}
                      <span className="text-[10px] border border-white/10 px-2 py-0.5 text-neutral-500">
                        {item.size}
                      </span>
                    </div>
                  </div>

                  <input
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(e) => Number(e.target.value) > 0 && updateQuantity(item._id, item.size, Number(e.target.value))}
                    className="hidden sm:block w-14 bg-transparent border border-white/10 text-white text-center text-sm py-2 focus:outline-none focus:border-white/25 transition-colors"
                  />

                  <button
                    onClick={() => updateQuantity(item._id, item.size, 0)}
                    className="opacity-25 hover:opacity-70 transition-opacity p-1"
                    aria-label="Remove"
                  >
                    <img src={assets.bin_icon} className="w-4" alt="" />
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-16">
            <div className="w-full sm:w-80">
              <CartTotal />
              <button
                onClick={() => navigate("/place-order")}
                className="w-full mt-5 bg-white text-black py-4 text-[11px] tracking-[0.2em] hover:bg-[#FAB29E] transition-colors"
              >
                PROCEED TO CHECKOUT
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
