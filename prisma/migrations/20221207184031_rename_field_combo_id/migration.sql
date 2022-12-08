/*
  Warnings:

  - You are about to drop the column `combo_id` on the `subscription` table. All the data in the column will be lost.
  - Added the required column `package_id` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_combo_id_fkey";

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "combo_id",
ADD COLUMN     "package_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "customer_package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
