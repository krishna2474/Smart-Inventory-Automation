import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
// import {
//   CLOUDINARY_API_KEY,
//   CLOUDINARY_API_SECRET,
//   CLOUDINARY_CLOUD_NAME,
//   GEMINI_API_KEY,
// } from "../../../../../config";
import dotenv from "dotenv";
dotenv.config();

const {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
  GEMINI_API_KEY,
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME!,
  api_key: CLOUDINARY_API_KEY!,
  api_secret: CLOUDINARY_API_SECRET!,
});

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const userId = formData.get("userId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    // Upload to Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "invoices",
            resource_type: "raw",
            use_filename: true,
            unique_filename: true,
            filename_override: file.name,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    const fileUrl = result.secure_url as string;

    // Convert PDF buffer to base64 for Gemini
    const base64Pdf = buffer.toString("base64");

    // Generate content with Gemini
    const geminiRes = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [
        {
          text: `Perform OCR and extract key details from the PDF. Return a JSON object with keys:
{invoice_number, products:[{name, unit_price, quantity}], price,totalAmount, date}.
Make sure the extracted data matches the actual invoice content — do not hallucinate or invent values.`,
        },
        {
          inlineData: {
            mimeType: "application/pdf",
            data: base64Pdf,
          },
        },
      ],
    });

    let extractedData =
      geminiRes.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No data extracted";
    extractedData = extractedData.replace(/```json|```/g, "").trim(); // Clean up backticks if any

    // Save to DB
    const saved = await prisma.uploadedInvoice.create({
      data: {
        fileName: file.name,
        fileUrl: fileUrl,
        extractedData: extractedData,
      },
    });

    return NextResponse.json(saved);
  } catch (err) {
    console.error("Upload or extraction error:", err);
    return NextResponse.json(
      { error: "Upload or extraction failed" },
      { status: 500 }
    );
  }
}
