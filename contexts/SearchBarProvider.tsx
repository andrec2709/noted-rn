import { ISearcher } from "@/db/Searcher";
import { useSearch } from "@/db/temp";
import { createContext, useContext, useState } from "react";

type SearchBarContextType = {
    isSearchBarOpen: boolean;
    setIsSearchBarOpen: (newState: boolean) => void;
    searcher: ISearcher;    
}

const SearchBarContext = createContext<SearchBarContextType | undefined>(undefined);

export const useSearchBar = () => {
    const ctx = useContext(SearchBarContext);
    if (!ctx) {
        throw new Error('useSearchBar must be inside a SearchBarProvider');
    }

    return ctx;
};

export const SearchBarProvider = ({ children }: {children: React.ReactNode}) => {
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
    const searcher = useSearch();

    return (
        <SearchBarContext.Provider value={{ isSearchBarOpen, setIsSearchBarOpen, searcher }}>
            {children}
        </SearchBarContext.Provider>
    );
};