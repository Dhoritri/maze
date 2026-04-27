import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const CATEGORIES = ["Men", "Women", "Kids"];
const TYPES = ["Topwear", "Bottomwear", "Winterwear"];

const FilterChip = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2.5 cursor-pointer group">
    <div
      className={`w-3.5 h-3.5 border flex-shrink-0 flex items-center justify-center transition-colors ${
        checked ? "border-[#FAB29E] bg-[#FAB29E]" : "border-white/20 group-hover:border-white/40"
      }`}
    >
      {checked && (
        <svg className="w-2 h-2" fill="none" viewBox="0 0 10 10" stroke="#000" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 5l2.5 2.5 4.5-4.5" />
        </svg>
      )}
    </div>
    <input type="checkbox" value={label} onChange={onChange} checked={checked} className="hidden" />
    <span className={`text-xs transition-colors ${checked ? "text-white" : "text-neutral-500 group-hover:text-white"}`}>
      {label}
    </span>
  </label>
);

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleFilter = (val, setter) =>
    setter((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));

  useEffect(() => {
    let result = [...products];
    if (showSearch && search) result = result.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category.length) result = result.filter((p) => category.includes(p.category));
    if (subCategory.length) result = result.filter((p) => subCategory.includes(p.subCategory));
    if (sortType === "low-high") result.sort((a, b) => a.price - b.price);
    else if (sortType === "high-low") result.sort((a, b) => b.price - a.price);
    setFilterProducts(result);
  }, [category, subCategory, search, showSearch, products, sortType]);

  return (
    <div className="pt-10 pb-24">
      <div className="flex flex-col sm:flex-row gap-10">

        {/* Sidebar */}
        <aside className="w-full sm:w-52 flex-shrink-0">
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center justify-between w-full mb-6 sm:cursor-default"
          >
            <span className="text-[10px] tracking-[0.2em] text-neutral-500 uppercase">Filters</span>
            <img
              src={assets.dropdown_icon}
              className={`w-3 sm:hidden opacity-40 transition-transform ${showFilter ? "rotate-90" : ""}`}
              alt=""
            />
          </button>

          <div className={`${showFilter ? "block" : "hidden"} sm:block space-y-8`}>
            <div>
              <p className="text-[10px] tracking-[0.2em] text-neutral-700 uppercase mb-4">Category</p>
              <div className="flex flex-col gap-3">
                {CATEGORIES.map((cat) => (
                  <FilterChip
                    key={cat}
                    label={cat}
                    checked={category.includes(cat)}
                    onChange={(e) => toggleFilter(e.target.value, setCategory)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-[0.2em] text-neutral-700 uppercase mb-4">Type</p>
              <div className="flex flex-col gap-3">
                {TYPES.map((type) => (
                  <FilterChip
                    key={type}
                    label={type}
                    checked={subCategory.includes(type)}
                    onChange={(e) => toggleFilter(e.target.value, setSubCategory)}
                  />
                ))}
              </div>
            </div>

            {(category.length > 0 || subCategory.length > 0) && (
              <button
                onClick={() => { setCategory([]); setSubCategory([]); }}
                className="text-[10px] tracking-wide text-neutral-600 hover:text-white transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-8">
            <Title text1="ALL" text2="COLLECTIONS" />
            <select
              onChange={(e) => setSortType(e.target.value)}
              value={sortType}
              className="bg-transparent border border-white/10 text-neutral-500 text-[11px] tracking-wider py-2 px-3 focus:outline-none focus:border-white/25 transition-colors cursor-pointer"
            >
              <option value="relevant" className="bg-[#191919]">Relevant</option>
              <option value="low-high" className="bg-[#191919]">Price: Low – High</option>
              <option value="high-low" className="bg-[#191919]">Price: High – Low</option>
            </select>
          </div>

          {filterProducts.length === 0 ? (
            <div className="py-24 text-center text-neutral-700 text-sm">
              No products match your filters.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-10">
              {filterProducts.map((item, i) => (
                <ProductItem key={i} name={item.name} id={item._id} price={item.price} image={item.image} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
