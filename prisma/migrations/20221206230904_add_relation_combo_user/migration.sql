-- AlterTable
ALTER TABLE "combo" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "combo" ADD CONSTRAINT "combo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
