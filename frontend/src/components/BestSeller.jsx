import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const BestSeller = () => {
  const { products } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    setBestSeller(products.filter((p) => p.bestseller).slice(0, 6));
  }, [products]);

  return (
    <section className="py-20 border-t border-white/5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div>
          <p className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase mb-3">Most Loved</p>
          <Title text1="BEST" text2="SELLERS" />
        </div>
        <p className="text-xs text-neutral-500 sm:text-right max-w-xs leading-relaxed">
          Our most popular pieces, loved by the community.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 gap-y-8">
        {bestSeller.map((item, index) => (
          <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
        ))}
      </div>
    </section>
  );
};

export default BestSeller;
