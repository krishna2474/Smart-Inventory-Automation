import { motion } from "framer-motion";

export const HeroSection = () => {
  return (
    <div className="h-screen flex flex-col mt-10 md:mt-0 md:justify-center px-6 max-w-4xl xxl:max-w-8xl mx-auto text-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl md:text-7xl xxl:text-8xl text-white uppercase font-bebas tracking-tight"
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

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        className="text-[#E5E5E5] mt-4 font-nunito"
      >
        Streamline your inventory management with advanced AI technology.
        Automate data entry, track real-time updates, and optimize operations
        effortlessly.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        className="mt-6"
      >
        <a href="#features">
          <button className="p-5 bg-purple-600 text-white py-2 rounded-md shadow-lg relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700">
            Start Automating
          </button>
        </a>
      </motion.div>
    </div>
  );
};
