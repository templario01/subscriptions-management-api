-- AlterTable
ALTER TABLE "platform" ADD COLUMN     "manageId" INTEGER;

-- CreateTable
CREATE TABLE "user_manage_platform" (
    "userId" INTEGER NOT NULL,
    "platformId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_manage_platform_pkey" PRIMARY KEY ("userId","platformId")
);

-- AddForeignKey
ALTER TABLE "user_manage_platform" ADD CONSTRAINT "user_manage_platform_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_manage_platform" ADD CONSTRAINT "user_manage_platform_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
