-- CreateTable
CREATE TABLE "Theme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ayat" (
    "id" SERIAL NOT NULL,
    "sourate" INTEGER NOT NULL,
    "verset" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,

    CONSTRAINT "Ayat_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Theme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ayat" ADD CONSTRAINT "Ayat_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
