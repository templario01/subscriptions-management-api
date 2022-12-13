/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "customer_email_key" ON "customer"("email");
