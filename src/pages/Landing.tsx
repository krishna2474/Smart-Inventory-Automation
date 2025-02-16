import { NavBar } from "../components/NavBar";

export const Landing = () => {
  return (
    <div className="relative min-h-screen bg-[#353535]">
      {/* Background Image with Opacity */}
      <div
        className="absolute inset-0 bg-center bg-no-repeat opacity-90"
        style={{ backgroundImage: "url('/assets/Background Image.png')" }}
      />

      {/* Content Layer */}
      <div className="relative z-10">
        <NavBar />
      </div>
    </div>
  );
};
