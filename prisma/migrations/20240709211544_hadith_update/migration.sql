/*
  Warnings:

  - You are about to drop the column `number` on the `hadith` table. All the data in the column will be lost.
  - You are about to drop the column `numberInChapter` on the `hadith` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "hadith" DROP COLUMN "number",
DROP COLUMN "numberInChapter",
ADD COLUMN     "hadithReference" TEXT,
ADD COLUMN     "inBookReference" TEXT;
