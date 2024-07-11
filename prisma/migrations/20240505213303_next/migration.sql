/*
  Warnings:

  - You are about to drop the `Ayat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sourate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Theme` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Ayat" DROP CONSTRAINT "Ayat_sourateNumber_fkey";

-- DropForeignKey
ALTER TABLE "Ayat" DROP CONSTRAINT "Ayat_themeId_fkey";

-- DropForeignKey
ALTER TABLE "Theme" DROP CONSTRAINT "Theme_parentId_fkey";

-- DropTable
DROP TABLE "Ayat";

-- DropTable
DROP TABLE "Sourate";

-- DropTable
DROP TABLE "Theme";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "theme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sourate" (
    "number" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,

    CONSTRAINT "sourate_pkey" PRIMARY KEY ("number")
);

-- CreateTable
CREATE TABLE "ayat" (
    "id" SERIAL NOT NULL,
    "sourateNumber" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "traduction" TEXT NOT NULL,

    CONSTRAINT "ayat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "theme" ADD CONSTRAINT "theme_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "theme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayat" ADD CONSTRAINT "ayat_sourateNumber_fkey" FOREIGN KEY ("sourateNumber") REFERENCES "sourate"("number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ayat" ADD CONSTRAINT "ayat_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
