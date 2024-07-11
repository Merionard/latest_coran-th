-- CreateTable
CREATE TABLE "quran" (
    "surah" INTEGER,
    "ayah" INTEGER,
    "ayah_text" TEXT,
    "hizb" REAL,
    "page" INTEGER,
    "pagehindi" TEXT,
    "index" INTEGER NOT NULL,
    "surrahname" TEXT,
    "chapter" INTEGER,
    "sajdah" INTEGER,
    "id" SERIAL NOT NULL,
    "traduction" TEXT NOT NULL,

    CONSTRAINT "quran_pkey" PRIMARY KEY ("id")
);
