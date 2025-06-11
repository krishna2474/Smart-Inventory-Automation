import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { paymentId: string } }) {
    const { paymentId } = params;
    const { status } = await req.json();
  console.log("Updating payment status:", { paymentId, status });
  
    // Validate the status field
    if (!['PENDING', 'PAID'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
  
    try {
      // Find the payment by ID
      const payment = await prisma.payment.findUnique({
        where: {
          payment_id: paymentId,
        },
      });
  
      if (!payment) {
        return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
      }
  
      // Update the payment status
      const updatedPayment = await prisma.payment.update({
        where: {
          payment_id: paymentId,
        },
        data: {
          status: status,
        },
      });
  
      // Return the updated payment
      return NextResponse.json(updatedPayment, { status: 200 });
    } catch (error) {
      console.error('Error updating payment status:', error);
      return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
    }
  }