import React from 'react';

interface CustomSelectProps {
  label: string;
  value: string | number;
  options: { id: string | number; name: string }[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
}) => {
  return (
    <div className="mb-6 relative group">
      <label className="block text-sm font-medium text-white">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full mt-2 p-3 pr-10 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40 appearance-none"
        >
          <option value="" className="opacity-0">{placeholder}</option>
          {options.map((option) => (
            <option key={option.id} value={option.id} className="bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-black rounded-xl border border-white/20 shadow-inner">
              {option.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute top-1/2 right-4 transform -translate-y-1/2 transition-transform duration-300 ease-in-out group-focus-within:rotate-180">
          <svg
            className="w-4 h-4 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CustomSelect;
