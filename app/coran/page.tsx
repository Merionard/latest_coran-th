import { PageCoran } from "@/components/clientComponents/coran/pageCoran";
import { SearchAyat } from "@/components/clientComponents/coran/searchAyat";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/prisma/client";
import { Noto_Sans_Arabic } from "next/font/google";
import Link from "next/link";

const note = Noto_Sans_Arabic({ weight: "400", subsets: ["arabic"] });

export default async function Coran() {
  const sourates = await prisma.sourate.findMany({
    orderBy: { number: "asc" },
  });

  return (
    <div>
      <PageCoran sourates={sourates} font={note} />
    </div>
  );
}
