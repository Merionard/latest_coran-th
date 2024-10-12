"use server";

import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";

export const addAyatToLearn = async (ayatId: number) => {
  const session = await getAuthSession();
  if (!session || session?.user.role !== "ADMIN") {
    throw new Error("Vous devez être admin!");
  }
  return await prisma.ayat.update({
    where: { id: ayatId },
    data: {
      toLearn: true,
    },
  });
};
