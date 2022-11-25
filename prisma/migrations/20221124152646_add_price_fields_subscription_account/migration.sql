/*
  Warnings:

  - You are about to drop the column `billingId` on the `billing_detail` table. All the data in the column will be lost.
  - You are about to drop the column `complete_price` on the `platform` table. All the data in the column will be lost.
  - You are about to drop the column `isSoldBySlots` on the `platform` table. All the data in the column will be lost.
  - You are about to drop the column `manageId` on the `platform` table. All the data in the column will be lost.
  - You are about to drop the column `slot_price` on the `platform` table. All the data in the column will be lost.
  - The primary key for the `user_manage_platform` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assignedAt` on the `user_manage_platform` table. All the data in the column will be lost.
  - You are about to drop the column `platformId` on the `user_manage_platform` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_manage_platform` table. All the data in the column will be lost.
  - Added the required column `platform_id` to the `user_manage_platform` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_manage_platform` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "billing_detail" DROP CONSTRAINT "billing_detail_billingId_fkey";

-- DropForeignKey
ALTER TABLE "user_manage_platform" DROP CONSTRAINT "user_manage_platform_platformId_fkey";

-- DropForeignKey
ALTER TABLE "user_manage_platform" DROP CONSTRAINT "user_manage_platform_userId_fkey";

-- AlterTable
ALTER TABLE "billing_detail" DROP COLUMN "billingId",
ADD COLUMN     "billing_id" INTEGER;

-- AlterTable
ALTER TABLE "platform" DROP COLUMN "complete_price",
DROP COLUMN "isSoldBySlots",
DROP COLUMN "manageId",
DROP COLUMN "slot_price",
ADD COLUMN     "manage_id" INTEGER;

-- AlterTable
ALTER TABLE "subscription_account" ADD COLUMN     "complete_price" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "is_sold_by_slots" BOOLEAN,
ADD COLUMN     "slot_price" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "user_manage_platform" DROP CONSTRAINT "user_manage_platform_pkey",
DROP COLUMN "assignedAt",
DROP COLUMN "platformId",
DROP COLUMN "userId",
ADD COLUMN     "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "platform_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "user_manage_platform_pkey" PRIMARY KEY ("user_id", "platform_id");

-- AddForeignKey
ALTER TABLE "user_manage_platform" ADD CONSTRAINT "user_manage_platform_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_manage_platform" ADD CONSTRAINT "user_manage_platform_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billing_detail" ADD CONSTRAINT "billing_detail_billing_id_fkey" FOREIGN KEY ("billing_id") REFERENCES "billing"("id") ON DELETE SET NULL ON UPDATE CASCADE;
