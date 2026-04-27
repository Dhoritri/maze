import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import { useLocation } from "react-router-dom";

const Searchbar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(location.pathname.includes("collection"));
  }, [location]);

  if (!showSearch || !visible) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#191919]">
      <img src={assets.search_icon} className="w-3.5 opacity-30 flex-shrink-0" alt="" />
      <input
        autoFocus
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="flex-1 bg-transparent text-sm text-white placeholder:text-neutral-700 outline-none"
      />
      <button
        onClick={() => setShowSearch(false)}
        className="opacity-30 hover:opacity-70 transition-opacity flex-shrink-0"
      >
        <img src={assets.cross_icon} className="w-3" alt="Close" />
      </button>
    </div>
  );
};

export default Searchbar;
