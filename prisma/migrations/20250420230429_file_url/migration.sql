/*
  Warnings:

  - You are about to drop the `UploadedInvoice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fileName` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileUrl` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UploadedInvoice" DROP CONSTRAINT "UploadedInvoice_uploadedById_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "fileUrl" TEXT NOT NULL;

-- DropTable
DROP TABLE "UploadedInvoice";
