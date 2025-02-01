import { Link, useNavigate, useLocation } from "react-router-dom";

type NavBarProps = {
  type: "signup" | "signin" | "landing";
};

export const NavBar = ({ type }: NavBarProps) => {
  const nav = useNavigate();
  const location = useLocation(); // Get the current location (path)

  // Function to handle "Home" link click
  const handleHomeClick = () => {
    nav("/"); // Redirect to '/'
  };

  return (
    <header className="flex flex-col xl:flex-row justify-between items-center h-20 xl:h-auto pt-4 text-white px-6 md:px-20 mb-0 leading-[1]">
      {/* Logo */}
      <div className="mb-4 xl:mb-0">
        <Link to={"/"} className="flex items-center">
          <img
            src={"/assets/SIA-Dark.png"}
            alt="logo"
            width={100}
            className="hover:scale-105 transition-all"
          />
        </Link>
      </div>
      {/* Central Links and Buttons Wrapper */}
      <div className="xl:flex items-center gap-6 px-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl transition-all hover:shadow-white hover:shadow-sm xl:max-w-fit mx-auto mb-4 xl:mb-0">
        {["Home", "About", "Help", "Contact"].map((item, idx) => {
          const path = `/${item.toLowerCase()}`;
          const isActive =
            location.pathname === path ||
            (location.pathname === "/" && item === "Home"); // Handle '/' page case

          return item === "Home" ? (
            <button
              key={idx}
              className={`px-6 py-3 text-lg font-semibold rounded-md transition duration-200 ease-in-out ${
                isActive ? "text-white" : "text-white/50"
              } hover:text-white`}
              onClick={handleHomeClick} // Use the handleHomeClick function for "Home"
            >
              {item}
            </button>
          ) : (
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
      {/* Login / Signup Buttons */}
      <div className="flex items-center justify-center gap-2 ml-auto xl:ml-0">
        {type === "landing" ? (
          <>
            <button
              type="button"
              className="relative text-black bg-white focus:ring-4 font-medium rounded-lg text-sm px-6 py-3 overflow-hidden group"
              onClick={() => nav("/signin")}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"></span>
              <span className="relative z-10">Login</span>
            </button>
            <button
              type="button"
              className="relative text-black bg-white focus:ring-4 font-medium rounded-lg text-sm px-6 py-3 overflow-hidden group"
              onClick={() => nav("/signup")}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"></span>
              <span className="relative z-10">Signup</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            className="relative text-black bg-white focus:ring-4 font-medium rounded-lg text-sm px-6 py-3 overflow-hidden group"
            onClick={
              type === "signin"
                ? () => nav("/signup")
                : type === "signup"
                ? () => nav("/signin")
                : undefined
            }
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"></span>
            <span className="relative z-10">
              {type === "signup" ? "Login" : type === "signin" ? "Signup" : ""}
            </span>
          </button>
        )}
      </div>
      {/* Mobile Menu */}
      <i
        className="bx bx-menu xl:hidden block text-5xl cursor-pointer mt-4 xl:mt-0"
        onClick={() => {
          // Add mobile menu toggle logic here
        }}
      ></i>
    </header>
  );
};
