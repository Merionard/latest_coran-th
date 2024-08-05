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
};

export const FirstSearchHadiths = async (
  search: string,
  page: number,
  pageSize: number
) => {
  const offset = (page - 1) * pageSize;

  const [result, totalcount] = await prisma.$transaction([
    prisma.$queryRaw<HadithSearch[]>`
      SELECT h.* ,hb."titleTraductionFr"
      FROM "hadith" h
      JOIN  "hadithChapter" hc on hc.id = h.hadith_chapter 
      JOIN "hadithBook" hb ON hb.id = hc.hadith_book_id 
      WHERE REGEXP_REPLACE(h."content", '[\u064B-\u065F\u0670\u06D6-\u06ED\u0671\u0673]', '', 'g')
      ILIKE ${"%" + search + "%"}
      OR h."traductionFr" ILIKE ${"%" + search + "%"}
      LIMIT ${pageSize}
      OFFSET ${offset}
    `,
    prisma.$queryRaw<number>`
      SELECT COUNT(*) as totalcount
      FROM "hadith" h
      JOIN  "hadithChapter" hc on hc.id = h.hadith_chapter 
      JOIN "hadithBook" hb ON hb.id = hc.hadith_book_id 
      WHERE REGEXP_REPLACE(h."content", '[\u064B-\u065F\u0670\u06D6-\u06ED\u0671\u0673]', '', 'g')
      ILIKE ${"%" + search + "%"}
      OR h."traductionFr" ILIKE  ${"%" + search + "%"}
    `,
  ]);
  //@ts-ignore
  console.log("nombre enregistrement " + Number(totalcount[0].totalcount));
  return {
    ayats: result,
    //@ts-ignore
    totalCount: Number(totalcount[0].totalcount),
  };
};

export const searchHadiths = async (
  search: string,
  page: number,
  pageSize: number
) => {
  const offset = (page - 1) * pageSize;

  const [result] = await prisma.$transaction([
    prisma.$queryRaw<HadithSearch[]>`
      SELECT h.* ,hb."titleTraductionFr"
      FROM "hadith" h
      JOIN  "hadithChapter" hc on hc.id = h.hadith_chapter 
      JOIN "hadithBook" hb ON hb.id = hc.hadith_book_id 
      WHERE REGEXP_REPLACE(h."content", '[\u064B-\u065F\u0670\u06D6-\u06ED\u0671\u0673]', '', 'g')
      ILIKE ${"%" + search + "%"}
      OR h."traductionFr" ILIKE  ${"%" + search + "%"}
      LIMIT ${pageSize}
      OFFSET ${offset}
    `,
  ]);

  return {
    ayats: result,
  };
};
