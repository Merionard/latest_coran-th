/*
  Warnings:

  - You are about to drop the column `sourateNumber` on the `ayat` table. All the data in the column will be lost.
  - Added the required column `sourate_number` to the `ayat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ayat" DROP CONSTRAINT "ayat_sourateNumber_fkey";

-- AlterTable
ALTER TABLE "ayat" DROP COLUMN "sourateNumber",
ADD COLUMN     "sourate_number" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ayat" ADD CONSTRAINT "ayat_sourate_number_fkey" FOREIGN KEY ("sourate_number") REFERENCES "sourate"("number") ON DELETE RESTRICT ON UPDATE CASCADE;
