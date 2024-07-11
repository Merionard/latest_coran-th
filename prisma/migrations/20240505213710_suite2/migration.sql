-- DropForeignKey
ALTER TABLE "ayat" DROP CONSTRAINT "ayat_themeId_fkey";

-- AlterTable
ALTER TABLE "ayat" ALTER COLUMN "themeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ayat" ADD CONSTRAINT "ayat_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "theme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
