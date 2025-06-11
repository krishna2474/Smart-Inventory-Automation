import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// 📌 GET All Categories (Excluding Soft Deleted)
// 📌 GET All Categories (Excluding Soft Deleted) with Product Count
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { deleted: false },
      include: {
        // Include product count for each category
        _count: {
          select: { products: true }, // Assuming 'products' is the relation name between categories and products
        },
      },
    });

    if (categories.length === 0) {
      return NextResponse.json({ success: false, error: "No categories found" }, { status: 404 });
    }

    // Map through categories to include product count in the response
    const categoriesWithProductCount = categories.map((category) => ({
      ...category,
      productCount: category._count.products, // Add the product count to the response
    }));

    return NextResponse.json({ success: true, data: categoriesWithProductCount });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}
// 📌 POST (Create New Category)
export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    
    if (!name) {
      return NextResponse.json({ success: false, error: "Category name is required" }, { status: 400 });
    }

    // Check if the category exists (even if soft deleted)
    const existingCategory = await prisma.category.findFirst({ where: { name } });

    if (existingCategory) {
      if (existingCategory.deleted) {
        // If the category was soft deleted, restore it
        await prisma.category.update({
          where: { category_id: existingCategory.category_id },
          data: { deleted: false },
        });
        return NextResponse.json({ success: true, message: "Category restored successfully" });
      }
      return NextResponse.json({ success: false, error: "Category already exists" }, { status: 400 });
    }

    // Create new category
    const newCategory = await prisma.category.create({
      data: { name, deleted: false },
    });

    return NextResponse.json({ success: true, data: newCategory }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, error: "Error creating category" }, { status: 500 });
  }
}

// 📌 PUT (Update Category)
export async function PUT(req: Request) {
  try {
    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json({ success: false, error: "Category ID and name are required" }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { category_id: id },
      data: { name },
    });

    return NextResponse.json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, error: "Error updating category" }, { status: 500 });
  }
}

// 📌 DELETE (Soft Delete Category)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Category ID is required" }, { status: 400 });
    }

    // Soft delete by setting `deleted: true`
    await prisma.category.update({
      where: { category_id: id },
      data: { deleted: true },
    });

    return NextResponse.json({ success: true, message: "Category deleted successfully (soft delete)" });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ success: false, error: "Error deleting category" }, { status: 500 });
  }
}
