import { AyatCard } from "@/components/clientComponents/ayat/ayatCard";
import { searchAyats } from "@/components/serverActions/coranAction";
import ThemeSearchAyat from "@/components/serverComponents/ThemeSearchAyat";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";
import { ayat } from "@prisma/client";

export default async function ToLearn() {
  const ayats = await getAyatsToLearn();
  const session = await getAuthSession();
  const user = session ? await getUserData(session.user.id) : null;

  return (
    <div className="space-y-3 md:container">
      {user?.role === "ADMIN" && <ThemeSearchAyat addToLearn />}
      {ayats.map((a) => (
        <AyatCard
          key={a.id}
          ayat={a}
          titreSourate={a.sourate.titre}
          isFavorite={isAyatFavorite(a, user)}
          isLearned={isAyatLearned(a, user)}
        />
      ))}
    </div>
  );
}

async function getAyatsToLearn() {
  return await prisma.ayat.findMany({
    where: { toLearn: true },
    include: { sourate: true },
    orderBy: [{ sourate_number: "asc" }, { number: "asc" }],
  });
}

async function getUserData(userId: string) {
  return await prisma.user.findFirst({
    where: { id: userId },
    include: { myAyats: true, ayatsLearned: true },
  });
}

function isAyatFavorite(ayat: ayat, user: any) {
  return user ? user.myAyats.some((a: ayat) => a.id === ayat.id) : false;
}

function isAyatLearned(ayat: ayat, user: any) {
  return user ? user.ayatsLearned.some((a: ayat) => a.id === ayat.id) : false;
}
