import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();
type Hadith = {
  id: number;
  idInBook: number;
  chapterId: number;
  bookId: number;
  arabic: string;
  english: {
    narrator: string;
    text: string;
  };
  hadithReference?: string;
  inBookReference?: string;
};

type Chapter = {
  id: number;
  bookId: number;
  arabic: string;
  english: string;
};

type Metadata = {
  id: number;
  length: number;
  arabic: {
    title: string;
    author: string;
    introduction: string;
  };
  english: {
    title: string;
    author: string;
    introduction: string;
  };
};
type Book = {
  id: number;
  metadata: Metadata;
  chapters: Chapter[];
  hadiths: Hadith[];
};
async function updateChapter() {
  prisma.$connect();
  const filePath = path.resolve("./public/riyad_assalihin.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const book: Book = JSON.parse(jsonData) as Book;

  const bookToUbpdate = await prisma.hadithBook.findFirst({
    where: { title: book.metadata.arabic.title },
    include: { chapters: true },
  });

  if (bookToUbpdate) {
    for (const chapter of bookToUbpdate.chapters) {
      const chapterFromJson = book.chapters.find(
        (c) => c.english === chapter.titleEn
      );
      if (chapterFromJson) {
        console.log(chapterFromJson);
        await prisma.hadithChapter.update({
          where: { id: chapter.id },
          data: { chapterNumber: chapterFromJson.id },
        });
      }
    }
  }
}

async function updateHadith() {
  prisma.$connect();

  const filePath = path.resolve("./public/bukhari.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const book: Book = JSON.parse(jsonData) as Book;

  for (const hadithFromJson of book.hadiths) {
    const hadithToUpdate = await prisma.hadith.findFirst({
      where: { traductionEn: hadithFromJson.english.text },
    });
    if (hadithToUpdate) {
      await prisma.hadith.update({
        where: { id: hadithToUpdate.id },
        data: {
          hadithReference: hadithFromJson.hadithReference,
          inBookReference: hadithFromJson.inBookReference,
        },
      });
    }
  }

  /*   const hadithChapters = await prisma.hadithChapter.findMany({
    where: {
      hadith_book_id: 2,
    },
    select: {
      id: true,
    },
  });

  const hadithChapterIds = hadithChapters
    .filter((h) => h.id !== 876)
    .map((hc) => hc.id);

  const hadiths = await prisma.hadith.findMany({
    where: {
      hadith_chapter: {
        in: hadithChapterIds,
      },
    },
    orderBy: { id: "asc" },
  });

  for (let index = 0; index < hadiths.length; index++) {
    const h = hadiths[index];
    await prisma.hadith.update({
      where: { id: h.id },
      data: { number: index + 92 },
    });
  } */

  /*   const hadiths = await prisma.hadith.findMany({ orderBy: { id: "asc" } });
  for (let index = 0; index < hadiths.length; index++) {
    const h = hadiths[index];
    await prisma.hadith.update({
      where: { id: h.id },
      data: { number: index + 1 },
    });
  } */
}
async function main() {
  //await updateChapter();
  await updateHadith();
}

main();
