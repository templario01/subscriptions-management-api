/*
  Warnings:

  - Added the required column `status` to the `billing` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('PAID', 'PENDING');

-- AlterTable
ALTER TABLE "billing" ADD COLUMN     "status" "BillingStatus" NOT NULL;
