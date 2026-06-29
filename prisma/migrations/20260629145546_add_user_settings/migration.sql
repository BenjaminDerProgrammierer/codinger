/*
  Warnings:

  - You are about to drop the column `userSettings` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "userSettings",
ADD COLUMN     "currentPathId" INTEGER;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_currentPathId_fkey" FOREIGN KEY ("currentPathId") REFERENCES "LearningPath"("id") ON DELETE SET NULL ON UPDATE CASCADE;
