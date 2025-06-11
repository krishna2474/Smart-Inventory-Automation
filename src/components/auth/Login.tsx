"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface LoginProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Login: React.FC<LoginProps> = ({ isOpen = true, onClose }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleLogin = async () => {
    setLoading(true);
    const toastId = toast.loading("🔄 Logging in...");

    try {
      const response = await fetch("/api/v1/user/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed!");
      }

      toast.success("✅ Logged in successfully!", { id: toastId });

      // Redirect after successful login
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative  bg-black bg-opacity-60 backdrop-blur-md  text-white p-8 rounded-xl shadow-xl w-[90%] max-w-md border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Log In</h2>

            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              {/* Email Input */}
              <motion.input
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full mt-2 p-3 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40"
                />

              {/* Password Input with Toggle */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="relative"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="w-full mt-2 p-3 bg-gray-400/10 bg-opacity-30 backdrop-blur-md text-white rounded-xl border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out hover:bg-gray-300/20 hover:bg-opacity-40"
                  />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </motion.div>

              {/* Login Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="flex justify-center"
              >
                <Button className="w-full" onClick={handleLogin} disabled={loading}>
                  {loading ? "Logging in..." : "Log In"}
                </Button>
              </motion.div>

              {/* Forgot Password Link Below the Login Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                className="text-center"
              >
                <button
                  onClick={() => router.push("/forgot-password")}
                  className="text-sm text-purple-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </motion.div>
            </form>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl"
            >
              ✕
            </motion.button>

            {/* Signup Link */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              className="mt-4 text-center text-gray-400"
            >
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/signup")}
                className="text-purple-400 hover:underline"
              >
                Sign Up
              </button>
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Login;
