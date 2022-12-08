/*
  Warnings:

  - Added the required column `CustomPackagePrice` to the `customer_package` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discountPrice` to the `customer_package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "customer_package" ADD COLUMN     "CustomPackagePrice" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "discountPrice" DECIMAL(65,30) NOT NULL;
