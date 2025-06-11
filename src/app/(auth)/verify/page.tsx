"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/Button";
import toast from "react-hot-toast";
import starsBg from "@/assets/stars.png"
import { Header } from "@/sections/Header";
import { Background } from "@/components/Background";

export const OTPVerification = () => {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      toast.error("Invalid request. No email found.");
    }
  }, [email]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleResend=async()=>{
    console.log("In resend");
    
    const toastId = toast.loading("Resending OTP...");

    try {
      const response = await fetch("/api/v1/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        
        toast.success("OTP resent successfully!", { id: toastId });
      } else {
        throw new Error(data.message || "Some error occured, please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.", {
        id: toastId,
      });
    }
  }

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please check the URL.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Verifying OTP...");

    try {
      const response = await fetch("/api/v1/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });

      const data = await response.json();
      
      
      if (response.ok) {
        localStorage.setItem("token", data.token);
        // redirect to dashboard
        router.push("/dashboard")
        toast.success("OTP verified successfully!", { id: toastId });
      } else {
        throw new Error(data.message || "Invalid OTP, please try again.");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header/>
    <Background>
    <motion.section
  animate={{
    backgroundPositionX: [0, 2000], // Only animate the stars background
  }}
  transition={{
    duration: 120,
    repeat: Infinity,
    ease: "linear",
  }}
  className="fixed inset-0 flex items-center justify-center bg-black backdrop-blur-md"
  style={{
    backgroundImage: `url(${starsBg.src})`, // Stars move
    backgroundSize: "cover",
    maskImage:
      "linear-gradient(to bottom, transparent 0%, black 0%, black 100%,transparent 100%)",
    WebkitMaskImage:
      "linear-gradient(transparent 0%, black 0%, black 100%,transparent 100%)",
  }}
>
  {/* Additional Darkening Overlay */}
  <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

  {/* Fixed Radial Gradient Overlay - Darker */}
  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,rgba(80,40,140,0.5)_15%,rgba(14,0,36,0.95)_80%)]"></div>

  {/* OTP Container */}
  <motion.div
    className="relative z-10 bg-[#181825]/70 p-8 rounded-xl shadow-lg border border-white/40 w-full max-w-md"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <h1 className="text-center text-2xl font-semibold text-white mb-4">
      Enter OTP
    </h1>
    <p className="text-gray-400 text-center text-sm mb-6">
      We have sent a verification code to{" "}
      <span className="font-semibold text-white">{email}</span>.
    </p>
    <div className="flex justify-center gap-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className="w-12 h-12 text-lg text-center bg-[#24243A] border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
        />
      ))}
    </div>
    <div className="flex justify-center mt-6">
      <Button onClick={handleVerify} disabled={loading}  className="w-full">
        {loading ? "Verifying..." : "Verify"}
      </Button>
    </div>
    <p className="text-gray-500 text-center text-sm mt-4">
      Didn't receive a code?{" "}
      <span
        className="text-purple-400 cursor-pointer hover:underline"
        onClick={handleResend}
      >
        Resend
      </span>
    </p>
  </motion.div>
</motion.section>
</Background>
</>

  );
};

export default OTPVerification;
