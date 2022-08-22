/*
  Warnings:

  - A unique constraint covering the columns `[platform_id,email]` on the table `subscription_account` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subscription_account_platform_id_email_key" ON "subscription_account"("platform_id", "email");
