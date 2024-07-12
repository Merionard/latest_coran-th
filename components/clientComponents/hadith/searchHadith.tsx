"use client";
import { fetchHadithByBookId } from "@/components/serverActions/hadithAction";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { hadith } from "@prisma/client";
import { SelectLabel } from "@radix-ui/react-select";
import { useState } from "react";

type props = {
  books: Array<{ id: number; title: string }>;
};
type lightHadith = {
  id: number;
  inBookReference: string | null;
  hadithReference: string | null;
};

export const SearchHadith = ({ books }: props) => {
  const [bookIdSelected, setBookIdSelected] = useState<null | number>(null);
  const [hadithSelected, setHadithSelected] = useState<null | number>(null);
  const [pageSelected, setPageSelected] = useState(1);
  const [hadithByBook, setHadithByBook] = useState<{
    [key: number]: lightHadith[];
  }>({});

  const loadHadithByBookId = async (bookId: number | null, page?: number) => {
    if (!bookId) return;
    setPageSelected(page ?? 1);

    const fetchedHadiths = await fetchHadithByBookId(
      bookId,
      (page ?? 1 - 1) * 200
    );
    setHadithByBook((prevState) => ({
      ...prevState,
      [bookId]: fetchedHadiths,
    }));
    console.log(hadithByBook);

    setBookIdSelected(Number(bookId));
  };

  return (
    <div>
      <Select onValueChange={(val) => loadHadithByBookId(Number(val))}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select book hadith" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {books.map((b) => (
              <SelectItem value={b.id.toString()} key={b.id}>
                {b.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {bookIdSelected && hadithByBook[bookIdSelected] && (
        <Select onValueChange={(val) => setHadithSelected(Number(val))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select hadith" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>page {pageSelected}</SelectLabel>
              {hadithByBook[bookIdSelected].map((h) => (
                <SelectItem value={h.id.toString()} key={h.id}>
                  {h.hadithReference ?? h.inBookReference}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
      <Button
        onClick={() => loadHadithByBookId(bookIdSelected, pageSelected + 1)}
      >
        page {pageSelected}
      </Button>
    </div>
  );
};
