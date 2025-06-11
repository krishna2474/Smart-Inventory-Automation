import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer); // Convert to Uint8Array

    // Store file in database
    const newFile = await prisma.file.create({
      data: {
        filename: file.name,
        mimetype: file.type,
        file_data: uint8Array, // Store as Uint8Array
        deleted: false,
      },
    });

    return Response.json({ message: "File uploaded successfully", fileId: newFile.id });
  } catch (error) {
    console.error("Error uploading file:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const fileId = url.searchParams.get("id");

    if (fileId) {
      // Fetch a specific file by ID
      const file = await prisma.file.findUnique({
        where: { id: fileId },
      });

      if (!file || file.deleted) {
        return Response.json({ error: "File not found" }, { status: 404 });
      }

      return new Response(file.file_data, {
        headers: {
          "Content-Type": file.mimetype,
          "Content-Disposition": `attachment; filename="${file.filename}"`,
        },
      });
    } else {
      // Fetch all non-deleted files (excluding file_data)
      const files = await prisma.file.findMany({
        where: { deleted: false },
        select: {
          id: true,
          filename: true,
          mimetype: true,
          uploaded_at: true,
          deleted: true,
        },
      });

      if (files.length === 0) {
        return Response.json({ message: "No files found" }, { status: 404 });
      }

      return Response.json({ files });
    }
  } catch (error) {
    console.error("Error fetching files:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE endpoint for soft deleting a file
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const fileId = url.searchParams.get("id");

    if (!fileId) {
      return Response.json({ error: "File ID is required" }, { status: 400 });
    }

    // Check if file exists
    const file = await prisma.file.findUnique({ where: { id: fileId } });

    if (!file || file.deleted) {
      return Response.json({ error: "File not found or already deleted" }, { status: 404 });
    }

    // Soft delete file
    await prisma.file.update({
      where: { id: fileId },
      data: { deleted: true },
    });

    return Response.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
