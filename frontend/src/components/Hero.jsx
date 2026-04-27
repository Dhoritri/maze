import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row min-h-[70vh] mt-1 overflow-hidden">
      {/* Left */}
      <div className="w-full sm:w-1/2 flex items-center py-16 sm:py-0 sm:pr-12">
        <div className="max-w-md">
          <p className="text-xs tracking-[0.25em] text-[#FAB29E] mb-6 uppercase">
            New Season 2025
          </p>
          <h1 className="prata-regular text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
            Latest<br />Arrivals
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed mb-10 max-w-xs">
            100% organic cotton. Crafted for those who appreciate design, comfort, and individuality.
          </p>
          <Link
            to="/collection"
            className="inline-flex items-center gap-4 text-xs tracking-[0.2em] text-white group"
          >
            SHOP NOW
            <span className="block w-10 h-px bg-white/40 transition-all duration-500 group-hover:w-20 group-hover:bg-[#FAB29E]" />
          </Link>
        </div>
      </div>

      {/* Right */}
      <div className="w-full sm:w-1/2 overflow-hidden">
        <img
          src={assets.colder}
          alt="Latest Arrivals"
          className="w-full h-full object-cover object-top"
          style={{ maxHeight: "80vh", minHeight: "400px" }}
        />
      </div>
    </div>
  );
};

export default Hero;
