/*
  Warnings:

  - Added the required column `content` to the `Ayat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `traduction` to the `Ayat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ayat" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "traduction" TEXT NOT NULL;
