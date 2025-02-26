import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const handleAuthNavigation = (path: any) => {
    navigate(path, { state: { backgroundLocation: location } });
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Navbar */}
      <header className="relative top-3 flex items-center justify-between h-14 text-white px-4 md:px-12 z-20">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/assets/SIA-Dark.png"
            alt="logo"
            width={90}
            className="hover:brightness-110 transition-all duration-300"
          />
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="xl:hidden text-white text-3xl absolute right-4 top-4 z-50"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

        {/* Desktop Menu */}
        <nav className="hidden absolute left-0 right-0 mx-auto xl:flex items-center justify-center gap-4 hover:gap-8 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl transition-all duration-150 w-[390px] hover:w-[450px] hover:shadow-white hover:shadow-sm overflow-hidden">
          {["Home", "About", "Help", "Contact"].map((item, idx) => {
            const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
            return (
              <Link
                key={idx}
                to={path}
                className={`px-4 py-1 text-base font-medium rounded-md transition-all duration-300 ${
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
            className="relative py-2 px-5 text-sm bg-[#C98C00] text-white rounded-md shadow-md overflow-hidden before:absolute before:top-0 before:left-[-250%] before:w-[250%] before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:transition-all before:duration-700 hover:before:left-[150%]"
            onClick={() => handleAuthNavigation("/login")}
          >
            Login
          </button>
          <button
            className="relative py-2 px-5 text-sm bg-[#C98C00] text-white rounded-md shadow-md overflow-hidden before:absolute before:top-0 before:left-[-250%] before:w-[250%] before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:transition-all before:duration-700 hover:before:left-[150%]"
            onClick={() => handleAuthNavigation("/signup")}
          >
            Signup
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <nav
        className={`xl:hidden fixed inset-0 bg-black/90 flex flex-col items-center justify-center space-y-5 text-white text-xl z-40 transform transition-transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {["Home", "About", "Help", "Contact"].map((item, idx) => {
          const path = item === "Home" ? "/" : `/${item.toLowerCase()}`;
          return (
            <Link
              key={idx}
              to={path}
              onClick={closeMenu}
              className="hover:text-yellow-400 transition-all"
            >
              {item}
            </Link>
          );
        })}
        <button
          className="relative py-2 px-5 text-sm bg-[#C98C00] text-white rounded-md shadow-md overflow-hidden before:absolute before:top-0 before:left-[-250%] before:w-[250%] before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:transition-all before:duration-700 hover:before:left-[150%]"
          onClick={() => {
            closeMenu();
            handleAuthNavigation("/login");
          }}
        >
          Login
        </button>
        <button
          className="relative py-2 px-5 text-sm bg-[#C98C00] text-white rounded-md shadow-md overflow-hidden before:absolute before:top-0 before:left-[-250%] before:w-[250%] before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:transition-all before:duration-700 hover:before:left-[150%]"
          onClick={() => {
            closeMenu();
            handleAuthNavigation("/signup");
          }}
        >
          Signup
        </button>
      </nav>
    </>
  );
};
