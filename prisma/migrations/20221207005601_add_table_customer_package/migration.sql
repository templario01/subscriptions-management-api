/*
  Warnings:

  - You are about to drop the column `billing_date` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the `combo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "combo" DROP CONSTRAINT "combo_billingDetailId_fkey";

-- DropForeignKey
ALTER TABLE "combo" DROP CONSTRAINT "combo_userId_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_combo_id_fkey";

-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_userId_fkey";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "billing_date",
DROP COLUMN "start_date",
DROP COLUMN "userId";

-- DropTable
DROP TABLE "combo";

-- CreateTable
CREATE TABLE "customer_package" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "totalPrice" DECIMAL(65,30) NOT NULL,
    "description" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "billing_date" TIMESTAMP(3) NOT NULL,
    "billingDetailId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "customer_package_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customer_package_uuid_key" ON "customer_package"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "customer_package_userId_key" ON "customer_package"("userId");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_combo_id_fkey" FOREIGN KEY ("combo_id") REFERENCES "customer_package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_package" ADD CONSTRAINT "customer_package_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_package" ADD CONSTRAINT "customer_package_billingDetailId_fkey" FOREIGN KEY ("billingDetailId") REFERENCES "billing_detail"("id") ON DELETE SET NULL ON UPDATE CASCADE;
