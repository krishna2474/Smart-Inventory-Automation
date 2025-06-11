"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Background } from "@/components/Background";

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") || ""; // Ensure token is never null

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!token) {
      toast.error("Invalid or missing token!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("🔄 Resetting password...");

    try {
      console.log("Sending token and password:", token, formData.password); // Debugging

      const response = await fetch("/api/v1/user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: formData.password, // Ensure key matches backend
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Reset failed!");

      toast.success("✅ Password reset successfully!", { id: toastId });
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-gray-900 text-white p-8 rounded-xl shadow-xl w-[90%] max-w-md border border-white/20"
          >
            <h2 className="text-2xl font-bold mb-4 text-center">Reset Password</h2>

            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              {/* Password Input */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="relative"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="p-3 w-full bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </motion.div>

              {/* Confirm Password Input */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="relative"
              >
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="p-3 w-full bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 outline-none pr-10"
                />
              </motion.div>

              {/* Reset Button */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="flex justify-center"
              >
                <Button className="w-full" onClick={handleResetPassword} disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </motion.div>
            </form>

            {/* Go to Login */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
              className="text-center mt-4"
            >
              <button onClick={() => router.push("/login")} className="text-sm text-purple-400 hover:underline">
                Back to Login
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </Background>
  );
};

export default ResetPassword;
