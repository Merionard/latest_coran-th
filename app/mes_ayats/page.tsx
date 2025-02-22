import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/prisma/client";
import { MessageCircleWarning } from "lucide-react";
import FavorisPage from "@/components/clientComponents/favoris/favorisPage";

export default async function MyAyats() {
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
  }

  const data = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      myAyats: { include: { sourate: true, theme: true } },
      ayatsLearned: { include: { sourate: true, theme: true } },
    },
  });

  return (
    <div className="md:container">
      <h2 className="text-center text-4xl md:text-6xl mb-5 md:mb-16 text-primary">
        Mes Ayats
      </h2>
      <FavorisPage
        favorisAyat={data ? data.myAyats : []}
        learnedAyat={data ? data.ayatsLearned : []}
      />
    </div>
  );
}
