"use client";
import {
  addHadithOnTheme,
  fetchHadithByBookId,
} from "@/components/serverActions/hadithAction";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectLabel } from "@radix-ui/react-select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type props = {
  books: Array<{ id: number; title: string }>;
  themeId: number;
};
type lightHadith = {
  id: number;
  inBookReference: string | null;
  hadithReference: string | null;
};

export const SearchHadith = ({ books, themeId }: props) => {
  const [bookIdSelected, setBookIdSelected] = useState<null | number>(null);
  const [hadithSelected, setHadithSelected] = useState<null | number>(null);
  const [pageSelected, setPageSelected] = useState(1);
  const [hadithByBook, setHadithByBook] = useState<{
    [key: number]: lightHadith[];
  }>({});
  const [totalPage, setTotalPage] = useState(1);
  const router = useRouter();

  const loadHadithByBookId = async (bookId: number | null, page?: number) => {
    if (!bookId) return;
    setPageSelected(page ?? 1);

    const fetchedHadiths = await fetchHadithByBookId(
      bookId,
      (page ?? 1 - 1) * 200
    );
    setHadithByBook((prevState) => ({
      ...prevState,
      [bookId]: fetchedHadiths.hadiths,
    }));
    setTotalPage(Math.ceil(fetchedHadiths.totalCount / 200));
    console.log(hadithByBook);

    setBookIdSelected(Number(bookId));
  };
  const pageTable: number[] = [];
  for (let i = 1; i < totalPage; i++) {
    pageTable.push(i);
  }

  const addHadith = async () => {
    if (!hadithSelected) return;
    try {
      const updatedHadith = await addHadithOnTheme(hadithSelected, themeId);
      if (updatedHadith) {
        toast.success("Hadith rajouté avec succès!");
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap md:flex-nowrap justify-center">
      <Select onValueChange={(val) => loadHadithByBookId(Number(val))}>
        <SelectTrigger className="text-xl">
          <SelectValue placeholder="Sélectionner livre hadith" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {books.map((b) => (
              <SelectItem
                value={b.id.toString()}
                key={b.id}
                className="text-3xl"
              >
                {b.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {bookIdSelected && hadithByBook[bookIdSelected] && (
        <Select onValueChange={(val) => setHadithSelected(Number(val))}>
          <SelectTrigger className="text-xl">
            <SelectValue placeholder="Sélectionner référence" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>page {pageSelected}</SelectLabel>
              {hadithByBook[bookIdSelected].map((h) => (
                <SelectItem value={h.id.toString()} key={h.id}>
                  {h.hadithReference && h.hadithReference.length > 0
                    ? h.hadithReference
                    : h.inBookReference?.replace(/:/g, "")}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      <Select
        onValueChange={(val) => loadHadithByBookId(bookIdSelected, Number(val))}
      >
        <SelectTrigger className="text-xl">
          <SelectValue placeholder="selectionner la page" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {pageTable.map((page) => (
              <SelectItem value={page.toString()} key={page}>
                page {page}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={addHadith}>Ajouter au theme</Button>
    </div>
  );
};
