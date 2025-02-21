import { NavBar } from "../components/NavBar";
import { HeroSection } from "../components/Hero";
import { FeaturesSection } from "../components/FeaturesSection";

export const Landing = () => {
  return (
    <div className="relative bg-[#353535]">
      {/* Background Image for Entire Page */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-80 z-0"
        style={{ backgroundImage: "url('/assets/bgImage.png')" }}
      />

      {/* Content Layer */}
      <NavBar />
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
      </div>
    </div>
  );
};
