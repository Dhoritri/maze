import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import optimizeCloudinaryUrl from "../utils/cloudinary";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="overflow-hidden bg-[#1a1a1a] aspect-[3/4]">
        <img
          src={optimizeCloudinaryUrl(image[0], 400)}
          alt={name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
      <div className="pt-3 pb-1">
        <p className="text-xs text-white truncate leading-relaxed">{name}</p>
        <p className="text-xs text-neutral-500 mt-0.5">
          {price}{currency}
        </p>
      </div>
    </Link>
  );
};

export default ProductItem;
