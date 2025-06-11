import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { subDays, format } from 'date-fns'

export async function GET(req: NextRequest) {
  try {
    const [totalSales, revenueResult, topProductsData, trendRaw] = await Promise.all([
      prisma.salesInvoice.count(),

      prisma.salesInvoice.aggregate({
        _sum: {
          totalAmount: true,
        },
      }),

      prisma.salesInvoiceItem.groupBy({
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
      }),

      prisma.salesInvoice.findMany({
        where: {
          createdAt: {
            gte: subDays(new Date(), 7),
          },
        },
        select: {
          createdAt: true,
          totalAmount: true,
        },
      }),
    ])
const count = await prisma.salesInvoice.count()
    // Map productId to product name
    const productNames = await prisma.product.findMany({
      where: {
        product_id: {
          in: topProductsData.map(p => p.productId),
        },
      },
      select: {
        product_id: true,
        name: true,
      },
    })

    const topProducts = topProductsData.map(p => ({
      name: productNames.find(prod => prod.product_id === p.productId)?.name || 'Unknown',
      quantity: p._sum.quantity || 0,
    }))

    const trendMap: { [date: string]: number } = {}

    trendRaw.forEach(sale => {
      const date = format(sale.createdAt, 'yyyy-MM-dd')
      trendMap[date] = (trendMap[date] || 0) + sale.totalAmount
    })

    const salesTrend = Object.entries(trendMap).map(([date, total]) => ({
      date,
      total,
    }))

    return NextResponse.json({
      totalSales,
      totalRevenue: revenueResult._sum.totalAmount || 0,
      topProducts,
      salesTrend,
      totalInvoices: count,
    })
  } catch (error) {
    console.error('Error generating sales report:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}
