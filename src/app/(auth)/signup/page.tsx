"use client";
import { useRouter } from "next/navigation";
import Signup from "@/components/auth/Signup";
import { motion } from "framer-motion";
import starsBg from "@/assets/stars.png";
import { Background } from "@/components/Background";

export default function SignupPage() {
  const router = useRouter();

  return (
    <Background>
        <Signup isOpen={true} onClose={() => router.push("/")} />
        </Background>
  );
}
