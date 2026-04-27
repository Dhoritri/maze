import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";
import Title from "../components/Title";

const Contact = () => {
  return (
    <div className="pt-10 pb-10">
      <div className="mb-16">
        <p className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase mb-3">Get in Touch</p>
        <Title text1="CONTACT" text2="US" />
      </div>

      <div className="flex flex-col md:flex-row gap-16 mb-24">
        <img
          src={assets.contact_img}
          className="w-full md:max-w-[460px] object-cover"
          alt="Contact Maze"
        />

        <div className="flex flex-col justify-center gap-8">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-4">Our Store</p>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Malibagh Mour<br />
              Mouchak Tower, Level-15
            </p>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-4">Phone</p>
            <div className="flex flex-col gap-1 text-sm text-neutral-400">
              <span>+880 01700921615</span>
              <span>+880 01796582064</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] tracking-[0.2em] text-neutral-600 uppercase mb-4">Email</p>
            <a
              href="mailto:officiallmmaze@gmail.com"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              officiallmmaze@gmail.com
            </a>
          </div>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
