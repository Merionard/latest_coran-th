"use client";
import { deleteTheme } from "@/components/serverActions/themeCoranAction";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

export const DeleteThemeBtn = (props: { themeId: number }) => {
  const router = useRouter();
  const handleDeleteTheme = async () => {
    try {
      await deleteTheme(props.themeId);
      toast.success("Suppression effectuée avec succès!");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"icon"} className="rounded-full">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Confirmer la suppression du thème?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Le thème sera supprimé définitivement. Ses éventuels enfants ne
            seront pas effacés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteTheme}>
            Confirmer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
