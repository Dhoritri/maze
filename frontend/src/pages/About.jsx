import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import Title from "../components/Title";

const About = () => {
  return (
    <div className="pt-10 pb-10">

      <div className="mb-16">
        <p className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase mb-3">Our Story</p>
        <Title text1="ABOUT" text2="US" />
      </div>

      <div className="flex flex-col md:flex-row gap-16 mb-24">
        <img
          className="w-full md:max-w-[420px] h-auto object-cover"
          src={assets.about_img}
          alt="Maze Clothing"
        />
        <div className="flex flex-col justify-center gap-5 text-sm text-neutral-400 leading-relaxed">
          <p>
            Welcome to Maze — where fashion, comfort, and creativity meet. We design for anime lovers, comfort seekers,
            and creative individuals. Each piece blends unique culture with soft, breathable fabrics for everyday wear.
          </p>
          <p>
            Style and comfort go hand in hand at Maze. Our 100% organic cotton garments are perfect for any occasion,
            from a bike ride to lounging at home.
          </p>
          <p>
            Join us in embracing sustainable fashion. Maze is where comfort and creativity collide.
          </p>
          <div className="pt-2">
            <p className="text-white font-medium mb-2">Our Mission</p>
            <p>
              Combine unique design with eco-friendly, comfortable clothing that helps you express your individuality
              while staying comfortable all day long.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase mb-3">Our Promise</p>
        <Title text1="WHY" text2="CHOOSE US" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 mb-24">
        {[
          {
            title: "Quality Assurance",
            desc: "Made with 100% organic cotton — soft, breathable, and sustainable.",
          },
          {
            title: "Versatility",
            desc: "Perfect for bike rides, city exploring, or just relaxing at home.",
          },
          {
            title: "Customer Support",
            desc: "Our dedicated team is always here for you, before and after purchase.",
          },
        ].map(({ title, desc }) => (
          <div key={title} className="p-10 bg-[#191919] hover:bg-white/2 transition-colors">
            <p className="text-white text-sm font-medium mb-3">{title}</p>
            <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <NewsletterBox />
    </div>
  );
};

export default About;
