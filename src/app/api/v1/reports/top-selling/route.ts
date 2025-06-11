// app/api/v1/reports/top-selling/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const result = await prisma.salesInvoiceItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    const topProducts = await Promise.all(
      result.map(async (entry) => {
        const product = await prisma.product.findUnique({
          where: { product_id: entry.productId },
          select: { name: true, product_id: true },
        });

        return {
          ...product,
          totalSold: entry._sum.quantity || 0,
        };
      })
    );

    return NextResponse.json(topProducts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch top selling products' }, { status: 500 });
  }
}
