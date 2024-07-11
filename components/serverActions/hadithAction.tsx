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
