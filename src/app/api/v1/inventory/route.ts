// /app/api/v1/inventory/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust this import path based on your setup

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categoryName = searchParams.get('category') || 'all';

    const skip = (page - 1) * limit;

    const whereClause: any = {
      deleted: false,
      name: {
        contains: search,
        mode: 'insensitive',
      },
    };

    if (categoryName !== 'all') {
      whereClause.category = {
        name: categoryName,
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc',
        },
        include: {
          category: true,
        },
      }),
      prisma.product.count({
        where: whereClause,
      }),
    ]);

    const formatted = products.map((product) => ({
      id: product.product_id,
      name: product.name,
      stock: product.stock,
      price: Number(product.price),
      category: product.category?.name || 'Uncategorized',
    }));

    return NextResponse.json({ products: formatted, total }, { status: 200 });
  } catch (error) {
    console.error('[INVENTORY_GET_ERROR]', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
