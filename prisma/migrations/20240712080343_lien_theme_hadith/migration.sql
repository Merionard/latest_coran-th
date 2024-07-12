-- CreateTable
CREATE TABLE "_HadithThemes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_HadithThemes_AB_unique" ON "_HadithThemes"("A", "B");

-- CreateIndex
CREATE INDEX "_HadithThemes_B_index" ON "_HadithThemes"("B");

-- AddForeignKey
ALTER TABLE "_HadithThemes" ADD CONSTRAINT "_HadithThemes_A_fkey" FOREIGN KEY ("A") REFERENCES "hadith"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HadithThemes" ADD CONSTRAINT "_HadithThemes_B_fkey" FOREIGN KEY ("B") REFERENCES "theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
