/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `LearningPath` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Lesson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Unit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `LearningPath` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LearningPath" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_slug_key" ON "LearningPath"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Unit_slug_key" ON "Unit"("slug");
