import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../config";

export const AuthForm = ({
  isSignup,
  closeModal,
  toggleMode,
}: {
  isSignup: boolean;
  closeModal: () => void;
  toggleMode: () => void;
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPacked, setIsPacked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    try {
      setIsSubmitting(true);
      setIsPacked(true);
      const endpoint = isSignup ? "/api/v1/auth/signup" : "/api/v1/auth/signin";
      const payload = isSignup
        ? { name, email, password }
        : { email, password };

      const { data } = await axios.post(BACKEND_URL + endpoint, payload);
      toast.success(data.message || "Success!");
      setTimeout(() => {
        setIsSubmitting(false);
        setIsPacked(false);
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      setTimeout(() => {
        setIsSubmitting(false);
        setIsPacked(false);
      }, 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50"
      onClick={closeModal}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white/20 border-white/25 backdrop-blur-lg p-6 rounded-lg shadow-xl w-96 relative animate-fadeIn border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-200"
          onClick={closeModal}
          disabled={isSubmitting}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white text-center mb-4">
          {isSignup ? "Create an Account" : "Login"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignup && (
            <div>
              <motion.label className="block text-gray-300 mb-1">
                Name
              </motion.label>
              <motion.input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-gray-600 rounded-md focus:outline-none focus:border-purple-500"
                placeholder="Enter your name"
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          <div>
            <motion.label className="block text-gray-300 mb-1">
              Email
            </motion.label>
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-gray-600 rounded-md focus:outline-none focus:border-purple-500"
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <motion.label className="block text-gray-300 mb-1">
              Password
            </motion.label>
            <div className="relative">
              <motion.input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-gray-600 rounded-md focus:outline-none focus:border-purple-500"
                placeholder="Enter your password"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-200"
                disabled={isSubmitting}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {isSignup && (
            <div>
              <motion.label className="block text-gray-300 mb-1">
                Confirm Password
              </motion.label>
              <motion.input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-gray-600 rounded-md focus:outline-none focus:border-purple-500"
                placeholder="Re-Enter your password"
                required
                disabled={isSubmitting}
              />
            </div>
          )}

          <AnimatePresence>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              initial={{ scale: 1, opacity: 1 }}
              animate={
                isPacked
                  ? {
                      scale: 0.9,
                      y: 100,
                      opacity: 0,
                      transition: { duration: 1 },
                    }
                  : { scale: 1, y: 0, opacity: 1 }
              }
              exit={{ opacity: 0, y: 100 }}
              className={`w-full bg-purple-600 text-white py-2 rounded-md shadow-lg relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700 transition-all duration-500 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 0.8, 1] }}
                  transition={{
                    repeat: Infinity,
                    repeatDelay: 0.3,
                    duration: 1,
                    ease: "easeInOut",
                  }}
                  className="flex justify-center items-center gap-2"
                >
                  📦 📦 📦
                </motion.div>
              ) : isSignup ? (
                "Sign Up"
              ) : (
                "Login"
              )}
            </motion.button>
          </AnimatePresence>
        </form>

        <p className="text-center text-gray-400 mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-purple-400 hover:underline focus:outline-none"
            disabled={isSubmitting}
          >
            {isSignup ? "Login" : "Sign up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};
