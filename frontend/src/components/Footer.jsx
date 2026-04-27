import { assets } from "../assets/assets";
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-12 py-16">
        <div>
          <img src={assets.logo} className="w-24 mb-6" alt="Maze" />
          <p className="text-xs text-neutral-500 leading-relaxed max-w-xs">
            Crafted from 100% organic cotton with premium embroidery and prints.
            Fashion that respects comfort and the planet.
          </p>
          <div className="flex gap-3 mt-6">
            {[
              { href: "https://www.facebook.com/mazee.inc", Icon: FaFacebookF },
              { href: "https://instagram.com/mmaze.official", Icon: FaInstagram },
              { href: "#", Icon: FaTwitter },
            ].map(({ href, Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 border border-white/8 flex items-center justify-center text-neutral-600 hover:text-white hover:border-white/25 transition-colors"
              >
                <Icon size={12} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-5">Navigate</p>
          <ul className="flex flex-col gap-3">
            {[
              ["Home", "/"],
              ["Collection", "/collection"],
              ["About", "/about"],
              ["Orders", "/orders"],
              ["Privacy Policy", "/policy"],
            ].map(([label, path]) => (
              <li key={path}>
                <Link
                  to={path}
                  className="text-xs text-neutral-500 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-5">Contact</p>
          <ul className="flex flex-col gap-3 text-xs text-neutral-500">
            <li>+880 01796582064</li>
            <li>officialmazemaze@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5 py-6">
        <p className="text-[10px] tracking-[0.2em] text-neutral-700 text-center uppercase">
          © 2024 Mazewears — All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
