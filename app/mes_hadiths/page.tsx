import { FavorisHadithPage } from "@/components/clientComponents/favoris/favorisHadithPage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";
import { MessageCircleWarning } from "lucide-react";

export default async function MesHadiths() {
  const session = await getAuthSession();
  if (!session) {
    return (
      <Alert>
        <MessageCircleWarning className="h-4 w-4" />

        <AlertTitle>Oups</AlertTitle>
        <AlertDescription>
          Vous devez vous connecter pour accéder à vos Ayats!
        </AlertDescription>
      </Alert>
    );
  } else {
    const data = await getUserData(session.user.id);

    return (
      <div>
        <h2 className="text-center text-4xl md:text-6xl mb-5 md:mb-16">
          Mes Hadiths
        </h2>
        <FavorisHadithPage hadithsUser={data} />
      </div>
    );
  }
}

async function getUserData(userId: string) {
  const data = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      myHadiths: {
        include: { hadithChapter: { include: { hadithBook: true } } },
      },
      hadithsLearned: {
        include: { hadithChapter: { include: { hadithBook: true } } },
      },
    },
  });

  return data;
}

export type hadithUser = ReturnType<typeof getUserData> extends Promise<infer R>
  ? R
  : never;
