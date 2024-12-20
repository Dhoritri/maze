import { Helmet } from 'react-helmet';
import { assets } from "../assets/assets.js";

const Hero = () => {
  return (
    <div className="flex flex-col sm:flex-row border border-[#CED0CE]">
      <Helmet>
        {/* Preload the critical Hero image */}
        <link rel="preload" href={assets.colder} as="image" />
      </Helmet>

      {/* HeroLeft */}
      <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0">
        <div className="text-[#E6E8E6]">
          <div className="flex items-center gap-2">
            <p className="w-8 md:w-11 h-[2px] bg-[#E6E8E6]"></p>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLER</p>
          </div>
          <h1 className="prata-regular text-3xl sm:py-3 lg:text-5xl leading-relaxed">
            Latest Arrivals
          </h1>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-sm md:text-base">Shop Now</p>
            <p className="w-8 md:w-11 h-[2px] bg-[#E6E8E6]"> </p>
          </div>
        </div>
      </div>

      {/* Hero Right */}
      <img className="w-full sm:w-1/2" src={assets.colder} alt="Latest Arrivals Hero Image" />
    </div>
  );
};

export default Hero;
