import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import optimizeCloudinaryUrl from "../utils/cloudinary";
import axios from "axios";
import { toast } from "react-toastify";

const StarInput = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} type="button" onClick={() => onChange(s)} className="text-neutral-600 hover:text-[#FAB29E] transition-colors">
        <svg width="20" height="20" viewBox="0 0 24 24" fill={s <= value ? "#FAB29E" : "none"} stroke={s <= value ? "#FAB29E" : "currentColor"} strokeWidth="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </button>
    ))}
  </div>
);

const StarDisplay = ({ rating, size = 14 }) => {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => {
        const filled = s <= full;
        const isHalf = !filled && s === full + 1 && half;
        return (
          <svg key={s} width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#FAB29E" : "none"} stroke="#FAB29E" strokeWidth="1.5" style={{ opacity: filled || isHalf ? 1 : 0.2 }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        );
      })}
    </div>
  );
};

const Product = () => {
  const { productId } = useParams();
  const { currency, addToCart, productMap, backendUrl, token } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const base = productMap[productId];
    if (base) {
      setProductData(base);
      setImage(optimizeCloudinaryUrl(base.image[0], 800));
    }
  }, [productId, productMap]);

  useEffect(() => {
    if (!productId) return;
    axios.post(backendUrl + "/api/product/single", { productId })
      .then(({ data }) => {
        if (data.success) {
          setProductData(data.product);
          setImage(optimizeCloudinaryUrl(data.product.image[0], 800));
          setReviews(data.product.reviews || []);
        }
      })
      .catch(() => {});
  }, [productId, backendUrl]);

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const submitReview = async (e) => {
    e.preventDefault();
    if (!token) { toast.error("Please log in to leave a review"); return; }
    if (rating === 0) { toast.error("Please select a star rating"); return; }
    setSubmitting(true);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/product/review",
        { productId, rating, comment },
        { headers: { token } }
      );
      if (data.success) {
        setReviews(data.reviews);
        setRating(0);
        setComment("");
        toast.success("Review submitted");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!productData) return <div className="min-h-[60vh]" />;

  return (
    <div className="pt-10 pb-20">
      <div className="flex gap-10 sm:gap-14 flex-col sm:flex-row">

        {/* Images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
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
                <img src={optimizeCloudinaryUrl(img, 120)} className="w-16 h-20 sm:w-20 sm:h-24 object-cover" alt="" loading="lazy" />
              </button>
            ))}
          </div>

          <div className="flex-1 bg-[#1a1a1a] flex items-center justify-center overflow-hidden" style={{ maxHeight: "600px" }}>
            <img src={image} alt={productData.name} className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 max-w-md">
          <h1 className="text-2xl font-medium text-white mb-3">{productData.name}</h1>

          {/* Stars */}
          <div className="flex items-center gap-2 mb-5">
            <StarDisplay rating={avgRating} />
            <span className="text-xs text-neutral-600">
              {reviews.length > 0
                ? `${avgRating.toFixed(1)} (${reviews.length} review${reviews.length !== 1 ? "s" : ""})`
                : "No reviews yet"}
            </span>
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

      {/* Tabs */}
      <div className="mt-20">
        <div className="flex gap-0 mb-0">
          <button
            onClick={() => setActiveTab("description")}
            className={`border-b text-sm px-5 py-2.5 transition-colors ${
              activeTab === "description"
                ? "border-white text-white font-medium"
                : "border-white/10 text-neutral-600 hover:text-white"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`border-b text-sm px-5 py-2.5 transition-colors ${
              activeTab === "reviews"
                ? "border-white text-white font-medium"
                : "border-white/10 text-neutral-600 hover:text-white"
            }`}
          >
            Reviews {reviews.length > 0 && <span className="text-[10px] text-neutral-600 ml-1">({reviews.length})</span>}
          </button>
        </div>

        <div className="border border-t-0 border-white/5 px-5 py-6">
          {activeTab === "description" ? (
            <>
              <p className="text-sm text-neutral-500 leading-relaxed mb-3">
                We're a rising brand dedicated to delivering 100% organic cotton products with unique designs and
                unparalleled comfort.
              </p>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Every piece is crafted with care, ensuring softness, durability, and a style that stands out.
                Wear it your way.
              </p>
            </>
          ) : (
            <div className="flex flex-col gap-8">

              {/* Review form */}
              <div>
                <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-4">
                  {token ? "Leave a Review" : "Log in to leave a review"}
                </p>
                {token ? (
                  <form onSubmit={submitReview} className="flex flex-col gap-3 max-w-lg">
                    <StarInput value={rating} onChange={setRating} />
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts (optional)..."
                      rows={3}
                      className="bg-transparent border border-white/8 text-white text-sm py-2.5 px-3 placeholder:text-neutral-700 focus:border-white/25 focus:outline-none transition-colors resize-none"
                    />
                    <div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-white text-black px-8 py-2.5 text-[11px] tracking-[0.2em] font-medium hover:bg-[#FAB29E] transition-colors disabled:opacity-50"
                      >
                        {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className="text-xs text-neutral-600">
                    <a href="/login" className="text-[#FAB29E] hover:underline">Sign in</a> to share your experience with this product.
                  </p>
                )}
              </div>

              {/* Reviews list */}
              <div className="flex flex-col gap-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-neutral-700">No reviews yet. Be the first to review this product.</p>
                ) : (
                  reviews.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map((r) => (
                    <div key={r._id} className="border-b border-white/5 pb-4 last:border-0">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-white font-medium">{r.userName}</span>
                          <StarDisplay rating={r.rating} size={12} />
                        </div>
                        <span className="text-[10px] text-neutral-700">
                          {new Date(r.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>
                      {r.comment && <p className="text-sm text-neutral-500 leading-relaxed">{r.comment}</p>}
                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
    </div>
  );
};

export default Product;
