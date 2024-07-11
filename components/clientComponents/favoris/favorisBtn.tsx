"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const FavorisBtn = (props: {
  isFavorite: boolean;
  handleClick: (...args: any[]) => any;
  id: number;
}) => {
  const router = useRouter();
  const handleClick = async () => {
    try {
      await props.handleClick(props.id, props.isFavorite);
      router.refresh();
      toast.success("Favoris maj avec succès!");
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <Button
      onClick={handleClick}
      variant={"ghost"}
      size={"icon"}
      className="rounded-full"
    >
      <Heart
        className={cn({ "text-red-600 fill-current": props.isFavorite })}
      />
    </Button>
  );
};
