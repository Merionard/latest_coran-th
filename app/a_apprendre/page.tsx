import { AyatCard } from "@/components/clientComponents/ayat/ayatCard";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";
import { ayat } from "@prisma/client";

export default async function ToLearn() {
  const ayats = await prisma.ayat.findMany({
    where: { toLearn: true },
    include: { sourate: true },
  });

  const session = await getAuthSession();
  const user = await prisma.user.findFirst({
    where: { id: session?.user.id },
    include: { myAyats: true, myThemes: true, ayatsLearned: true },
  });
  const isAyatFavorite = (ayat: ayat) => {
    if (!session) return false;
    if (user) return user.myAyats.some((a) => a.id === ayat.id);
    return false;
  };

  const isAyatLearned = (ayat: ayat) => {
    if (!session) return false;
    if (user) return user.ayatsLearned.some((a) => a.id === ayat.id);
    return false;
  };

  return ayats.map((a) => (
    <AyatCard
      ayat={a}
      isFavorite={isAyatFavorite(a)}
      titreSourate={a.sourate.titre}
      key={a.id}
      isLearned={isAyatLearned(a)}
    />
  ));
}
