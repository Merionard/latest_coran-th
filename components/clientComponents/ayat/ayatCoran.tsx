"use client";

import { toogleFavoriteAyat } from "@/components/serverActions/favorisAction";
import { cn } from "@/lib/utils";
import { ayat } from "@prisma/client";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

type props = {
  ayat: ayat;
  isFavorite: boolean;
};

export const AyatCoran = ({ ayat, isFavorite }: props) => {
  const router = useRouter();
  const session = useSession();
  const favoriteAction = async () => {
    try {
      await toogleFavoriteAyat(ayat.id, isFavorite);
      toast.success("Favoris mis à jour avec succès!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="border-b-2 space-y-3 bg-card">
      <div className="flex justify-between">
        <div className="rounded-full border  flex items-center justify-center w-4 h-4 p-4">
          {ayat.number}
        </div>
        {session && session.data && (
          <button
            className={cn(
              "flex justify-center items-center rounded-full border p-2"
            )}
            onClick={favoriteAction}
          >
            <Heart
              className={cn("h-4 w-4", {
                "text-red-600 fill-current": isFavorite,
              })}
            />
          </button>
        )}
      </div>
      <p className={"text-3xl text-right"}>{ayat.content}</p>
      <p>{ayat.traduction}</p>
    </div>
  );
};
