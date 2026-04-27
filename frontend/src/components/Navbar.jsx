import { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../context/ShopContext.jsx";

const NAV_LINKS = [
  ["HOME", "/"],
  ["COLLECTION", "/collection"],
  ["ABOUT", "/about"],
  ["CONTACT", "/contact"],
];

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount, navigate, token, setToken, setCartItems } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <>
      <nav className="flex items-center justify-between py-5 border-b border-white/5">
        <Link to="/">
          <img src={assets.logo} width="112" className="w-24 sm:w-28" alt="Maze" />
        </Link>

        {/* Desktop links */}
        <ul className="hidden sm:flex items-center gap-8">
          {NAV_LINKS.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `text-xs tracking-[0.15em] transition-colors relative pb-0.5 ${
                  isActive ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-px after:bg-[#FAB29E]" : "text-neutral-500 hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setShowSearch(true)}
            className="text-neutral-500 hover:text-white transition-colors"
            aria-label="Search"
          >
            <img src={assets.search_icon} className="w-4.5 w-[18px]" alt="" />
          </button>

          {/* Profile dropdown */}
          <div className="relative group">
            <button
              onClick={() => !token && navigate("/login")}
              className="text-neutral-500 hover:text-white transition-colors"
              aria-label="Profile"
            >
              <img src={assets.profile_icon} className="w-[18px]" alt="" />
            </button>
            {token && (
              <div className="absolute right-0 top-9 w-44 bg-[#1c1c1c] border border-white/8 shadow-2xl hidden group-hover:block z-50">
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2.5 text-xs tracking-wide text-neutral-400 hover:text-white hover:bg-white/4 transition-colors">
                    My Profile
                  </button>
                  <button
                    onClick={() => navigate("/orders")}
                    className="w-full text-left px-4 py-2.5 text-xs tracking-wide text-neutral-400 hover:text-white hover:bg-white/4 transition-colors"
                  >
                    Orders
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2.5 text-xs tracking-wide text-neutral-400 hover:text-white hover:bg-white/4 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative text-neutral-500 hover:text-white transition-colors" aria-label="Cart">
            <img src={assets.cart_icon} className="w-[18px]" alt="" />
            {getCartCount() > 0 && (
              <span className="absolute -right-1.5 -bottom-1.5 w-3.5 h-3.5 bg-[#FAB29E] text-black text-[8px] font-bold rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setVisible(true)}
            className="sm:hidden text-neutral-500 hover:text-white transition-colors"
            aria-label="Menu"
          >
            <img src={assets.menu_icon} className="w-[18px]" alt="" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {visible && (
        <div className="fixed inset-0 z-50" onClick={() => setVisible(false)}>
          <div className="absolute inset-0 bg-black/70" />
          <div
            className="absolute top-0 right-0 h-full w-64 bg-[#161616] border-l border-white/6 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/6">
              <img src={assets.logo} className="w-20" alt="Maze" />
              <button onClick={() => setVisible(false)} className="text-neutral-500 hover:text-white">
                <img src={assets.cross_icon} className="w-3.5" alt="Close" />
              </button>
            </div>
            <nav className="flex flex-col py-2 flex-1">
              {NAV_LINKS.map(([label, path]) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/"}
                  onClick={() => setVisible(false)}
                  className={({ isActive }) =>
                    `px-5 py-3.5 text-xs tracking-[0.15em] border-b border-white/4 transition-colors ${
                      isActive ? "text-white bg-white/3" : "text-neutral-500 hover:text-white"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>
            {token && (
              <div className="border-t border-white/6 p-5 flex flex-col gap-1">
                <button
                  onClick={() => { navigate("/orders"); setVisible(false); }}
                  className="text-left text-xs tracking-wide text-neutral-500 hover:text-white py-2 transition-colors"
                >
                  Orders
                </button>
                <button
                  onClick={() => { logout(); setVisible(false); }}
                  className="text-left text-xs tracking-wide text-neutral-500 hover:text-white py-2 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
