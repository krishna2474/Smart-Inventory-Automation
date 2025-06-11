import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 📌 GET All Active Suppliers (Excluding Soft-Deleted Ones)
export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      where: { deleted: false },
      select:{
        supplier_id: true,
        name: true,
        email: true,
        address: true,
        contact: true,
        invoice: {
          select: {
            invoice_id: true,
            totalAmount: true,
            invoiceDate: true,
            status: true,
          },
        },
      }
    });
    if (suppliers.length === 0) {
      return NextResponse.json({ success: false, error: "No suppliers found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: suppliers });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch suppliers" }, { status: 500 });
  }
}

// 📌 POST (Create New Supplier)
export async function POST(req: Request) {
  try {
    const { name, contact, email, address } = await req.json();
    console.log("POST Request:", { name, contact, email, address });
    
    if (!name || !contact || !email || !address) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const existingSupplier = await prisma.supplier.findUnique({ where: { email } });
    if (existingSupplier) {
      return NextResponse.json({ success: false, error: "Supplier with this email already exists" }, { status: 400 });
    }

    const newSupplier = await prisma.supplier.create({
      data: { name, contact, email, address, deleted: false },
    });

    return NextResponse.json({ success: true, data: newSupplier }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: "Error creating supplier" }, { status: 500 });
  }
}

// 📌 PUT (Update Supplier)
export async function PUT(req: Request) {
  try {
    const { id, name, contact, email, address } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Supplier ID is required" }, { status: 400 });
    }

    const updatedSupplier = await prisma.supplier.update({
      where: { supplier_id: id, deleted: false },
      data: { name, contact, email, address },
    });

    return NextResponse.json({ success: true, data: updatedSupplier });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, error: "Error updating supplier" }, { status: 500 });
  }
}

// 📌 DELETE (Soft Delete Supplier)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Supplier ID is required" }, { status: 400 });
    }

    await prisma.supplier.update({
      where: { supplier_id: id },
      data: { deleted: true },
    });

    return NextResponse.json({ success: true, message: "Supplier deleted successfully" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ success: false, error: "Error deleting supplier" }, { status: 500 });
  }
}
