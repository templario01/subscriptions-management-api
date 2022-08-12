/*
  Warnings:

  - You are about to drop the column `amount` on the `combo` table. All the data in the column will be lost.
  - You are about to drop the column `emailSubscription` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `platform_id` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the `Platform` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customPrice` to the `combo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customPrice` to the `subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "subscription" DROP CONSTRAINT "subscription_platform_id_fkey";

-- AlterTable
ALTER TABLE "combo" DROP COLUMN "amount",
ADD COLUMN     "customPrice" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "subscription" DROP COLUMN "emailSubscription",
DROP COLUMN "platform_id",
DROP COLUMN "price",
ADD COLUMN     "customPrice" DECIMAL(65,30) NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "last_session" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "Platform";

-- CreateTable
CREATE TABLE "subscription_account" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "uuid" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "platform_id" INTEGER NOT NULL,

    CONSTRAINT "subscription_account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "platform" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "default_price" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "logo" TEXT,

    CONSTRAINT "platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SubscriptionToSubscriptionAccount" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "subscription_account_uuid_key" ON "subscription_account"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "platform_uuid_key" ON "platform"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "platform_name_key" ON "platform"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_SubscriptionToSubscriptionAccount_AB_unique" ON "_SubscriptionToSubscriptionAccount"("A", "B");

-- CreateIndex
CREATE INDEX "_SubscriptionToSubscriptionAccount_B_index" ON "_SubscriptionToSubscriptionAccount"("B");

-- AddForeignKey
ALTER TABLE "subscription_account" ADD CONSTRAINT "subscription_account_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubscriptionToSubscriptionAccount" ADD CONSTRAINT "_SubscriptionToSubscriptionAccount_A_fkey" FOREIGN KEY ("A") REFERENCES "subscription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubscriptionToSubscriptionAccount" ADD CONSTRAINT "_SubscriptionToSubscriptionAccount_B_fkey" FOREIGN KEY ("B") REFERENCES "subscription_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
