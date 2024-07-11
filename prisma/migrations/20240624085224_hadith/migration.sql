-- CreateTable
CREATE TABLE "hadithBook" (
    "id" INTEGER NOT NULL,
    "length" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "introduction" TEXT NOT NULL,
    "titleTraductionEn" TEXT NOT NULL,
    "authorTraductionEn" TEXT NOT NULL,
    "introductionTraductionEn" TEXT NOT NULL,
    "titleTraductionFr" TEXT,
    "authorTraductionFr" TEXT,
    "introductionTraductionFr" TEXT,

    CONSTRAINT "hadithBook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadithChapter" (
    "id" INTEGER NOT NULL,
    "hadith_book_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleFr" TEXT,

    CONSTRAINT "hadithChapter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hadith" (
    "id" SERIAL NOT NULL,
    "hadith_chapter" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "traductionEn" TEXT NOT NULL,
    "traductionFr" TEXT,

    CONSTRAINT "hadith_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "hadithChapter" ADD CONSTRAINT "hadithChapter_hadith_book_id_fkey" FOREIGN KEY ("hadith_book_id") REFERENCES "hadithBook"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hadith" ADD CONSTRAINT "hadith_hadith_chapter_fkey" FOREIGN KEY ("hadith_chapter") REFERENCES "hadithChapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
