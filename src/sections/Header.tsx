"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "../assets/logo.svg";
import MenuIcon from "../assets/icon-menu.svg";
import { Button } from "@/components/Button";
import Signup from "@/components/auth/Signup";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSignupOpen, setSignupOpen] = useState(false);
  console.log(pathname);

  useEffect(() => {
    setSignupOpen(pathname === "/signup");
    // Replace this with your actual authentication check (e.g., checking for a token)
    const token = localStorage.getItem("authToken");
  }, [pathname]);

  const openSignup = () => {
    router.push("/signup", { scroll: false });
  };

  const closeSignup = () => {
    router.back();
  };

  const goToProfile = () => {
    router.push("/profile"); // Replace with your actual profile route
  };

  const goToDashboard = () => {
    router.push("/dashboard"); // Replace with your actual dashboard route
  };

  const isAuthPage = ["/login", "/signup", "/verify"].includes(pathname);

  return (
    <>
      <header className="py-4 border-b border-white/15 md:border-none sticky top-0 z-10">
        <div className="absolute inset-0 backdrop-blur -z-10 md:hidden"></div>
        <div className="container">
          <div className="flex justify-between items-center md:border border-white/15 md:backdrop-blur md:p-2.5 rounded-xl max-w-2xl mx-auto">
            <div>
              <div className="border h-14 w-14 rounded-lg inline-flex justify-center items-center border-white/15">
                <Logo className="h-12 w-12" />
              </div>
            </div>
            <div className="hidden md:block">
              <nav className="flex gap-8 text-sm">
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition"
                >
                  About
                </a>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition"
                >
                  Help
                </a>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition"
                >
                  Contact
                </a>
                <a
                  href="#"
                  className="text-white/70 hover:text-white transition"
                >
                  Pricing
                </a>
              </nav>
            </div>
            <div className="flex gap-4 items-center">
              <Button onClick={openSignup}>Get Started</Button>

              <span>
                <MenuIcon className="md:hidden" />
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Signup Modal */}
      {isSignupOpen && <Signup isOpen={true} onClose={closeSignup} />}
    </>
  );
};
