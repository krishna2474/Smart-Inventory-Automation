import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { BACKEND_URL } from "../config";

export const ForgotPassword = ({ closeModal }: { closeModal: () => void }) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/auth/forgot-password`,
        { email }
      );

      if (response.status === 200) {
        toast.success("Password reset link sent to your email!");
        setTimeout(() => {
          setIsSubmitting(false);
          closeModal();
        }, 2000);
      } else {
        toast.error(response.data.error || "Something went wrong!");
        setIsSubmitting(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      setIsSubmitting(false);
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
        className="bg-white/20 border-white/25 backdrop-blur-lg p-6 rounded-lg shadow-xl w-96 relative border border-gray-700"
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
          Forgot Password
        </h2>
        <p className="text-gray-300 text-sm text-center mb-6">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
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

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-purple-600 text-white py-2 rounded-md shadow-lg flex justify-center items-center gap-2 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Send Reset Link"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
