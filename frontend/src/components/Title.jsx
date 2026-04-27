const Title = ({ text1, text2 }) => {
  return (
    <div className="inline-flex flex-col items-start gap-2">
      <h2 className="prata-regular text-2xl sm:text-3xl text-white leading-tight">
        {text1}{text2 && <span className="text-[#FAB29E]"> {text2}</span>}
      </h2>
      <span className="w-8 h-px bg-[#FAB29E]/50" />
    </div>
  );
};

export default Title;
