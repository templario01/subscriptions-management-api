/*
  Warnings:

  - You are about to drop the column `amount` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `logo` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `subscription` table. All the data in the column will be lost.
  - Added the required column `platform_id` to the `subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "amount",
DROP COLUMN "logo",
DROP COLUMN "platform",
ADD COLUMN     "platform_id" INTEGER NOT NULL,
ADD COLUMN     "price" DECIMAL(65,30) NOT NULL;

-- DropEnum
DROP TYPE "Platform";

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "default_price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "logo" TEXT,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Platform_uuid_key" ON "Platform"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_name_key" ON "Platform"("name");

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
