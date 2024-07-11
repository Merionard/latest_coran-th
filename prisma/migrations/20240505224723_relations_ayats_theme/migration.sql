/*
  Warnings:

  - You are about to drop the column `themeId` on the `ayat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ayat" DROP CONSTRAINT "ayat_themeId_fkey";

-- AlterTable
ALTER TABLE "ayat" DROP COLUMN "themeId";

-- CreateTable
CREATE TABLE "_AyatThemes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AyatThemes_AB_unique" ON "_AyatThemes"("A", "B");

-- CreateIndex
CREATE INDEX "_AyatThemes_B_index" ON "_AyatThemes"("B");

-- AddForeignKey
ALTER TABLE "_AyatThemes" ADD CONSTRAINT "_AyatThemes_A_fkey" FOREIGN KEY ("A") REFERENCES "ayat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AyatThemes" ADD CONSTRAINT "_AyatThemes_B_fkey" FOREIGN KEY ("B") REFERENCES "theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
