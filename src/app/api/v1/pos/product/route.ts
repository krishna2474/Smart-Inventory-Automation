// Backend: POS Simulator APIs

// File: app/api/v1/pos/products.ts
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      select: {
        product_id: true,
        name: true,
        price: true,
        stock: true,
        category: true,
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
