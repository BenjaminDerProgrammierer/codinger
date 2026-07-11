/*
  Warnings:

  - You are about to drop the column `currentPathId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_currentPathId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "currentPathId",
ADD COLUMN     "currentPathSlug" TEXT;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_currentPathSlug_fkey" FOREIGN KEY ("currentPathSlug") REFERENCES "LearningPath"("slug") ON DELETE SET NULL ON UPDATE CASCADE;
