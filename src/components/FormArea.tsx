import { ContinueWithGoogle } from "./ContinueWithGoogle";
import { ContinueWithFacebook } from "./ContinueWithApple";
import { SignupForm } from "./SignupForm";
import { motion } from "motion/react";
import { SigninForm } from "./SigninForm";

type FormAreaProps = {
  type: "signup" | "signin";
};
export const FormArea = ({ type }: FormAreaProps) => {
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
      className={`relative ${
        type === "signin" ? "bottom-5" : "top-5"
      } flex justify-center items-center min-h-[calc(100vh-64px)] font-nunito`}
    >
      <div className="w-[90%] max-w-[400px] sm:max-w-[850px] bg-white/10 backdrop-blur-3xl border border-white/50 rounded-3xl">
        {/* Header */}
        <div className="flex justify-center pt-8 font-bebas text-3xl sm:text-6xl text-white">
          {type === "signup" ? "Signup" : "Login"}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 sm:p-8">
          {/* Left Column */}
          <div className="flex flex-col items-center">
            <div className="hidden sm:block">
              <img
                className="relative bottom-4 max-w-full h-auto"
                src="/assets/Smart Inventory Automation-Dark.png"
                alt="Logo"
              />
            </div>
            <div className="space-y-4 flex flex-col">
              <ContinueWithGoogle />
              <ContinueWithFacebook />
            </div>
          </div>

          {/* Right Column */}
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
