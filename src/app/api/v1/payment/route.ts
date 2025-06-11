import { PrismaClient } from "@prisma/client"; // Using Prisma for DB interactions
// Initialize Prisma client
const prisma = new PrismaClient();

// Define the type for payment data
type PaymentData = {
  invoice_id: string;
  amount: number;
  paymentDate: string;
};

// POST handler
export const POST = async (req: Request) => {
  try {
    const { invoice_id, amount, paymentDate }: PaymentData = await req.json();

    // Validate incoming request data manually
    if (!invoice_id || typeof invoice_id !== "string") {
      return new Response(JSON.stringify({ error: "Invalid or missing invoice_id" }), { status: 400 });
    }

    if (typeof amount !== "number" || amount < 0) {
      return new Response(JSON.stringify({ error: "Amount must be a positive number" }), { status: 400 });
    }

    if (!paymentDate || typeof paymentDate !== "string") {
      return new Response(JSON.stringify({ error: "Invalid or missing paymentDate" }), { status: 400 });
    }

    // Save payment information in the database
    const payment = await prisma.payment.create({
      data: {
        invoice_id: invoice_id,
        amount: amount,
        paymentDate: paymentDate,
      },
    });

    // Respond with the created payment data
    return new Response(JSON.stringify(payment), { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return new Response(JSON.stringify({ error: "Server error during payment creation" }), { status: 500 });
  }
};

// GET handler
export const GET = async () => {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        invoice: true, // Include invoice details if needed
      },
    });

    return new Response(JSON.stringify(payments), { status: 200 });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch payments" }), { status: 500 });
  }
};
