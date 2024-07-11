"use client";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export const AuthentBtn = (props: { onMobile: boolean }) => {
  const session = useSession();
  if (!props.onMobile) {
    if (!session.data) {
      return (
        <Button onClick={() => signIn()} variant={"outline"} size={"sm"}>
          {<LogIn size={12} className="mr-2" />}Connexion
        </Button>
      );
    }
    return (
      <Button onClick={() => signOut()} variant={"destructive"}>
        {<LogOut size={12} className="mr-2" />}Déconnexion
      </Button>
    );
  } else {
    if (!session.data) {
      return <LogIn onClick={() => signIn()} />;
    }
    return <LogOut onClick={() => signOut()} />;
  }
};
  
