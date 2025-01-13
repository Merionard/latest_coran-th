"use server";

import { getAuthSession } from "@/lib/auth";
import { cleanTashkeel, removeAccents } from "@/lib/utils";
import { prisma } from "@/prisma/client";

export const createNewThemeCoran = async (
  themeName: string,
  parentId?: number,
  description?: string
) => {
  const session = await getAuthSession();

  if (!session || session?.user.role !== "ADMIN") {
    throw new Error("Vous devez être admin!");
  }
  const theme = await prisma.theme.findFirst({ where: { name: themeName } });

  if (theme !== null) {
    return null;
  }
  if (parentId) {
    const themeParent = await prisma.theme.findUnique({
      where: { id: parentId },
    });
    if (themeParent) {
      const newTheme = await prisma.theme.create({
        data: {
          name: themeName,
          parent: { connect: { id: parentId } },
          description: description,
        },
      });
      return newTheme;
    }
  }
  const newTheme = await prisma.theme.create({
    data: { name: themeName, description: description },
  });
  return newTheme;
};

export const addAyatOnTheme = async (themeId: number, ayatId: number) => {
  const session = await getAuthSession();
  if (!session || session?.user.role !== "ADMIN") {
    throw new Error("Vous devez être admin!");
  }
  return await prisma.theme.update({
    where: { id: themeId },
    data: {
      ayats: {
        connect: { id: ayatId },
      },
    },
  });
};

export const removeAyatOnTheme = async (themeId: number, ayatId: number) => {
  const session = await getAuthSession();
  if (!session || session?.user.role !== "ADMIN") {
    throw new Error("Vous devez être admin!");
  }
  return await prisma.theme.update({
    where: { id: themeId },
    data: {
      ayats: {
        disconnect: { id: ayatId },
      },
    },
  });
};

export const updateTheme = async (
  name: string,
  themeId: number,
  parentId?: number,
  description?: string
) => {
  const session = await getAuthSession();
  if (!session || session?.user.role !== "ADMIN") {
    throw new Error("Vous devez être admin!");
  }
  const data = parentId
    ? {
        name: name,
        parentId: parentId,
        description: description,
      }
    : {
        name: name,
        description: description,
      };
  return await prisma.theme.update({
    where: { id: themeId },
    data: data,
  });
};

export const deleteTheme = async (themeId: number) => {
  const session = await getAuthSession();
  if (!session || session?.user.role !== "ADMIN") {
    throw new Error("Vous devez être admin!");
  }

  return await prisma.theme.delete({ where: { id: themeId } });
};

export const findAllThemeWithAyatBySearch = async (search: string) => {
  const cleanSearch = cleanTashkeel(search);
  const searchWithoutAccent = removeAccents(search);
  if (search.length === 0) {
    return [];
  }
  return await prisma.$queryRaw<
    Array<
      {
        ayats: Array<{
          number: number;
          id: number;
          sourate_number: number;
          content: string;
          traduction: string | null;
          toLearn: boolean;
        }>;
      } & {
        name: string;
        id: number;
        parentId: number | null;
        description: string | null;
        order: number | null;
      }
    >
  >`
  SELECT 
      t."id",
      t."name",
      t."parentId",
      t."description",
      t."order",
      json_agg(
        json_build_object(
          'id', a."id",
          'number', a."number",
          'sourate_number', a."sourate_number",
          'content', a."content",
          'traduction', a."traduction",
          'toLearn', a."toLearn"
        )
      ) AS ayats
  FROM "public"."theme" t
  INNER JOIN "public"."_AyatThemes" at ON t."id" = at."B"
  INNER JOIN "public"."ayat" a ON at."A" = a."id"
  WHERE t."id" IN (
      SELECT DISTINCT "t1"."B"
      FROM "public"."_AyatThemes" AS "t1"
      INNER JOIN "public"."ayat" AS "j1"
        ON "j1"."id" = "t1"."A"
      WHERE (
        unaccent("j1"."traduction") ILIKE  ${"%" + searchWithoutAccent + "%"}
        OR REGEXP_REPLACE("j1"."content", '[\u064B-\u065F\u0670\u06D6-\u06ED\u0671\u0673]', '', 'g') ILIKE  ${
          "%" + cleanSearch + "%"
        }
      )
  )
  AND (
      unaccent(a."traduction") ILIKE  ${"%" + searchWithoutAccent + "%"}
      OR REGEXP_REPLACE(a."content", '[\u064B-\u065F\u0670\u06D6-\u06ED\u0671\u0673]', '', 'g') ILIKE  ${
        "%" + cleanSearch + "%"
      }
  )
  GROUP BY t."id", t."name", t."parentId", t."description", t."order";
`;
};
