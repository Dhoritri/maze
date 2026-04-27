import { assets } from "../assets/assets";

const policies = [
  { icon: assets.exchange_icon, title: "Hassle-Free Exchange", desc: "No questions asked exchange on all orders." },
  { icon: assets.quality_icon, title: "7-Day Returns", desc: "Easy, free returns within 7 days of delivery." },
  { icon: assets.support_img, title: "24/7 Support", desc: "Our team is always here to help you." },
];

const OurPolicy = () => {
  return (
    <section className="py-20 border-t border-white/5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5">
        {policies.map(({ icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center gap-5 p-10 bg-[#191919] hover:bg-white/2 transition-colors"
          >
            <img src={icon} className="w-7 opacity-50" alt={title} />
            <div>
              <p className="text-white text-sm font-medium mb-2">{title}</p>
              <p className="text-xs text-neutral-600 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurPolicy;
