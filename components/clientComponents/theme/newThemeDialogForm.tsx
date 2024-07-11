"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { theme } from "@prisma/client";
import { Link, Pencil, Plus } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  themeName: z
    .string()
    .min(3, "Minimum 3 caractères")
    .max(70, "Maximum 70 caractères"),
  themeParent: z.number().optional(),
  description: z.string().optional(),
});

type SubmitFunction<T extends any[], R> = (...args: T) => Promise<R>;

type Props = {
  onSubmitForm: SubmitFunction<any[], theme | null>;
  parentId?: number;
  theme?: theme;
  parentThemes?: theme[];
};

export function ThemeDialogForm({
  onSubmitForm,
  parentId,
  theme,
  parentThemes,
}: Props) {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      themeName: theme ? theme.name : "",
      description: theme && theme.description !== null ? theme.description : "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      //si theme existe on le modifie si non création d'un nouveau theme
      const result =
        theme === undefined
          ? await onSubmitForm(values.themeName, parentId, values.description)
          : await onSubmitForm(
              values.themeName,
              theme.id,
              values.themeParent,
              values.description
            );
      if (result === null) {
        form.setError("themeName", {
          type: "custom",
          message: "Ce thème existe déjà!",
        });
        return;
      }

      const msg = theme
        ? "Thème maj avec succès"
        : result.name + " créé avec succès!";
      toast.success(msg);
      setOpenModal(false);
      router.refresh();
    } catch (error) {
      setOpenModal(false);
      //@ts-ignore
      toast.error(error.message);
    }
  }

  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <Button
        variant={theme ? "secondary" : "default"}
        size={"icon"}
        className="rounded-full"
        onClick={() => setOpenModal((prev) => !prev)}
      >
        {theme ? <Pencil /> : <Plus />}
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau thème coranique</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="themeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau Thème</FormLabel>
                  <FormControl>
                    <Input placeholder="nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description du thème" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {theme && (
              <FormField
                control={form.control}
                name="themeParent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rattacher à un thème</FormLabel>
                    <Select onValueChange={(v) => field.onChange(Number(v))}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un thème" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {parentThemes?.map((p) => (
                          <SelectItem key={p.id} value={p.id.toString()}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end">
              <Button type="submit">Valider</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
