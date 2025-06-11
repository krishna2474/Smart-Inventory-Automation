import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  try {
    const products = await req.json();
    console.log("Received products:", products.products);

    if (!Array.isArray(products.products) || products.products.length === 0) {
      console.log("Invalid input, expected an array of products");
      return Response.json({ error: "Invalid input, expected an array of products" }, { status: 400 });
    }

    const validProducts = products.products.filter((product: any) => {
      const { name, category_id, price, stock, supplier_id, description } = product;
      const isValid = name && category_id && price !== undefined && stock !== undefined && supplier_id;
      if (!isValid) {
        console.log("Invalid product:", product);
      }
      return isValid;
    });

    if (validProducts.length === 0) {
      console.log("No valid products to add or update");
      return Response.json({ error: "No valid products to add or update" }, { status: 400 });
    }

    let addedCount = 0;
    let updatedCount = 0;

    for (const product of validProducts) {
      const existing = await prisma.product.findFirst({
        where: {
          name: product.name,
          category_id: product.category_id,
          supplier_id: product.supplier_id,
          deleted: false,
        },
      });

      if (existing) {
        // Update existing product's price and increase stock
        await prisma.product.update({
          where: { product_id: existing.product_id },
          data: {
            price: product.price,
            stock: existing.stock + product.stock,
            description: product.description, // optional: update description if needed
          },
        });
        updatedCount++;
        console.log(`Updated existing product: ${product.name}`);
      } else {
        // Create new product
        await prisma.product.create({
          data: {
            name: product.name,
            category_id: product.category_id,
            price: product.price,
            stock: product.stock,
            supplier_id: product.supplier_id,
            description: product.description,
            deleted: false,
          },
        });
        addedCount++;
        console.log(`Added new product: ${product.name}`);
      }
    }

    return Response.json({
      message: `${addedCount} product(s) added, ${updatedCount} product(s) updated.`,
    });
  } catch (error) {
    console.error("Error adding/updating products:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("id");

    if (productId) {
      console.log(`Fetching product with ID: ${productId}`); // Log product ID being fetched
      const product = await prisma.product.findUnique({
        where: { product_id: productId, deleted: false },
        include: { category: true },
      });

      if (!product) {
        console.log("Product not found"); // Log when product is not found
        return Response.json({ error: "Product not found" }, { status: 404 });
      }

      console.log("Product found:", product); // Log the found product
      return Response.json({ product });
    } else {
      console.log("Fetching all products"); // Log when fetching all products
      const products = await prisma.product.findMany({
        where: { deleted: false },
        include: { category: true },
      });

      if (products.length === 0) {
        console.log("No products found"); // Log when no products are found
        return Response.json({ message: "No products found" }, { status: 404 });
      }

      console.log("Products found:", products); // Log the found products
      return Response.json({ products });
    }
  } catch (error) {
    console.error("Error fetching products:", error); // Log error while fetching products
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, categoryId, price, stock } = await req.json();
    console.log("Updating product with ID:", id); // Log the product ID being updated

    if (!id) {
      console.log("Product ID is required"); // Log when ID is missing
      return Response.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { product_id: id, deleted: false } });

    if (!product) {
      console.log("Product not found for update"); // Log when product is not found for update
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    const updatedProduct = await prisma.product.update({
      where: { product_id: id },
      data: { name, category_id: categoryId, price, stock },
    });

    console.log("Product updated successfully:", updatedProduct); // Log the updated product
    return Response.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error); // Log error while updating product
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    let productId = url.searchParams.get("id");

    console.log(`Attempting to delete product with ID: ${productId}`); // Log product ID being deleted

    if (!productId) {
      console.log("Product ID is required"); // Log when product ID is missing
      return Response.json({ error: "Product ID is required" }, { status: 400 });
    }

    productId=productId.trimStart()
    const product = await prisma.product.findUnique({ where: { product_id: productId } });
    if (!product || product.deleted) {
      console.log("Product not found or already deleted"); // Log when product is not found or already deleted
      return Response.json({ error: "Product not found or already deleted" }, { status: 404 });
    }

    await prisma.product.update({
      where: { product_id: productId },
      data: { deleted: true },
    });

    console.log("Product deleted successfully"); // Log successful deletion
    return Response.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error); // Log error while deleting product
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
