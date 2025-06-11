-- AlterTable
ALTER TABLE "Otp" ADD CONSTRAINT "Otp_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "Otp_id_key";

-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- DropIndex
DROP INDEX "User_user_id_key";
