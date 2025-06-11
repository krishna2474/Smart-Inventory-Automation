import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import jwt from "jsonwebtoken";
import { DATABASE_URL, JWT_SECRET } from "../../../../../../config"; 

const prisma = new PrismaClient({
  datasourceUrl: DATABASE_URL,
}).$extends(withAccelerate());

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();
    console.log(email, otp);

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Fetch the OTP from the database
    const otpRecord = await prisma.otp.findUnique({
      where: { email },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { message: "No OTP found for this email" },
        { status: 404 }
      );
    }

    // Check OTP match & expiration
    const isOtpValid = otpRecord.otp === otp;
    const isOtpExpired = new Date() > new Date(otpRecord.expires_at);

    if (!isOtpValid) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    if (isOtpExpired) {
      return NextResponse.json({ message: "OTP has expired" }, { status: 400 });
    }

    // Mark OTP as used (Optional)
    await prisma.otp.delete({
      where: { email },
    });

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );
    console.log(token);

    return NextResponse.json(
      { message: "OTP verified successfully", token },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
