import { NavBar } from "../components/NavBar";

export const Landing = () => {
  return (
    <div className="relative min-h-screen bg-[#353535]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-80"
        style={{ backgroundImage: "url('/assets/Background Image.png')" }}
      />

      {/* Content Layer */}
      <NavBar />
      <div className="relative z-10">
        {/* Hero Section */}
        <div className="px-6 pt-24 md:pt-32 max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl text-white uppercase font-bebas tracking-tight text-left md:text-center">
            Seamless Inventory Management
          </h1>
          <h2 className="text-3xl md:text-5xl text-white font-bebas tracking-tight text-left md:text-center">
            Powered by Intelligent Automation
          </h2>
          <p className="text-[#E5E5E5] mt-4 font-nunito text-left md:text-center">
            Streamline your inventory management with advanced AI technology.
            Automate data entry, track real-time updates, and optimize
            operations effortlessly. Transform your business with intelligent
            solutions tailored for efficiency and accuracy.
          </p>
          <div className="mt-6 text-left md:text-center">
            <button className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition">
              Start Automating
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
