import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";
import {
  DATABASE_URL,
  SENDGRID_API_KEY,
  SENDGRID_SENDER_EMAIL,
} from "@/config";
import { prisma } from "@/lib/prisma";

sgMail.setApiKey(SENDGRID_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    console.log("Requested email:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await prisma.otp.upsert({
      where: { email },
      update: { otp, expires_at: expiresAt, created_at: new Date() },
      create: { email, otp, expires_at: expiresAt },
    });

    const emailTemplate = `
<div style="background-color: #f4f4f7; padding: 40px; text-align: center; font-family: 'Inter', sans-serif; color: #333;">
  <div style="max-width: 480px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: center;">
    <h1 style="font-size: 24px; color: #4A32A8; margin-bottom: 10px; font-weight: 600;">Smart Inventory Automation</h1>
    <p style="font-size: 16px; margin-bottom: 20px; color: #555;">
      Verify your account with this one-time passcode (OTP).
    </p>
    <p style="font-size: 14px; color: #777; margin-bottom: 8px;">Your OTP Code:</p>
    <p style="font-size: 32px; font-weight: bold; color: #4A32A8; letter-spacing: 2px;">
      ${otp}
    </p>
    <p style="font-size: 14px; margin-top: 20px; color: #666;">
      This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
    </p>
  </div>
  <p style="font-size: 12px; margin-top: 20px; color: #999;">
    If you didn’t request this OTP, you can safely ignore this email.
  </p>
</div>
    `;

    const msg = {
      to: email,
      from: {
        email: SENDGRID_SENDER_EMAIL as string,
        name: "Smart Inventory Automation Team",
      },
      subject: "Your OTP Code - Smart Inventory Automation",
      html: emailTemplate,
    };

    await sgMail.send(msg);
    console.log("✅ OTP Email sent successfully to", email);

    return NextResponse.json({
      message: "OTP sent successfully!",
    });
  } catch (error: any) {
    console.error("❌ SendGrid Error:", error);

    // Log response details from SendGrid if available
    if (error.response) {
      console.error("📩 SendGrid Response Error Body:", error.response.body);
    }

    return NextResponse.json(
      { error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}
