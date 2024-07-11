"use client";

import {
  AyatWithTitre,
  searchAyats,
} from "@/components/serverActions/coranAction";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/searchInput";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";
import { useRef, useState } from "react";

type props = {
  ifSomeSearch: (is: boolean) => void;
};

export const SearchAyat = ({ ifSomeSearch }: props) => {
  const [search, setSearch] = useState("");
  const [ayats, setAyats] = useState<AyatWithTitre[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 10;

  const fetchAyats = async (searchTerm: string, pageNumber: number) => {
    searchAyats(searchTerm, pageNumber, pageSize).then((result) => {
      setAyats(result.ayats);
      setTotalPages(Math.ceil(result.totalCount / pageSize));
      setPage(pageNumber);
      setIsLoading(false);
    });
    setIsLoading(true);
  };

  const onSetSearch = async () => {
    if (search === "") {
      setAyats([]);
      setPage(1);
      setTotalPages(1);
      return;
    }
    setPage(1); // Reset to first page on new search
    await fetchAyats(search, 1);
  };

  const handlePreviousPage = async () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      await fetchAyats(search, newPage);
    }
  };

  const handleNextPage = async () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      await fetchAyats(search, newPage);
    }
  };
  const highlightSearchTerm = (
    text: string,
    searchTerm: string
  ): JSX.Element => {
    if (!searchTerm.trim()) {
      return <>{text}</>;
    }
    const harakats = /[\u064B-\u065F\u0670\u06D6-\u06ED\u0671]/g;
    const textWithoutHarakat = text.replace(harakats, "");
    const searhWithoutHarakats = searchTerm.replace(harakats, "");

    const regex = new RegExp(`(${searhWithoutHarakats})`, "gi");
    const parts = textWithoutHarakat.split(regex);

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part.replace(harakats, "")) ? (
            <span key={index} className="bg-yellow-400">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const getPagninationBtn = () => {
    const buttons = [];
    if (totalPages <= 10) {
      for (let i = 1; i <= totalPages; i++) {
        buttons.push(
          <Button
            key={i}
            variant={i === page ? "default" : "secondary"}
            onClick={() => fetchAyats(search, i)}
          >
            {i}
          </Button>
        );
      }
      return buttons;
    } else {
      const indexPages = [1, 2, 3, totalPages];
      if (!indexPages.includes(page)) {
        indexPages.push(page);
        if (page > 3) {
          indexPages.splice(0, 3);
          indexPages.push(page - 1);
          indexPages.push(page - 2);
          indexPages.push(page - 3);
        }
        indexPages.sort((a, b) => a - b);
      }
      return indexPages.map((i) => (
        <Button
          key={i}
          variant={i === page ? "default" : "secondary"}
          onClick={() => fetchAyats(search, i)}
        >
          {i}
        </Button>
      ));
    }
  };

  if (ayats.length > 0) {
    ifSomeSearch(true);
  } else {
    ifSomeSearch(false);
  }

  if (isLoading) {
    return <Loader className="animate-spin mx-auto" />;
  }

  const onSearch = (value: string) => {
    if (value === "") {
      setAyats([]);
    }
    setSearch(value);
  };

  return (
    <div>
      <div className="flex justify-end gap-2">
        <SearchInput
          onSearch={onSearch}
          search={search}
          placeHolder="Rechercher dans le coran"
        />
        <Button onClick={onSetSearch}>Rechercher</Button>
      </div>

      {ayats.length > 0 && (
        <div className="flex justify-center mt-5 gap-3 items-center">
          <Button
            onClick={handlePreviousPage}
            size={"icon"}
            disabled={page === 1}
            className="disabled:bg-gray-400"
          >
            <ChevronLeft />
          </Button>
          {getPagninationBtn()}
          <Button
            onClick={handleNextPage}
            size={"icon"}
            disabled={page === totalPages}
            className="disabled:bg-gray-400"
          >
            <ChevronRight />
          </Button>
        </div>
      )}
      <div className="mt-5 space-y-5">
        {ayats.map((a) => (
          <div key={a.id} className="border-b-2 space-y-3 bg-card">
            <div className="">
              {" "}
              Sourate {a.sourate_number} verset {a.number}{" "}
              <span>{a.titre}</span>
            </div>
            <p className="text-2xl text-right">
              {highlightSearchTerm(a.content, search)}
            </p>
            <p>{a.traduction}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
