"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import toast from "react-hot-toast";
import { Background } from "@/components/Background";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast.error("📩 Please enter your email!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("🔄 Sending reset link...");

    try {
      const response = await fetch("/api/v1/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong!");

      toast.success("✅ Check your email for the reset link!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "❌ Failed to send reset link!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Background>
      <div className="fixed inset-0 flex items-center justify-center">
        {/* Glowing Effect */}
        <div className="absolute w-[350px] h-[350px] bg-purple-500 rounded-full blur-[120px] opacity-50"></div>

        {/* Forgot Password Modal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-sm z-50"
        >
          <div className="relative z-10 w-[90%] max-w-md bg-gray-900 rounded-lg p-6 shadow-lg text-center border border-white/20 backdrop-blur-lg">
            <h2 className="text-xl font-bold text-white mb-2">Forgot Password</h2>
            <p className="text-gray-400 text-sm mb-4">Enter your email to receive a password reset link.</p>

            {/* Email Input */}
            <input
              type="email"
              className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-600 outline-none transition-all duration-200"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Send Reset Link Button */}
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }} className="w-full mt-4">
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                onClick={handleForgotPassword} 
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </motion.div>

            {/* Login Redirect */}
            <p className="text-center text-gray-400 mt-4 ">
              Already have an account?{" "}
              <button onClick={() => router.push("/login")} className="text-purple-500 hover:underline">
                Login
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </Background>
  );
};

export default ForgotPassword;
