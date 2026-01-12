import { Payload } from "@/types/notes";
import { createContext, useContext, useEffect, useState } from "react";

type SelectionContextType = {
    isSelecting: boolean;
    setIsSelecting: React.Dispatch<React.SetStateAction<boolean>>;
    selectionBuffer: Payload[];
    setSelectionBuffer: React.Dispatch<React.SetStateAction<Payload[]>>;
};

const SelectionContext = createContext<SelectionContextType | null>(null);

export const useSelection = () => {
    const ctx = useContext(SelectionContext);

    if (!ctx) {
        throw new Error('useSelection must be inside a SelectionProvider');
    }

    return ctx;
};

export const SelectionProvider = ({ children }: { children: React.ReactNode }) => {
    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionBuffer, setSelectionBuffer] = useState<Payload[]>([]);

    return (
        <SelectionContext.Provider value={{
            isSelecting, setIsSelecting, selectionBuffer, setSelectionBuffer,
        }}>
            {children}
        </SelectionContext.Provider>
    );
};