-- CreateTable
CREATE TABLE "_AyatsLearned" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AyatsLearned_AB_unique" ON "_AyatsLearned"("A", "B");

-- CreateIndex
CREATE INDEX "_AyatsLearned_B_index" ON "_AyatsLearned"("B");

-- AddForeignKey
ALTER TABLE "_AyatsLearned" ADD CONSTRAINT "_AyatsLearned_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AyatsLearned" ADD CONSTRAINT "_AyatsLearned_B_fkey" FOREIGN KEY ("B") REFERENCES "ayat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
