import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [discounts, setDiscounts] = useState({});

  const fetchList = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/product/list");
      if (data.success) {
        setList(data.products);
        const d = {};
        data.products.forEach((p) => { d[p._id] = p.discount || 0; });
        setDiscounts(d);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const { data } = await axios.post(backendUrl + "/api/product/remove", { id }, { headers: { token } });
      if (data.success) {
        toast.success("Product removed");
        await fetchList();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateDiscount = async (id) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/product/discount",
        { id, discount: Number(discounts[id]) },
        { headers: { token } }
      );
      if (data.success) {
        toast.success("Discount updated");
        await fetchList();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => { fetchList(); }, []);

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-1">Inventory</p>
        <h1 className="text-xl font-medium text-white">Products</h1>
      </div>

      {list.length === 0 ? (
        <div className="border border-white/5 py-16 flex flex-col items-center gap-3">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-700">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
          </svg>
          <p className="text-xs text-neutral-700 tracking-wider">NO PRODUCTS FOUND</p>
        </div>
      ) : (
        <div className="flex flex-col gap-px">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[56px_1fr_100px_90px_160px_60px] gap-4 px-4 py-2.5 bg-white/3">
            <span />
            <p className="text-[9px] tracking-[0.18em] text-neutral-600 uppercase">Name</p>
            <p className="text-[9px] tracking-[0.18em] text-neutral-600 uppercase">Category</p>
            <p className="text-[9px] tracking-[0.18em] text-neutral-600 uppercase">Price</p>
            <p className="text-[9px] tracking-[0.18em] text-neutral-600 uppercase">Discount Price</p>
            <span />
          </div>

          {list.map((item) => (
            <div
              key={item._id}
              className="grid grid-cols-1 md:grid-cols-[56px_1fr_100px_90px_160px_60px] gap-4 items-center px-4 py-3 bg-white/[0.02] border border-white/4 hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-14 h-14 overflow-hidden flex-shrink-0">
                <img src={item.image[0]} alt={item.name} className="w-full h-full object-cover" />
              </div>

              <div>
                <p className="text-sm text-white leading-snug">{item.name}</p>
                <p className="text-[10px] text-neutral-600 mt-0.5">{item.subCategory}</p>
              </div>

              <p className="text-xs text-neutral-400">{item.category}</p>

              <p className="text-sm text-white font-medium">{item.price}{currency}</p>

              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={discounts[item._id] ?? 0}
                  onChange={(e) => setDiscounts((prev) => ({ ...prev, [item._id]: e.target.value }))}
                  className="w-20 bg-transparent border border-white/8 text-white text-xs py-1.5 px-2 focus:border-white/25 focus:outline-none transition-colors placeholder:text-neutral-700"
                  placeholder="0"
                />
                <button
                  onClick={() => updateDiscount(item._id)}
                  className="text-[9px] tracking-[0.15em] text-neutral-500 border border-white/8 px-2.5 py-1.5 hover:text-white hover:border-white/25 transition-colors whitespace-nowrap"
                >
                  SET
                </button>
              </div>

              <div className="flex justify-end md:justify-center">
                <button
                  onClick={() => removeProduct(item._id)}
                  className="text-neutral-700 hover:text-red-400 transition-colors"
                  title="Remove product"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                    <path d="M10 11v6M14 11v6"/>
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-neutral-700 mt-4">{list.length} product{list.length !== 1 ? "s" : ""}</p>
    </div>
  );
};

export default List;
