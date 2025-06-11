import starsBg from "@/assets/stars.png";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface BackgroundProps {
  children: ReactNode;
  className?: string; // Allow className prop
}

export const Background = ({ children, className }: BackgroundProps) => {
  const router = useRouter();

  return (
    <motion.section

      animate={{ backgroundPositionX: [0, 2000] }}
      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      className={`fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md ${className || ""}`}
      style={{
        backgroundImage: `url(${starsBg.src})`,
        backgroundSize: "cover",
        maskImage: "linear-gradient(to bottom,black 0%, black 100%)",
        WebkitMaskImage: "linear-gradient(to bottom black 0%, black 100%)",
      }}
      // onClick={() => router.push("/")} // Clicking outside closes modal
    >
      {/* Darker Radial Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(50,10,100,0.5)_30%,rgba(10,0,30,0.9)_80%)]"></div>

      {/* Purple Glow Effect */}
      <div className="absolute h-64 w-64 md:h-96 md:w-96 bg-purple-500 rounded-full border border-white/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(50%_50%_at_16.8%_18.3%,white,rgb(184,148,255)_37.7%,rgb(24,0,66))] shadow-[-20px_-20px_50px_rgb(255,255,255,.3),-20px_-20px_80px_rgb(255,255,255,.1),0_0_50px_rgb(140,69,255)]"></div>

      {/* Modal Wrapper */}
      <div
        className="relative p-6 rounded-lg shadow-xl w-[90%] max-w-md"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        {children}
      </div>
    </motion.section>
  );
};
