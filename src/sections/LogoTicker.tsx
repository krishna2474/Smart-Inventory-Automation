"use client";
import PGLogo from "@/assets/PGLogo.png";
import CloudflareLogo from "@/assets/CloudflareLogo.png";
import NextLogo from "@/assets/NextLogo.png";
import PrismaLogo from "@/assets/PrismaLogo.png";
import GeminiLogo from "@/assets/GeminiLogo.png";
import Image from "next/image";
import { motion } from "framer-motion";
export const LogoTicker = () => {
  return (
    <section className="py-20 md:py-24">
      <div className="container">
        <div className="flex items-center gap-5">
          <div className="flex-1 md:flex-none">
            <h2 className="">Built with Cutting-Edge Technologies</h2>
          </div>
          <div
            className="flex flex-1 overflow-hidden"
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)",
            }}
          >
            <motion.div
              initial={{ translateX: "-50%" }}
              animate={{ translateX: "0" }}
              transition={{
                repeat: Infinity,
                duration: 10,
                ease: "linear",
              }}
              className="flex flex-none gap-14 pr-14 -translate-x-1/2 "
            >
              {[
                PGLogo,
                CloudflareLogo,
                NextLogo,
                GeminiLogo,
                PrismaLogo,
                PGLogo,
                CloudflareLogo,
                NextLogo,
                GeminiLogo,
                PrismaLogo,
              ].map((logo) => {
                return (
                  <Image
                    src={logo.src}
                    width={logo.width}
                    height={logo.height}
                    key={logo.src}
                    alt="logo"
                    className="h-20 w-auto"
                  />
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
