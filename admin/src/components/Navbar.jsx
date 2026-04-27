import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
        <span className="text-xs text-neutral-600 tracking-wide">Live</span>
      </div>
      <button
        onClick={() => setToken("")}
        className="text-[10px] tracking-[0.2em] text-neutral-500 border border-white/8 px-4 py-1.5 hover:text-white hover:border-white/25 transition-colors"
      >
        SIGN OUT
      </button>
    </header>
  );
};

export default Navbar;
