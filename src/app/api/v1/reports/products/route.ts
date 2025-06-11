// app/api/v1/reports/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      select: {
        product_id: true,
        name: true,
        stock: true,
        category: true,
      },
      orderBy: {
        stock: 'asc',
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
