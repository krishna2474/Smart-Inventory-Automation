import { NextResponse } from "next/server";
import { sendOtpEmail } from "@/lib/mail";
import { PrismaClient } from "@prisma/client/edge";
import { DATABASE_URL } from "../../../../../../config";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient({
  datasourceUrl: DATABASE_URL,
}).$extends(withAccelerate());

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { user_id: true,email:true },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Check for existing OTP in Otp table
    const existingOtp = await prisma.otp.findFirst({
      where: { email},
      orderBy: { created_at: "desc" }, // Get the latest OTP
    });

    if (existingOtp && new Date(existingOtp.expires_at) > new Date()) {
      // OTP is still valid, resend the same one
      await sendOtpEmail(email, existingOtp.otp);
      return NextResponse.json({ success: true, message: "OTP resent successfully" });
    }

    // Generate a new OTP
    const newOtp =  Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Store new OTP in Otp table
    await prisma.otp.create({
      data: {
        email: user.email, // ✅ FIXED
        otp: newOtp,
        expires_at: otpExpiry,
      },
    });

    // Send the new OTP via email
    await sendOtpEmail(email, newOtp);

    return NextResponse.json({ success: true, message: "New OTP generated and sent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
