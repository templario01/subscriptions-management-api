/*
  Warnings:

  - You are about to drop the column `default_price` on the `platform` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "platform" DROP COLUMN "default_price",
ADD COLUMN     "complete_price" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "slot_price" DECIMAL(65,30) NOT NULL DEFAULT 0;
