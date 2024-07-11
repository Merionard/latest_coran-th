/*
  Warnings:

  - You are about to drop the column `sourate` on the `Ayat` table. All the data in the column will be lost.
  - You are about to drop the column `verset` on the `Ayat` table. All the data in the column will be lost.
  - Added the required column `number` to the `Ayat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sourateNumber` to the `Ayat` table without a default value. This is not possible if the table is not empty.
  - Made the column `surah` on table `quran` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ayah` on table `quran` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ayah_text` on table `quran` required. This step will fail if there are existing NULL values in that column.
  - Made the column `page` on table `quran` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pagehindi` on table `quran` required. This step will fail if there are existing NULL values in that column.
  - Made the column `surrahname` on table `quran` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chapter` on table `quran` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sajdah` on table `quran` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Ayat" DROP COLUMN "sourate",
DROP COLUMN "verset",
ADD COLUMN     "number" INTEGER NOT NULL,
ADD COLUMN     "sourateNumber" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "quran" ALTER COLUMN "surah" SET NOT NULL,
ALTER COLUMN "ayah" SET NOT NULL,
ALTER COLUMN "ayah_text" SET NOT NULL,
ALTER COLUMN "page" SET NOT NULL,
ALTER COLUMN "pagehindi" SET NOT NULL,
ALTER COLUMN "surrahname" SET NOT NULL,
ALTER COLUMN "chapter" SET NOT NULL,
ALTER COLUMN "sajdah" SET NOT NULL,
ALTER COLUMN "traduction" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Sourate" (
    "number" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,

    CONSTRAINT "Sourate_pkey" PRIMARY KEY ("number")
);

-- AddForeignKey
ALTER TABLE "Ayat" ADD CONSTRAINT "Ayat_sourateNumber_fkey" FOREIGN KEY ("sourateNumber") REFERENCES "Sourate"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
