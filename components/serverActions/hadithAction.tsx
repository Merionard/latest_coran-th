"use server";

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";

export const addFavoriteHadith = async (hadithId: number) => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour ajouter des favoris!");
  }
  return prisma.user.update({
    where: { id: session.user.id },
    data: {
      myHadiths: {
        connect: { id: hadithId },
      },
    },
  });
};

export const removeFavoriteHadith = async (hadithId: number) => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour ajouter des favoris!");
  }
  return prisma.user.update({
    where: { id: session.user.id },
    data: {
      myHadiths: {
        disconnect: { id: hadithId },
      },
    },
  });
};

export const toogleFavoriteHadith = async (
  ayatId: number,
  isFavorite: boolean
) => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour ajouter des favoris!");
  }
  const action = isFavorite
    ? { disconnect: { id: ayatId } }
    : { connect: { id: ayatId } };
  return prisma.user.update({
    where: { id: session.user.id },
    data: {
      myHadiths: action,
    },
  });
};

export const markHadithAsLearned = async (hadithId: number) => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour marquer en appris!");
  }

  return prisma.user.update({
    where: { id: session.user.id },
    data: {
      hadithsLearned: { connect: { id: hadithId } },
    },
  });
};

export const fetchHadithByBookId = async (bookId: number, skip: number) => {
  const [totalCount, hadiths] = await Promise.all([
    prisma.hadith.count({
      where: { hadithChapter: { hadithBook: { id: bookId } } },
    }),
    prisma.hadith.findMany({
      select: { id: true, hadithReference: true, inBookReference: true },
      where: { hadithChapter: { hadithBook: { id: bookId } } },
      take: 200,
      skip: skip,
    }),
  ]);

  return { totalCount, hadiths };
};

export const addHadithOnTheme = async (hadithId: number, themeId: number) => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour marquer en appris!");
  }

  return prisma.theme.update({
    where: { id: themeId },
    data: {
      hadiths: { connect: { id: hadithId } },
    },
  });
};

export const removeHadithOnTheme = async (
  hadithId: number,
  themeId: number
) => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour marquer en appris!");
  }

  return prisma.theme.update({
    where: { id: themeId },
    data: {
      hadiths: { disconnect: { id: hadithId } },
    },
  });
};

export type HadithSearch = {
  hadithReference: string;
  content: string;
  traductionEn: string;
  traductionFr: string;
  titleTraductionFr: string;
  id: number;
  bookId: number;
  chapterId: number;
};

export const searchHadiths = async (
  search: string,
  page: number,
  pageSize: number
) => {
  const offset = (page - 1) * pageSize;

  const result = await prisma.$queryRaw<HadithSearch[]>`
      SELECT 
      h.id,
      h."hadithReference",
      h.content,
      h."traductionEn",
      h."traductionFr",
      hb."titleTraductionFr",
      hc.id as "chapterId",
      hb.id as "bookId"
    FROM "hadith" h
    JOIN "hadithChapter" hc ON hc.id = h.hadith_chapter
    JOIN "hadithBook" hb ON hb.id = hc.hadith_book_id
    WHERE h."searchVector" @@ plainto_tsquery('arabic', ${search})
       OR h."searchVector" @@ plainto_tsquery('french', ${search})
    ORDER BY ts_rank(h."searchVector", plainto_tsquery('arabic', ${search})) +
             ts_rank(h."searchVector", plainto_tsquery('french', ${search})) DESC
    LIMIT ${pageSize}
    OFFSET ${offset}
  `;

  const totalCount = await prisma.$queryRaw<number>`
    SELECT COUNT(*)::integer
    FROM "hadith" h
    WHERE h."searchVector" @@ plainto_tsquery('arabic', ${search})
       OR h."searchVector" @@ plainto_tsquery('french', ${search})
  `;

  return {
    hadiths: result,
    //@ts-ignore
    totalCount: totalCount[0].count as number,
  };
};
