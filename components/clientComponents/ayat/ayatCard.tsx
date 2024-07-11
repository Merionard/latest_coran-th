"use client";

import {
  markAsLearned,
  toogleFavoriteAyat,
} from "@/components/serverActions/favorisAction";
import { removeAyatOnTheme } from "@/components/serverActions/themeCoranAction";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ayat, theme } from "@prisma/client";
import { BookCheck, Check, Heart, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const AyatCard = (props: {
  ayat: ayat;
  titreSourate: string;
  themeId?: number;
  isFavorite: boolean;
  themes?: theme[];
  isLearned: boolean;
}) => {
  const router = useRouter();
  const session = useSession();
  const removeAyat = async () => {
    if (props.themeId) {
      try {
        await removeAyatOnTheme(props.themeId, props.ayat.id);
        toast.success("Suppression effectuée avec succès!");
        router.refresh();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };

  const favoriteAction = async () => {
    try {
      await toogleFavoriteAyat(props.ayat.id, props.isFavorite);
      toast.success("Favoris mis à jour avec succès!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const learnAction = async () => {
    try {
      await markAsLearned(props.ayat.id);
      toast.success("Marqué comme apprise avec succès!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="p-5 border bg-card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xl font-bold">
          Sourate {props.ayat.sourate_number} verset {props.ayat.number}{" "}
          <span>{props.titreSourate}</span>
        </h3>
        <div className="flex gap-2">
          {session && session.data?.user.role === "ADMIN" && props.themeId && (
            <button
              className="flex justify-center items-center rounded-full border p-2 hover:bg-red-500"
              onClick={removeAyat}
            >
              <Trash className="h-4 w-4" />
            </button>
          )}
          {session && session.data && (
            <button
              className={cn(
                "flex justify-center items-center rounded-full border p-2"
              )}
              onClick={favoriteAction}
            >
              <Heart
                className={cn("h-4 w-4", {
                  "text-red-600 fill-current": props.isFavorite,
                })}
              />
            </button>
          )}
          {session && session.data && props.isFavorite && (
            <button
              className={cn(
                "flex justify-center items-center rounded-full border p-2"
              )}
              onClick={learnAction}
            >
              <BookCheck
                className={cn("h-4 w-4", {
                  "text-green-500 ": props.isLearned,
                })}
              />
            </button>
          )}
        </div>
      </div>
      {props.themes && (
        <div>
          <h3 className="underline text-xl">Liste des thèmes associés</h3>
          {props.themes?.map((t) => (
            <li key={t.id}>
              <Link href={`/themes_coran/${t.id}`}>{t.name}</Link>
            </li>
          ))}
        </div>
      )}
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className=" text-3xl">
            {props.ayat.content}
          </AccordionTrigger>
          <AccordionContent className="text-lg">
            {props.ayat.traduction}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
