import { ListThemes } from "@/components/clientComponents/theme/listThemes";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";

export const themeWithSubThemes =
  Prisma.validator<Prisma.theme$subThemesArgs>()({
    include: {
      subThemes: true,
      ayats: true,
    },
  });
export type ThemeWithSubThemes = Prisma.themeGetPayload<
  typeof themeWithSubThemes
>;

export default async function Themes() {
  const [themes, session] = await Promise.all([
    prisma.theme.findMany({
      include: { subThemes: true, ayats: true },
      orderBy: { order: "asc" },
    }),
    getAuthSession(),
  ]);

  return (
    <div className="md:container">
      <ListThemes themes={themes} admin={session?.user?.role === "ADMIN"} />
    </div>
  );
}
