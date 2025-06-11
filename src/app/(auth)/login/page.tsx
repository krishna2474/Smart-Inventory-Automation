"use client";
import { useRouter } from "next/navigation";
import Login from "@/components/auth/Login";
import { Background } from "@/components/Background";

export default function SignupPage() {
  const router = useRouter();

  return (
  <Background>
        <Login isOpen={true} onClose={() => router.push("/")} />
        </Background>
  );
}
