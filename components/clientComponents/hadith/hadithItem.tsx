"use client";

import {
  markHadithAsLearned,
  removeHadithOnTheme,
  toogleFavoriteHadith,
} from "@/components/serverActions/hadithAction";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { hadith } from "@prisma/client";
import { BookCheck, Heart, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import drapeauFr from "../../../public/dr-fr.png";
import drapeauEn from "../../../public/dr-ru.png";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import CopyButton from "@/components/ui/copyButton";
import ShareButtons from "@/components/ui/shareButtons";

type props = {
  hadith: hadith;
  isFavorite: boolean;
  isLearned: boolean;
  metadata?: {
    bookId: number;
    bookName: string;
    chapterName: string;
  };
  themeId?: number;
};

export const HadithItem = ({
  hadith,
  metadata,
  isFavorite,
  isLearned,
  themeId,
}: props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [language, setLanguage] = useState("FR");

  const favoriteAction = async () => {
    try {
      await toogleFavoriteHadith(hadith.id, isFavorite);
      toast.success("Favoris mis à jour avec succès!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const learnAction = async () => {
    try {
      await markHadithAsLearned(hadith.id);
      toast.success("Marqué comme appris avec succès!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toogleLanguage = () => {
    if (language === "FR") {
      setLanguage("EN");
    } else {
      setLanguage("FR");
    }
  };

  const removeFromTheme = async () => {
    if (themeId)
      try {
        await removeHadithOnTheme(hadith.id, themeId);
        toast.success("Hadith supprimé du thème avec succès");
        router.refresh();
      } catch (error: any) {
        toast.error(error.message);
      }
  };

  return (
    <div className="p-5 border bg-card">
      <div className="flex justify-between items-center mb-3">
        <Link
          className="text-xl font-bold text-primary"
          href={`/hadith/${metadata?.bookId}`}
        >
          {metadata?.bookName} {metadata?.chapterName}
        </Link>

        <div className="flex gap-2">
          <button
            className="hidden rounded-full  md:mr-5 md:block"
            onClick={toogleLanguage}
          >
            {language === "FR" ? (
              <Image src={drapeauFr} alt="drapeaufr" className="w-6 h-6" />
            ) : (
              <Image src={drapeauEn} alt="drapeaufr" className="w-6 h-6" />
            )}
          </button>
          {session && (
            <>
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
              <button
                className={cn(
                  "flex justify-center items-center rounded-full border p-2"
                )}
                onClick={learnAction}
              >
                <BookCheck
                  className={cn("h-4 w-4", {
                    "text-green-500 ": isLearned,
                  })}
                />
              </button>
              <CopyButton
                content={
                  metadata?.bookName +
                  " " +
                  metadata?.chapterName +
                  "\n" +
                  hadith.hadithReference +
                  " " +
                  hadith.inBookReference +
                  "\n" +
                  hadith.content
                }
              />
              <ShareButtons
                content={
                  metadata?.bookName +
                  " " +
                  metadata?.chapterName +
                  "\n" +
                  hadith.hadithReference +
                  " " +
                  hadith.inBookReference +
                  "\n" +
                  hadith.content
                }
              />
            </>
          )}
          {session && themeId && (
            <button
              className={cn(
                "flex justify-center items-center rounded-full border p-2"
              )}
              onClick={removeFromTheme}
            >
              <Trash className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <p className="font-bold">Hadith numéro: {hadith.hadithReference}</p>
      <p className="font-bold">
        reference in book: {hadith.inBookReference?.replace(/:/g, "")}
      </p>
      <div className="md:hidden flex justify-end">
        <button className=" rounded-full  " onClick={toogleLanguage}>
          {language === "FR" ? (
            <Image src={drapeauFr} alt="drapeaufr" className="w-6 h-6" />
          ) : (
            <Image src={drapeauEn} alt="drapeaufr" className="w-6 h-6" />
          )}
        </button>
      </div>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className=" text-3xl">
            {hadith.content}
          </AccordionTrigger>
          <AccordionContent className="text-lg">
            {language === "FR" ? hadith.traductionFr : hadith.traductionEn}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
