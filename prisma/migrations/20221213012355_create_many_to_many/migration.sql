/*
  Warnings:

  - You are about to drop the column `user_id` on the `billing` table. All the data in the column will be lost.
  - You are about to drop the column `billingDetailId` on the `customer_package` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `billing` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "billing" DROP CONSTRAINT "billing_user_id_fkey";

-- DropForeignKey
ALTER TABLE "customer_package" DROP CONSTRAINT "customer_package_billingDetailId_fkey";

-- AlterTable
ALTER TABLE "billing" DROP COLUMN "user_id",
ADD COLUMN     "customer_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "customer_package" DROP COLUMN "billingDetailId";

-- CreateTable
CREATE TABLE "_BillingDetailToCustomerPackage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BillingDetailToCustomerPackage_AB_unique" ON "_BillingDetailToCustomerPackage"("A", "B");

-- CreateIndex
CREATE INDEX "_BillingDetailToCustomerPackage_B_index" ON "_BillingDetailToCustomerPackage"("B");

-- AddForeignKey
ALTER TABLE "billing" ADD CONSTRAINT "billing_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BillingDetailToCustomerPackage" ADD CONSTRAINT "_BillingDetailToCustomerPackage_A_fkey" FOREIGN KEY ("A") REFERENCES "billing_detail"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BillingDetailToCustomerPackage" ADD CONSTRAINT "_BillingDetailToCustomerPackage_B_fkey" FOREIGN KEY ("B") REFERENCES "customer_package"("id") ON DELETE CASCADE ON UPDATE CASCADE;
