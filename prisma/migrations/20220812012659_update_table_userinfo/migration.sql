/*
  Warnings:

  - Made the column `avatar` on table `user_info` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_info" ADD COLUMN     "alias" TEXT,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "avatar" SET NOT NULL;
