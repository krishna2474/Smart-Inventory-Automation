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
    <div className="flex flex-col items-center text-center bg-gradient-to-r from-[#3c1e10] to-[#1c1c1c] text-white p-6 rounded-2xl shadow-lg max-w-sm border border-gray-600">
      <img src={icon} alt="icon" className="w-12 h-12 mb-3" />
      <h3 className="text-lg font-bold uppercase tracking-wide border-b-2 pb-1">
        {title}
      </h3>
      <p className="mt-2 text-sm">{text}</p>
    </div>
  );
};
