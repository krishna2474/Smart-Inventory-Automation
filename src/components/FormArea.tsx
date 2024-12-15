import { ContinueWithGoogle } from "./ContinueWithGoogle";
import { ContinueWithApple } from "./ContinueWithApple";
import { SignupForm } from "./SignupForm";
import { useRecoilValue } from "recoil";
import { menuState } from "../atoms/menuAtom";
import { motion } from "motion/react";
import { SigninForm } from "./SigninForm";

type FormAreaProps = {
  type: "signup" | "signin";
};

export const FormArea = ({ type }: FormAreaProps) => {
  const isMenuOpen = useRecoilValue(menuState);
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 100,
      }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 1, type: "spring", stiffness: 30 }, // Smooth spring animation
      }}
      className={`relative  flex justify-center items-center top-0 min-h-screen font-nunito ${
        isMenuOpen ? "mt-64 sm:mt-0" : "mt-[-25px] sm:mt-0"
      }`}
    >
      <div
        className={`mr-10 ml-10 rounded-3xl h-auto ${
          type === "signin" ? "sm:h-[480px]" : "sm:h-full"
        } w-full sm:w-[850px] bg-white/10 backdrop-blur-3xl border border-white/50 `}
      >
        <div className="flex justify-center pt-10 font-bebas text-5xl sm:text-6xl text-white">
          {type === "signup" ? "Signup" : "Login"}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 p-5 sm:p-10">
          <div className="flex flex-col items-center">
            <div className="hidden sm:block">
              <img
                className="relative bottom-8"
                src={"/assets/Smart Inventory Automation-Dark.png"}
                width={320}
                height={110}
                alt="Logo"
              />
            </div>
            <div>
              <ContinueWithGoogle />
            </div>
            <div className="mt-5">
              <ContinueWithApple onClick={() => {}} />
            </div>
          </div>
          <div className="flex justify-center">
            {type === "signup" ? (
              <SignupForm type={type} />
            ) : (
              <SigninForm type={type} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
