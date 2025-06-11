import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    console.log("📊 Dashboard data fetch initiated");

    // Define the common 'where' clause for non-deleted items
    const nonDeletedCondition = { deleted: false };

    // Fetch all data in parallel, applying the nonDeletedCondition
    const [
      totalProducts,
      totalSuppliers,
      totalCategories,
      totalInvoices,
      totalPayments,
      totalUsers,
      lowStockProducts,
      invoiceStatusStats,
      recentInvoices,
      recentPayments,
      allCategories,
      recentProducts
    ] = await Promise.all([
      prisma.product.count({ where: nonDeletedCondition }),
      prisma.supplier.count({ where: nonDeletedCondition }),
      prisma.category.count({ where: nonDeletedCondition }),
      prisma.invoice.count({ where: nonDeletedCondition }),
      prisma.payment.count({ where: nonDeletedCondition }),
      prisma.user.count({ where: nonDeletedCondition }),

      prisma.product.findMany({
        where: { ...nonDeletedCondition, stock: { lt: 10 } },
        select: {
          product_id: true,
          name: true,
          stock: true,
          created_at: true
        },
        orderBy: { stock: 'asc' },
        take: 5
      }),

      prisma.invoice.groupBy({
        where: nonDeletedCondition,
        by: ['status'],
        _count: true
      }),

      prisma.invoice.findMany({
        where: nonDeletedCondition,
        orderBy: { created_at: 'desc' },
        take: 5,
        select: {
          invoice_id: true,
          supplier: { select: { name: true } },
          totalAmount: true,
          status: true,
          invoiceDate: true
        }
      }),

      prisma.payment.findMany({
        where: nonDeletedCondition,
        orderBy: { paymentDate: 'desc' },
        take: 5,
        select: {
          payment_id: true,
          amount: true,
          paymentDate: true,
          invoice: {
            select: {
              fileName: true,
              fileUrl: true,
              invoice_id: true,
              supplier: { select: { name: true } }
            }
          }
        }
      }),

      prisma.category.findMany({
        where: nonDeletedCondition,
        select: {
          category_id: true,
          name: true,
          products: {
            where: nonDeletedCondition,
            select: {
              product_id: true,
              name: true,
              stock: true,
              price: true
            }
          }
        }
      }),

      prisma.product.findMany({
        where: nonDeletedCondition,
        orderBy: { created_at: 'desc' },
        take: 5,
        select: {
          product_id: true,
          name: true,
          price: true,
          stock: true,
          created_at: true
        }
      })
    ]);

    // Process invoice status stats
    const invoiceStatusBreakdown = (() => {
      const breakdown = { pending: 0, paid: 0, overdue: 0 };
      invoiceStatusStats.forEach((stat) => {
        const key = stat.status.toLowerCase() as keyof typeof breakdown;
        if (key in breakdown) {
          breakdown[key] = stat._count;
        }
      });
      return breakdown;
    })();

    // Process top categories
    const topCategories = allCategories
      .map(cat => ({
        category_id: cat.category_id,
        name: cat.name,
        productCount: cat.products.length,
        products: cat.products
      }))
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 5);

    // Log aggregated data
    console.log({
      totalProducts,
      totalSuppliers,
      totalCategories,
      totalInvoices,
      totalPayments,
      totalUsers
    });

    // Return aggregated data with no-cache headers
    return NextResponse.json(
      {
        stats: {
          products: totalProducts,
          suppliers: totalSuppliers,
          categories: totalCategories,
          invoices: totalInvoices,
          payments: totalPayments,
          users: totalUsers
        },
        lowStockProducts,
        invoiceStatusBreakdown,
        recentInvoices,
        recentPayments,
        topCategories,
        recentlyAddedProducts: recentProducts
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );

  } catch (error) {
    console.error('❌ Dashboard API Error:', error);
    return NextResponse.json({ message: 'Something went wrong', error }, { status: 500 });
  }
}