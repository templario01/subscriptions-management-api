/*
  Warnings:

  - You are about to drop the column `userId` on the `customer_package` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customerId]` on the table `customer_package` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[customerId]` on the table `user_info` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "billing" DROP CONSTRAINT "billing_user_id_fkey";

-- DropForeignKey
ALTER TABLE "customer_package" DROP CONSTRAINT "customer_package_userId_fkey";

-- DropIndex
DROP INDEX "customer_package_userId_key";

-- AlterTable
ALTER TABLE "customer_package" DROP COLUMN "userId",
ADD COLUMN     "customerId" INTEGER;

-- AlterTable
ALTER TABLE "user_info" ADD COLUMN     "customerId" INTEGER;

-- CreateTable
CREATE TABLE "Customer" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "userInfoId" INTEGER,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Customer_uuid_key" ON "Customer"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "customer_package_customerId_key" ON "customer_package"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "user_info_customerId_key" ON "user_info"("customerId");

-- AddForeignKey
ALTER TABLE "customer_package" ADD CONSTRAINT "customer_package_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
