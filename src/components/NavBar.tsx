import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { menuState } from "../atoms/menuAtom";

type NavBarProps = {
  type: "signup" | "signin" | "landing";
};

export const NavBar = ({ type }: NavBarProps) => {
  const nav = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useRecoilState(menuState);
  return (
    <>
      <header className="flex justify-between items-center text-white px-6 py-2 md:px-20">
        <Link to={"/"}>
          <img
            src={"/assets/SIA-Dark.png"}
            alt="logo"
            width={100}
            className="hover:scale-105 transition-all"
          />
        </Link>
        <ul className="hidden xl:flex items-center font-semibold gap-12 text-lg">
          <li className="p-3 hover:bg-primaryWhite hover:underline hover:text-primaryBlack rounded-md transition-all">
            <Link to={"/"}> Home</Link>
          </li>
          <li className="p-3 hover:bg-primaryWhite hover:underline hover:text-primaryBlack rounded-md transition-all">
            <Link to={"/"}> About</Link>
          </li>
          <li className="p-3 hover:bg-primaryWhite hover:underline hover:text-primaryBlack rounded-md transition-all">
            <Link to={"/"}> Help</Link>
          </li>
          <li className="p-3 hover:bg-primaryWhite hover:underline hover:text-primaryBlack rounded-md transition-all">
            <Link to={"/"}> Contact</Link>
          </li>
        </ul>
        <div className="hidden sm:flex items-center justify-center gap-3">
          {type === "landing" ? (
            <>
              <button
                type="button"
                className={`text-black bg-white focus:ring-4 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 hover:bg-customPurple hover:text-white transition duration-200 ease-in-out`}
                onClick={() => nav("/signin")}
              >
                Login
              </button>
              <button
                type="button"
                className={`text-black bg-white focus:ring-4 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 hover:bg-customPurple hover:text-white transition duration-200 ease-in-out`}
                onClick={() => nav("/signup")}
              >
                Signup
              </button>
            </>
          ) : (
            <button
              type="button"
              className={`text-black bg-white focus:ring-4 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 hover:bg-customPurple hover:text-white transition duration-200 ease-in-out`}
              onClick={
                type === "signin"
                  ? () => nav("/signup")
                  : type === "signup"
                  ? () => nav("/signin")
                  : undefined
              }
            >
              {type === "signup" ? "Login" : type === "signin" ? "Signup" : ""}
            </button>
          )}
        </div>
        <i
          className="bx bx-menu xl:hidden block text-5xl cursor-pointer"
          onClick={() => {
            setIsMenuOpen((isMenuOpen) => !isMenuOpen);
          }}
        ></i>
        <div
          className={`absolute xl:hidden top-24 left-0 w-full flex flex-col items-center gap-7 font-semibold text-lg transform transition-transform ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{ transition: "transform 0.3s ease, opacity 0.3s ease " }}
        >
          <li className="list-none w-full text-center p-4 hover:bg-primaryWhite hover:text-primaryBlack transition-all">
            <Link to={"/"}> Home </Link>
          </li>
          <li className="list-none w-full text-center p-4 hover:bg-primaryWhite hover:text-primaryBlack transition-all">
            <Link to={"/"}> About </Link>
          </li>
          <li className="list-none w-full text-center p-4 hover:bg-primaryWhite hover:text-primaryBlack transition-all">
            <Link to={"/"}> Help </Link>
          </li>
          <li className="list-none w-full text-center p-4 hover:bg-primaryWhite hover:text-primaryBlack transition-all">
            <Link to={"/"}> Contact </Link>
          </li>
        </div>
      </header>
    </>
  );
};
