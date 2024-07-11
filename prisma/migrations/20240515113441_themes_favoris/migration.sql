-- CreateTable
CREATE TABLE "_UserThemes" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserThemes_AB_unique" ON "_UserThemes"("A", "B");

-- CreateIndex
CREATE INDEX "_UserThemes_B_index" ON "_UserThemes"("B");

-- AddForeignKey
ALTER TABLE "_UserThemes" ADD CONSTRAINT "_UserThemes_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserThemes" ADD CONSTRAINT "_UserThemes_B_fkey" FOREIGN KEY ("B") REFERENCES "theme"("id") ON DELETE CASCADE ON UPDATE CASCADE;
