export const Card = ({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) => {
  return (
    <div className="flex flex-col items-center text-center bg-white/5 backdrop-blur-md text-white p-6 rounded-2xl shadow-md max-w-sm border border-white/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-white/50">
      <img
        src={icon}
        alt="icon"
        className="w-12 mb-4 transition-transform duration-300 hover:scale-105"
      />
      <h3 className="text-lg  uppercase tracking-tight font-bold underline">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[#e5e5e5] transition-opacity duration-300 hover:opacity-80">
        {text}
      </p>
    </div>
  );
};
