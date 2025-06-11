import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../../../../config";

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        {
          error:
            "All fields (firstName, lastName, email, password) are required.",
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          message:
            "A user with this email already exists. Please use a different email.",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
      },
    });
    if (newUser) {
      const token = jwt.sign(
        { id: newUser.user_id, email: newUser.email, role: newUser.role },
        JWT_SECRET,
        { expiresIn: "7d" } // Token expires in 7 days
      );
      return NextResponse.json(
        { message: "User registered successfully!", token },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Signup Error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { message: "This email is already registered. Please log in instead." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        message:
          "An unexpected error occurred while processing your request. Please try again later.",
      },
      { status: 500 }
    );
  }
}
