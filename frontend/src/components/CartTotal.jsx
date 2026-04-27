import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className="w-full">
      <div className="mb-6">
        <Title text1="CART" text2="TOTAL" />
      </div>
      <div className="flex flex-col gap-3.5 text-xs">
        <div className="flex justify-between text-neutral-500">
          <span>Subtotal</span>
          <span className="text-white">{subtotal}.00{currency}</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>Delivery</span>
          <span className="text-white">{delivery_fee}.00{currency}</span>
        </div>
        <div className="flex justify-between pt-3 border-t border-white/8">
          <span className="text-white text-sm font-medium">Total</span>
          <span className="text-white text-sm font-medium">{total}.00{currency}</span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
