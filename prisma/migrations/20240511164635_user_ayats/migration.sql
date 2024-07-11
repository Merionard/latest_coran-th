-- CreateTable
CREATE TABLE "_UserAyats" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserAyats_AB_unique" ON "_UserAyats"("A", "B");

-- CreateIndex
CREATE INDEX "_UserAyats_B_index" ON "_UserAyats"("B");

-- AddForeignKey
ALTER TABLE "_UserAyats" ADD CONSTRAINT "_UserAyats_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserAyats" ADD CONSTRAINT "_UserAyats_B_fkey" FOREIGN KEY ("B") REFERENCES "ayat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
