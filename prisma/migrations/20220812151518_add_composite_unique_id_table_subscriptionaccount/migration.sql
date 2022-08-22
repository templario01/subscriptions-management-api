/*
  Warnings:

  - A unique constraint covering the columns `[email,platform_id]` on the table `subscription_account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "subscription_account_platform_id_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "subscription_account_email_platform_id_key" ON "subscription_account"("email", "platform_id");
