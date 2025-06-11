import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;
// import { JWT_SECRET } from "../../../../../../config";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.user_id, email: user.email },
      JWT_SECRET as string,
      { expiresIn: "7d" } // Token valid for 7 days
    );

    return NextResponse.json(
      { message: "Login successful!", token },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Login Error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again later." },
      { status: 500 }
    );
  }
}
