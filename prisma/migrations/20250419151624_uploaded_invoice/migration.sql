/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "File";

-- CreateTable
CREATE TABLE "UploadedInvoice" (
    "id" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "extractedData" TEXT,
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedInvoice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UploadedInvoice" ADD CONSTRAINT "UploadedInvoice_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
