import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <section className="py-20 border-t border-white/5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div>
          <p className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase mb-3">Fresh Drops</p>
          <Title text1="LATEST" text2="COLLECTION" />
        </div>
        <p className="text-xs text-neutral-500 sm:text-right max-w-xs leading-relaxed">
          Explore our newest arrivals — fresh styles added every season.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 gap-y-8">
        {latestProducts.map((item, index) => (
          <ProductItem key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
        ))}
      </div>
    </section>
  );
};

export default LatestCollection;
