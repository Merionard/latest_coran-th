-- CreateTable
CREATE TABLE "_UserHadiths" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_hadithsLearned" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserHadiths_AB_unique" ON "_UserHadiths"("A", "B");

-- CreateIndex
CREATE INDEX "_UserHadiths_B_index" ON "_UserHadiths"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_hadithsLearned_AB_unique" ON "_hadithsLearned"("A", "B");

-- CreateIndex
CREATE INDEX "_hadithsLearned_B_index" ON "_hadithsLearned"("B");

-- AddForeignKey
ALTER TABLE "_UserHadiths" ADD CONSTRAINT "_UserHadiths_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserHadiths" ADD CONSTRAINT "_UserHadiths_B_fkey" FOREIGN KEY ("B") REFERENCES "hadith"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_hadithsLearned" ADD CONSTRAINT "_hadithsLearned_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_hadithsLearned" ADD CONSTRAINT "_hadithsLearned_B_fkey" FOREIGN KEY ("B") REFERENCES "hadith"("id") ON DELETE CASCADE ON UPDATE CASCADE;
