import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const AddIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M12 8v8M8 12h8"/>
  </svg>
);

const ListIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>
  </svg>
);

const OrderIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <path d="M9 12h6M9 16h4"/>
  </svg>
);

const links = [
  { to: "/add",    label: "Add Product", Icon: AddIcon },
  { to: "/list",   label: "Products",    Icon: ListIcon },
  { to: "/orders", label: "Orders",      Icon: OrderIcon },
];

const Sidebar = () => {
  return (
    <aside className="w-56 flex-shrink-0 bg-[#0a0a0a] border-r border-white/5 flex flex-col">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-white/5">
        <img src={assets.logo} className="w-20" alt="Maze" />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3">
        <p className="text-[9px] tracking-[0.2em] text-neutral-700 uppercase px-3 mb-3">Menu</p>
        <div className="flex flex-col gap-0.5">
          {links.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 text-xs tracking-wide transition-colors rounded-sm ${
                  isActive
                    ? "text-white bg-white/6 border-l-2 border-[#FAB29E]"
                    : "text-neutral-600 hover:text-white hover:bg-white/3"
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom badge */}
      <div className="p-4 border-t border-white/5">
        <p className="text-[9px] tracking-widest text-neutral-800 uppercase">Maze Admin v1.0</p>
      </div>
    </aside>
  );
};

export default Sidebar;
