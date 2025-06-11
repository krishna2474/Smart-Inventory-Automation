import { SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL } from "@/config";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(SENDGRID_API_KEY as string);

export async function sendResetPasswordEmail(email: string, resetLink: string) {
  console.log("Here");
  
  try {
    const msg = {
      to: email, 
      from: SENDGRID_SENDER_EMAIL, // Use your verified sender email
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="color:blue;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await sgMail.send(msg);
    console.log("✅ Password reset email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Failed to send email");
  }
}

export async function sendOtpEmail(email: string, otp: string) {
  console.log("Sending OTP...");

  try {
    const msg = {
      to: email,
      from: SENDGRID_SENDER_EMAIL, // Use your verified sender email
      subject: "Your OTP Code",
      html: `
        <h2>Your OTP Code</h2>
        <p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    await sgMail.send(msg);
    console.log("✅ OTP email sent to:", email);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}
