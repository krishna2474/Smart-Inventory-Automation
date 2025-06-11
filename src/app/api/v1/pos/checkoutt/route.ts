// File: app/api/v1/pos/checkout.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Define types for the request and response data
interface Item {
  product_id: string;
  quantity: number;
  price: number;
}

interface CheckoutRequest {
  items: Item[];
}

export async function POST(req: NextRequest) {
  const body: CheckoutRequest = await req.json();
  const items = body.items;
  console.log('Items in cart:', items);
  if (!items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items in cart' }, { status: 400 });
  }

  // Validate each item for necessary fields
  for (const item of items) {
    if (!item.product_id || !item.quantity || !item.price) {
      return NextResponse.json({ error: 'Invalid item data' }, { status: 400 });
    }
  }

  try {
    // Calculate total amount for the invoice
    const totalAmount = items.reduce((sum: number, item: Item) => sum + item.quantity * item.price, 0);

    // Begin Prisma transaction to ensure atomicity of operations
    const transactionResult = await prisma.$transaction(async (prisma) => {
      // Create a SalesInvoice
      const invoice = await prisma.salesInvoice.create({
        data: {
          totalAmount,
          createdAt: new Date(),
          items: {
            create: items.map((item) => ({
              productId: item.product_id,
              quantity: item.quantity,
              price: Number(item.price), // Ensure price is stored as a string with two decimal places
            })),
          },
        },
      });

      // Update product stock within the same transaction
      for (const item of items) {
        await prisma.product.update({
          where: { product_id: item.product_id },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return invoice;
    });

    // Return the full invoice details (not just the ID)
    return NextResponse.json({
      invoice_id: transactionResult.id,
      total_amount: transactionResult.totalAmount,
      invoice_date: transactionResult.createdAt,
      status: 'PENDING', // Assuming status is pending until payment is processed
    });
  } catch (err) {
    console.error('Checkout error: ', err);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
