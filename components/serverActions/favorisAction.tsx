"use server";

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";

export const addFavoriteAyat = async (ayatId: number) => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour ajouter des favoris!");
  }
  return prisma.user.update({
    where: { id: session.user.id },
    data: {
      myAyats: {
        connect: { id: ayatId },
      },
    },
  });
};

export const removeFavoriteAyat = async (ayatId: number) => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour ajouter des favoris!");
  }
  return prisma.user.update({
    where: { id: session.user.id },
    data: {
      myAyats: {
        disconnect: { id: ayatId },
      },
    },
  });
};

export const toogleFavoriteAyat = async (
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
      myAyats: action,
    },
  });
};

export const toogleFavoriteTheme = async (
  themeId: number,
  isFavorite: boolean
) => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour ajouter des favoris!");
  }
  const action = isFavorite
    ? { disconnect: { id: themeId } }
    : { connect: { id: themeId } };
  return prisma.user.update({
    where: { id: session.user.id },
    data: {
      myThemes: action,
    },
  });
};

export const markAsLearned = async (ayatId: number) => {
  const session = await getAuthSession();
  if (!session) {
    throw new Error("Vous devez être connecté pour marquer en appris!");
  }

  return prisma.user.update({
    where: { id: session.user.id },
    data: {
      ayatsLearned: { connect: { id: ayatId } },
    },
  });
};
