import React, {
  useState,
  useContext,
  useMemo,
  createContext,
  useCallback,
  useEffect,
  PropsWithChildren,
} from "react";
import { CellData } from "../lib/sharedTypes.ts/cellData.type";

// Reference: https://medium.com/trabe/how-we-handle-react-context-e43d303a27a2

type WordSearchContextState = {
  selectedCells: CellData[];
  selectCell: (cell: CellData) => void;
  wordsFound: number;
  foundCells: CellData[];
};

const defaultContextState: WordSearchContextState = {
  selectedCells: [] as CellData[],
  selectCell: (cell: CellData) => {},
  wordsFound: 0,
  foundCells: [] as CellData[],
};
const WordSearchContext = createContext(defaultContextState);

const WordSearchProvider = ({ words, children }: PropsWithChildren<{ words: string[] }>) => {
  const [selectedCells, setSelectedCells] = useState<CellData[]>([]);
  const [wordsFound, setWordsFound] = useState<number>(0);
  const [foundCells, setFoundCells] = useState<CellData[]>([]);

  useEffect(() => {
    const letters = selectedCells.map((el) => el.character).join("");
    if (words.includes(letters)) {
      setFoundCells((prev) => {
        const newCells = selectedCells.filter(
          (el) => !prev.find((old) => old.x === el.x && old.y === el.y)
        );
        if (newCells.length) {
          return [...prev, ...newCells];
        }
        return prev;
      });
      setSelectedCells([]);
      setWordsFound((prev) => prev + 1);
    }
  }, [selectedCells, words]);

  const selectCell = useCallback(
    (cell: CellData) => {
      if (!selectedCells.length) {
        setSelectedCells((prev) => [...prev, cell]);
      }
      const lastCell = selectedCells[selectedCells.length - 1];
      const tr = cell.x === lastCell.x + 1 && cell.y === lastCell.y - 1;
      const tm = cell.x === lastCell.x && cell.y === lastCell.y - 1;
      const tl = cell.x === lastCell.x - 1 && cell.y === lastCell.y - 1;
      const ml = cell.x === lastCell.x - 1 && cell.y === lastCell.y;
      const mr = cell.x === lastCell.x + 1 && cell.y === lastCell.y;
      const bl = cell.x === lastCell.x - 1 && cell.y === lastCell.y + 1;
      const bm = cell.x === lastCell.x && cell.y === lastCell.y + 1;
      const br = cell.x === lastCell.x + 1 && cell.y === lastCell.y + 1;
      if (tr || tm || tl || ml || mr || bl || bm || br) {
        setSelectedCells((prev) => [...prev, cell]);
      } else {
        setSelectedCells([cell]);
      }
    },
    [selectedCells]
  );

  const value: WordSearchContextState = useMemo(
    () => ({
      selectedCells,
      selectCell,
      wordsFound,
      foundCells,
    }),
    [selectedCells, selectCell, wordsFound, foundCells]
  );

  return <WordSearchContext.Provider value={value}>{children}</WordSearchContext.Provider>;
};

export default WordSearchProvider;

export const useWordSearchContext = () => useContext(WordSearchContext);
