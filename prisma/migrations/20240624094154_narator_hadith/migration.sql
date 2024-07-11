/*
  Warnings:

  - Added the required column `narratorEn` to the `hadith` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "hadith" ADD COLUMN     "narratorEn" TEXT NOT NULL,
ADD COLUMN     "narratorFr" TEXT;
