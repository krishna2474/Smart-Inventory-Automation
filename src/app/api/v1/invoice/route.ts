import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all invoices
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { deleted: false },
      include: { supplier: true, payments: true },
      orderBy: { created_at: 'desc' }
    })
    return NextResponse.json(invoices)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 })
  }
}

// POST new invoice
export async function POST(req: NextRequest) {
  try {
    const {
      supplier_id,
      totalAmount,
      fileName,
      invoiceDate,
      fileUrl,
      status
    } = await req.json();

    console.log({
      supplier_id,
      totalAmount,
      fileName,
      invoiceDate,
      fileUrl,
      status
    });

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        supplier_id,
        fileName,
        fileUrl,
        totalAmount,
        invoiceDate: new Date(invoiceDate),
        status: status ?? 'PENDING'
      }
    });

    // Create payment
    await prisma.payment.create({
      data: {
        invoice_id: invoice.invoice_id,
        amount: totalAmount,
        paymentDate: new Date(),
      }
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create invoice and payment' }, { status: 400 });
  }
}