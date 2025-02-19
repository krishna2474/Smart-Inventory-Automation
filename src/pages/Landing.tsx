import { Card } from "../components/Card";
import { NavBar } from "../components/NavBar";
import { motion } from "framer-motion";

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
        <div className="px-6 pt-24 md:pt-32 max-w-4xl mx-auto text-center">
          {/* Animated Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-7xl text-white uppercase font-bebas tracking-tight"
          >
            Seamless Inventory Management
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="text-2xl md:text-6xl text-white font-bebas tracking-tight"
          >
            Powered by Intelligent Automation
          </motion.h2>

          {/* Animated Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="text-[#E5E5E5] mt-4 font-nunito"
          >
            Streamline your inventory management with advanced AI
            technology.Automate data entry, track real-time updates, and
            optimize operations effortlessly.Transform your business with
            intelligent solutions tailored for efficiency and accuracy.
          </motion.p>

          {/* Animated Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
            className="mt-6"
          >
            <button className="p-5 bg-purple-600 text-white py-2 rounded-md shadow-lg relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700">
              Start Automating
            </button>
          </motion.div>
        </div>
        <div className="text-white font-bebas text-4xl mt-32 flex justify-center">
          Why to use Smart Inventory Automation?
        </div>
        <div>
          <Card
            icon={"/assets/realTime.png"}
            text={"Test Text"}
            title="Real-Time Inventory Tracking"
          />
        </div>
      </div>
    </div>
  );
};
