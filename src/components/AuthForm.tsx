import { X } from "lucide-react";
import { motion } from "framer-motion";

export const AuthForm = ({
  isSignup,
  closeModal,
  toggleMode,
}: {
  isSignup: boolean;
  closeModal: () => void;
  toggleMode: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50"
      onClick={closeModal}
    >
      {/* Animated Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white/20 border-white/25 backdrop-blur-lg p-6 rounded-lg shadow-xl w-96 relative animate-fadeIn border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-200"
          onClick={closeModal}
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white text-center mb-4">
          {isSignup ? "Create an Account" : "Login"}
        </h2>

        <form className="space-y-4">
          <div>
            <motion.label
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="block text-gray-300 mb-1"
            >
              Email
            </motion.label>
            <motion.input
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              type="email"
              className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-gray-600 rounded-md focus:outline-none focus:border-purple-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <motion.label
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="block text-gray-300 mb-1"
            >
              Password
            </motion.label>
            <motion.input
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              type="password"
              className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-gray-600 rounded-md focus:outline-none focus:border-purple-500"
              placeholder="Enter your password"
            />
          </div>

          {isSignup && (
            <div>
              <motion.label
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="block text-gray-300 mb-1"
              >
                Confirm Password
              </motion.label>
              <motion.input
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                type="password"
                className="w-full px-4 py-2 bg-[#2A2A2A] text-white border border-gray-600 rounded-md focus:outline-none focus:border-purple-500"
                placeholder="Re-Enter your password"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md shadow-lg relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-700"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-purple-400 hover:underline focus:outline-none"
          >
            {isSignup ? "Login" : "Sign up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};
