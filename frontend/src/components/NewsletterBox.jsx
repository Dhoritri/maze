const NewsletterBox = () => {
  const onSubmitHandler = (e) => e.preventDefault();

  return (
    <section className="py-20 border-t border-white/5">
      <div className="max-w-lg mx-auto text-center">
        <p className="text-[10px] tracking-[0.25em] text-neutral-600 uppercase mb-4">Stay in the Loop</p>
        <h2 className="prata-regular text-2xl sm:text-3xl text-white mb-4">
          Get Early Access
        </h2>
        <p className="text-xs text-neutral-500 mb-8 leading-relaxed">
          Be the first to know about new drops, exclusive offers, and behind-the-scenes stories.
        </p>
        <form
          onSubmit={onSubmitHandler}
          className="flex border border-white/8 overflow-hidden focus-within:border-white/20 transition-colors"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-neutral-700 outline-none"
          />
          <button
            type="submit"
            className="bg-white text-black text-[10px] tracking-[0.2em] px-6 font-medium hover:bg-[#FAB29E] transition-colors whitespace-nowrap"
          >
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterBox;
