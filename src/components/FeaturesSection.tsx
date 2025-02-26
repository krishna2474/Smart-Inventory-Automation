import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { Card } from "./Card";

export const FeaturesSection = () => {
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
    <motion.div
      id="features"
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen -mt-20 scroll-mt-0"
    >
      <div className="text-white font-bebas text-3xl md:text-6xl mt-4 flex justify-center">
        Why Use Smart Inventory Automation?
      </div>
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10 my-6">
          <Card
            icon="/assets/realtime.png"
            title="Real-Time Inventory Tracking"
            text="Keep your inventory data up-to-date with real-time tracking."
          />
          <Card
            icon="/assets/Automated Data.png"
            title="Automated Data Entry"
            text="Reduce manual errors with automated data input."
          />
          <Card
            icon="/assets/lowStockAlerts.png"
            title="Low Stock Alerts"
            text="Never run out of stock with timely alerts."
          />
          <Card
            icon="/assets/secure.png"
            title="Secure Payments Tracking"
            text="Manage and monitor payments securely and efficiently."
          />
        </div>
      </div>
    </motion.div>
  );
};
