-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN "smsResetToken" TEXT;
ALTER TABLE "Usuario" ADD COLUMN "smsResetTokenExpiry" DATETIME;
