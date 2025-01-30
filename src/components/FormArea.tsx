import { ContinueWithGoogle } from "./ContinueWithGoogle";
import { ContinueWithFacebook } from "./ContinueWithApple";
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
        transition: { duration: 1, type: "spring", stiffness: 30 },
      }}
      className={`relative flex justify-center items-center min-h-[calc(100vh-64px)] sm:min-h-screen ${
        isMenuOpen ? "mt-16 sm:mt-0" : "mt-0"
      } font-nunito`}
    >
      <div className="rounded-3xl w-[90%] sm:w-[850px] bg-white/10 backdrop-blur-3xl border border-white/50">
        <div className="flex justify-center pt-10 font-bebas text-5xl sm:text-6xl text-white">
          {type === "signup" ? "Signup" : "Login"}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-8">
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
            <div className="space-y-4 flex flex-col">
              <ContinueWithGoogle />
              <ContinueWithFacebook />
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
