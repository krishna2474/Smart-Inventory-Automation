/*
  Warnings:

  - The primary key for the `SalesInvoice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `SalesInvoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `SalesItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SalesItem" DROP CONSTRAINT "SalesItem_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "SalesItem" DROP CONSTRAINT "SalesItem_productId_fkey";

-- AlterTable
ALTER TABLE "SalesInvoice" DROP CONSTRAINT "SalesInvoice_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "SalesInvoice_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "SalesItem";

-- CreateTable
CREATE TABLE "SalesInvoiceItem" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "salesInvoiceId" INTEGER NOT NULL,

    CONSTRAINT "SalesInvoiceItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SalesInvoiceItem" ADD CONSTRAINT "SalesInvoiceItem_salesInvoiceId_fkey" FOREIGN KEY ("salesInvoiceId") REFERENCES "SalesInvoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
