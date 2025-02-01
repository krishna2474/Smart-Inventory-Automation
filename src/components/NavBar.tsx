import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type NavBarProps = {
  type: "signup" | "signin" | "landing";
};

export const NavBar = ({ type }: NavBarProps) => {
  const nav = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative flex items-center justify-between h-20 text-white px-6 md:px-20 leading-[1]">
      {/* Logo */}
      <div>
        <Link to="/" className="flex items-center">
          <img
            src="/assets/SIA-Dark.png"
            alt="logo"
            width={100}
            className="hover:scale-105 transition-all"
          />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="xl:hidden text-white text-4xl absolute right-6 top-6 z-50"
        onClick={toggleMenu}
      >
        {menuOpen ? (
          <X height={50} width={35} />
        ) : (
          <Menu height={50} width={35} />
        )}
      </button>

      {/* Desktop Navigation */}
      <div className="hidden xl:flex items-center gap-6 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl transition-all hover:shadow-white hover:shadow-sm xl:max-w-fit mx-auto">
        {["Home", "About", "Help", "Contact"].map((item, idx) => {
          const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
          const isActive = location.pathname === path;

          return (
            <Link
              key={idx}
              to={path}
              className={`px-6 py-3 text-lg font-semibold rounded-md transition duration-200 ease-in-out ${
                isActive ? "text-white" : "text-white/50"
              } hover:text-white`}
            >
              {item}
            </Link>
          );
        })}
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black/90 backdrop-blur-lg p-6 transform transition-transform duration-300 ease-in-out z-40 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <nav className="flex flex-col items-start mt-10 gap-6">
          {["Home", "About", "Help", "Contact"].map((item, idx) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            return (
              <Link
                key={idx}
                to={path}
                className="text-white text-xl font-semibold hover:text-gray-300"
                onClick={closeMenu}
              >
                {item}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Login / Signup Buttons */}
      <div className="hidden xl:flex items-center justify-center gap-2">
        {type === "landing" ? (
          <>
            <button
              type="button"
              className="relative text-black bg-white font-medium rounded-lg text-sm px-6 py-3 overflow-hidden group"
              onClick={() => nav("/signin")}
            >
              Login
            </button>
            <button
              type="button"
              className="relative text-black bg-white font-medium rounded-lg text-sm px-6 py-3 overflow-hidden group"
              onClick={() => nav("/signup")}
            >
              Signup
            </button>
          </>
        ) : (
          <button
            type="button"
            className="relative text-black bg-white font-medium rounded-lg text-sm px-6 py-3 overflow-hidden group"
            onClick={() => nav(type === "signin" ? "/signup" : "/signin")}
          >
            {type === "signup" ? "Login" : "Signup"}
          </button>
        )}
      </div>
    </header>
  );
};
