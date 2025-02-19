import { Card } from "../components/Card";
import { NavBar } from "../components/NavBar";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

export const Landing = () => {
  const controls = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const featureSection = document.getElementById("features");
      const scrollPosition = window.scrollY + window.innerHeight;
      if (featureSection && scrollPosition >= featureSection.offsetTop - 50) {
        controls.start({ opacity: 1, y: 0 });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controls]);

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
        {/* Hero Section */}
        <div className="h-screen flex flex-col md:justify-center px-6 max-w-4xl xxl:max-w-8xl mx-auto text-center">
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
            Automate data entry, track real-time updates, and optimize
            operations effortlessly. Transform your business with intelligent
            solutions tailored for efficiency and accuracy.
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

        {/* Features Section with Closer Position */}
        <motion.div
          id="features"
          initial={{ opacity: 0, y: 50 }}
          animate={controls}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="min-h-screen -mt-20 scroll-mt-0"
        >
          <div className="text-white font-bebas text-3xl md:text-6xl mt-4 flex justify-center">
            Why Use Smart Inventory Automation?
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10 my-6">
              <Card
                icon={"/assets/realtime.png"}
                text={
                  "Keep your inventory data up-to-date with real-time tracking."
                }
                title="Real-Time Inventory Tracking"
              />
              <Card
                icon={"/assets/Automated Data.png"}
                text={"Reduce manual errors with automated data input."}
                title="Automated Data Entry"
              />
              <Card
                icon={"/assets/lowStockAlerts.png"}
                text={"Never run out of stock with timely alerts."}
                title="Low Stock Alerts"
              />
              <Card
                icon={"/assets/secure.png"}
                text={"Manage and monitor payments securely and efficiently."}
                title="Secure Payments Tracking"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
