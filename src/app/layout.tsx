import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Inventory Automation",
  description: "A landing page for an AI startup created with Frontend Tribe",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode; // Support modal rendering
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "rgba(24, 0, 66, 0.9)", // Dark purple background
            color: "#fff", // White text
            borderRadius: "8px",
            border: "1px solid rgba(140, 69, 255, 0.6)", // Neon purple border
            boxShadow: "0px 0px 10px rgba(140, 69, 255, 0.8)",
            padding: "12px 16px",
          },
          success: {
            iconTheme: { primary: "#8C45FF", secondary: "#FFFFFF" },
            style: { background: "#1D0B33", borderColor: "#8C45FF" },
          },
          error: {
            iconTheme: { primary: "#FF3B30", secondary: "#FFFFFF" },
            style: { background: "#330B1D", borderColor: "#FF3B30" },
          },
        }}
      />
      
        {children} {/* Main page content */}
        {modal} {/* This will render the modal when needed */}
      </body>
    </html>
  );
}
