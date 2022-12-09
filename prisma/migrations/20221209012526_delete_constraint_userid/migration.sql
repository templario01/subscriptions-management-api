-- DropForeignKey
ALTER TABLE "user_info" DROP CONSTRAINT "user_info_userId_fkey";

-- AlterTable
ALTER TABLE "user_info" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "user_info" ADD CONSTRAINT "user_info_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
