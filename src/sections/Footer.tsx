import Logo from "@/assets/logo.svg";
import XSocial from "@/assets/social-x.svg";
import InstaSocial from "@/assets/social-instagram.svg";
import YTSocial from "@/assets/social-youtube.svg";
export const Footer = () => {
  return (
    <footer className="py-5 border-t border-white/15 ">
      <div className="container">
        <div className="flex flex-col gap-8 lg:flex-row  items-center">
          <div className="flex gap-2 items-center lg:flex-1">
            <Logo className="h-12 w-12" />
            <div className="font-medium">Smart Inventory Automation</div>
          </div>

          <nav className="flex flex-col lg:flex-row gap-5 lg:gap-7 lg:flex-1 text-center lg:justify-center">
            <a
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm"
            >
              Features
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm"
            >
              About
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm"
            >
              Contact
            </a>
            <a
              href="#"
              className="text-white/70 hover:text-white text-xs md:text-sm"
            >
              Docs
            </a>
          </nav>
          <div className="flex gap-5 lg:flex-1 lg:justify-end">
            <XSocial className="text-white/40 hover:text-white text-xs transition" />
            <InstaSocial className="text-white/40 hover:text-white text-xs transition" />
            <YTSocial className="text-white/40 hover:text-white text-xs transition" />
          </div>
        </div>
      </div>
    </footer>
  );
};
