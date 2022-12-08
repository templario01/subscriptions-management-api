/*
  Warnings:

  - You are about to drop the column `CustomPackagePrice` on the `customer_package` table. All the data in the column will be lost.
  - Added the required column `customPackagePrice` to the `customer_package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer_package" DROP COLUMN "CustomPackagePrice",
ADD COLUMN     "customPackagePrice" DECIMAL(65,30) NOT NULL;
