import { PageCoran } from "@/components/clientComponents/coran/pageCoran";
import { prisma } from "@/prisma/client";

export default async function Coran() {
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
      <PageCoran sourateWhithAyat={souratesWhithAyats} />
    </div>
  );
}
