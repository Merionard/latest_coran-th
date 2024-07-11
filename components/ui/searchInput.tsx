import { Search } from "lucide-react";
import { Input } from "./input";

type Props = {
  search: string;
  onSearch: (search: string) => void;
  placeHolder?: string;
};

export const SearchInput = ({ search, onSearch, placeHolder }: Props) => {
  return (
    <div className="relative w-56">
      <Input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeHolder ? placeHolder : "Rechercher thème"}
      />
      <Search className="h-6 w-6 absolute top-1/2  -translate-y-1/2 right-3 text-gray-400" />
    </div>
  );
};
