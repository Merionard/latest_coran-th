import { AyatCoran } from "@/components/clientComponents/ayat/ayatCoran";
import { CardContent } from "@/components/ui/card";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";
import { ayat } from "@prisma/client";
import { Noto_Sans_Arabic } from "next/font/google";

const note = Noto_Sans_Arabic({ weight: "400", subsets: ["arabic"] });

export default async function SouratePage({
  params,
}: {
  params: { sourateNumber: string };
}) {
  const ayats = await prisma.ayat.findMany({
    where: {
      sourate_number: Number(params.sourateNumber),
      AND: { number: { gt: 0 } },
    },
    include: { sourate: true },
    orderBy: { number: "asc" },
  });

  const session = await getAuthSession();
  const user = await prisma.user.findFirst({
    where: { id: session?.user.id },
    include: { myAyats: true, myThemes: true },
  });
  const isAyatFavorite = (ayat: ayat) => {
    if (!session) return false;
    if (user) return user.myAyats.some((a) => a.id === ayat.id);
    return false;
  };

  return (
    <div>
      <h2 className={"text-4xl text-center"}>{ayats[0].sourate.titre}</h2>
      <h3 className={"text-4xl text-center mt-5"}>
        بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
      </h3>
      <div className="pt-5">
        <CardContent className="space-y-10">
          {ayats
            .filter(
              (a) => a.content !== "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ"
            )
            .map((a) => (
              <AyatCoran ayat={a} isFavorite={isAyatFavorite(a)} key={a.id} />
            ))}
        </CardContent>
      </div>
    </div>
  );
}
