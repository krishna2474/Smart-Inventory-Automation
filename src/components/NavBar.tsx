import { Link, useLocation } from "react-router-dom";
import { AuthForm } from "./AuthForm";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export const NavBar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const openModal = (signup = false) => {
    setIsSignup(signup);
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  return (
    <>
      {/* Navbar */}
      <header className="relative flex items-center justify-between h-20 text-white px-6 md:px-20">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/assets/SIA-Dark.png"
            alt="logo"
            width={100}
            className="hover:scale-105 transition-all"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="xl:hidden text-white text-4xl absolute right-6 top-6 z-50"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={35} /> : <Menu size={35} />}
        </button>

        {/* Desktop Menu */}
        <nav className="hidden xl:flex items-center gap-6 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl transition-all hover:shadow-white hover:shadow-sm">
          {["Home", "About", "Help", "Contact"].map((item, idx) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            return (
              <Link
                key={idx}
                to={path}
                className={`px-6 py-2 text-lg font-semibold rounded-md transition duration-200 ${
                  location.pathname === path
                    ? "text-white"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {item}
              </Link>
            );
          })}
        </nav>

        {/* Auth Buttons (Desktop) */}
        <div className="hidden xl:flex items-center gap-3">
          <button
            className="px-6 py-3 text-black bg-white rounded-lg hover:bg-gray-200 transition"
            onClick={() => openModal(false)}
          >
            Login
          </button>
          <button
            className="px-6 py-3 text-black bg-white rounded-lg hover:bg-gray-200 transition"
            onClick={() => openModal(true)}
          >
            Signup
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="xl:hidden fixed inset-0 bg-black/90 flex flex-col items-center justify-center space-y-6 text-white text-2xl z-50">
          {["Home", "About", "Help", "Contact"].map((item, idx) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            return (
              <Link
                key={idx}
                to={path}
                onClick={closeMenu}
                className="hover:text-purple-400"
              >
                {item}
              </Link>
            );
          })}
          <button
            className="mt-4 px-6 py-3 text-black bg-white rounded-lg hover:bg-gray-200 transition"
            onClick={() => {
              closeMenu();
              openModal(false);
            }}
          >
            Login
          </button>
          <button
            className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-500 transition"
            onClick={() => {
              closeMenu();
              openModal(true);
            }}
          >
            Signup
          </button>
        </nav>
      )}

      {/* Auth Modal */}
      {modalOpen && (
        <AuthForm
          isSignup={isSignup}
          closeModal={closeModal}
          toggleMode={() => setIsSignup(!isSignup)}
        />
      )}
    </>
  );
};
