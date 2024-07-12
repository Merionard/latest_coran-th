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
