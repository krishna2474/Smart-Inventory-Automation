import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../config";
import { useNavigate } from "react-router-dom";

export const AuthForm = ({
  isSignup,
  closeModal,
  toggleMode,
}: {
  isSignup: boolean;
  closeModal: () => void;
  toggleMode: () => void;
}) => {
  const navigate = useNavigate();
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

      const response = await axios.post(BACKEND_URL + endpoint, payload);
      if (response.status === 200) {
        toast.success(response.data.message || "Success!");
        setTimeout(() => {
          setIsSubmitting(false);
          setIsPacked(false);
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(response.data.error || "Something went wrong!");
        setTimeout(() => {
          setIsSubmitting(false);
          setIsPacked(false);
        }, 3000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      setTimeout(() => {
        setIsSubmitting(false);
        setIsPacked(false);
      }, 3000);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
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
            {!isSignup && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-purple-400 hover:underline text-sm mt-2 focus:outline-none"
                disabled={isSubmitting}
              >
                Forgot Password?
              </button>
            )}
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
              className={`w-full bg-purple-600 text-white py-2 rounded-md shadow-lg relative overflow-hidden flex justify-center items-center gap-2 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
