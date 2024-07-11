import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { SelectAyat } from "../clientComponents/ayat/searchAyatSelect";

export const sourateWhithAyat = Prisma.validator<Prisma.sourateDefaultArgs>()({
  include: {
    ayats: true,
  },
});
export type SourateWhithAyat = Prisma.sourateGetPayload<
  typeof sourateWhithAyat
>;

export default async function ThemeSearchAyat(props: { themeId: number }) {
  const souratesWhithAyats = await prisma.sourate.findMany({
    include: {
      ayats: {
        where: {
          number: {
            gt: 0,
          },
        },
        orderBy: {
          number: "asc",
        },
      },
    },
    orderBy: {
      number: "asc",
    },
  });

  return (
    <div>
      <SelectAyat
        sourateWhithAyat={souratesWhithAyats}
        themeId={props.themeId}
      />
    </div>
  );
}
