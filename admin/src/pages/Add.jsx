import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const inputCls = "w-full bg-transparent border border-white/8 text-white text-sm py-2.5 px-3 placeholder:text-neutral-700 focus:border-white/25 focus:outline-none transition-colors";
const labelCls = "text-[10px] tracking-[0.15em] text-neutral-500 uppercase mb-2 block";

const SIZES = ["XS", "S", "M", "L", "XL"];

const Add = ({ token }) => {
  const [images, setImages] = useState([false, false, false, false]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState([]);

  const setImage = (idx, file) =>
    setImages((prev) => prev.map((img, i) => (i === idx ? file : img)));

  const toggleSize = (s) =>
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestseller", bestseller);
      formData.append("sizes", JSON.stringify(sizes));
      images.forEach((img, i) => img && formData.append(`image${i + 1}`, img));

      const { data } = await axios.post(backendUrl + "/api/product/add", formData, { headers: { token } });
      if (data.success) {
        toast.success("Product added");
        setName(""); setDescription(""); setPrice("");
        setImages([false, false, false, false]);
        setSizes([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-1">Inventory</p>
        <h1 className="text-xl font-medium text-white">Add Product</h1>
      </div>

      <form onSubmit={onSubmitHandler} className="flex flex-col gap-7">

        {/* Images */}
        <div>
          <p className={labelCls}>Product Images</p>
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <label
                key={idx}
                htmlFor={`img-${idx}`}
                className="aspect-square border border-white/8 hover:border-white/20 transition-colors cursor-pointer flex items-center justify-center overflow-hidden group"
              >
                {img ? (
                  <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-neutral-700 group-hover:text-neutral-500 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                      <polyline points="17 8 12 3 7 8"/>
                      <line x1="12" y1="3" x2="12" y2="15"/>
                    </svg>
                    <span className="text-[9px] tracking-wider">{idx === 0 ? "MAIN" : `IMG ${idx + 1}`}</span>
                  </div>
                )}
                <input
                  type="file"
                  id={`img-${idx}`}
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(idx, e.target.files[0])}
                />
              </label>
            ))}
          </div>
        </div>

        {/* Name */}
        <div>
          <label className={labelCls}>Product Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            required
            className={inputCls}
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelCls}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the product..."
            required
            rows={3}
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Category / SubCategory / Price */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls} cursor-pointer`}>
              <option value="Men" className="bg-[#141414]">Men</option>
              <option value="Women" className="bg-[#141414]">Women</option>
              <option value="Kids" className="bg-[#141414]">Kids</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Type</label>
            <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} className={`${inputCls} cursor-pointer`}>
              <option value="Topwear" className="bg-[#141414]">Topwear</option>
              <option value="Bottomwear" className="bg-[#141414]">Bottomwear</option>
              <option value="Winterwear" className="bg-[#141414]">Winterwear</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Price (/-)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              required
              className={inputCls}
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className={labelCls}>Sizes</label>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSize(s)}
                className={`w-10 h-10 text-xs border transition-colors ${
                  sizes.includes(s)
                    ? "border-[#FAB29E] text-white bg-[#FAB29E]/10"
                    : "border-white/10 text-neutral-600 hover:border-white/25 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <label className="flex items-center gap-3 cursor-pointer group w-fit">
          <div
            onClick={() => setBestseller((p) => !p)}
            className={`w-4 h-4 border flex items-center justify-center transition-colors ${
              bestseller ? "border-[#FAB29E] bg-[#FAB29E]" : "border-white/20 group-hover:border-white/40"
            }`}
          >
            {bestseller && (
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 10 10" stroke="#000" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 5l2.5 2.5 4.5-4.5" />
              </svg>
            )}
          </div>
          <span className="text-xs text-neutral-400 group-hover:text-white transition-colors">Mark as Bestseller</span>
        </label>

        <div className="pt-2 border-t border-white/5">
          <button
            type="submit"
            className="bg-white text-black px-8 py-3 text-[11px] tracking-[0.2em] font-medium hover:bg-[#FAB29E] transition-colors"
          >
            PUBLISH PRODUCT
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;
