import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { useContext } from "react";
import optimizeCloudinaryUrl from "../utils/cloudinary";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link className="text-gray-600 cursor-pointer" to={`/product/${id}`}>
      <div className="overflow-hidden">
        <img
          className="hover:scale-110 transition ease-in-out"
          src={optimizeCloudinaryUrl(image[0], 400)}
          alt={name}
          loading="lazy"
          width={400}
          height={500}
        />
      </div>
      <p className="pt-3 pb-1 text-center text-sm text-[#FFFFFF] ">{name}</p>
      <p className="text-sm text-center font-medium text-[#FFFFFF]">
      
        {price}
        {currency}
      </p>
    </Link>
  );
};
export default ProductItem;
