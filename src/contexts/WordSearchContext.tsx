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
  board: CellData[][];
  selectCell: (cell: CellData) => void;
  wordsFound: number;
};

const defaultContextState: WordSearchContextState = {
  board: [],
  selectCell: (cell: CellData) => {},
  wordsFound: 0,
};
const WordSearchContext = createContext(defaultContextState);

const WordSearchProvider = ({
  words,
  board,
  children,
}: PropsWithChildren<{ words: string[]; board: CellData[][] }>) => {
  const [boardState, setBoardState] = useState<CellData[][]>(board);
  const [wordsFound, setWordsFound] = useState<number>(0);
  const [activeCells, setActiveCells] = useState<CellData[]>([]);

  useEffect(() => {
    const letters = activeCells.map((el) => el.character).join("");
    if (words.includes(letters)) {
      // found full word, move active cells to selected
      setBoardState((prev) => {
        const copy = [...prev];
        activeCells.forEach((cell) => {
          copy[cell.x][cell.y].selected = true;
        });
        return copy;
      });
      setActiveCells([]);
      setWordsFound((prev) => prev + 1);
    } else {
      setBoardState((prev) =>
        prev.map((row) =>
          row.map((cell) => ({
            ...cell,
            active: !!activeCells.find((el) => el.x === cell.x && el.y === cell.y),
          }))
        )
      );
    }

    // {
    //   const copy = [...prev];
    //   activeCells.forEach((cell) => {
    //     if (!copy[cell.x][cell.y].selected) {
    //       copy[cell.x][cell.y] = { ...copy[cell.x][cell.y], active: true };
    //     }
    //   });
    //   return copy;
    // }
  }, [activeCells, words]);

  const selectCell = useCallback((cell: CellData) => {
    setActiveCells((prev) => {
      // TODO: reducer
      if (!prev.length) {
        return [...prev, cell];
      }
      // TODO: now direction matters
      const lastCell = prev[prev.length - 1];
      const tr = cell.x === lastCell.x + 1 && cell.y === lastCell.y - 1;
      const tm = cell.x === lastCell.x && cell.y === lastCell.y - 1;
      const tl = cell.x === lastCell.x - 1 && cell.y === lastCell.y - 1;
      const ml = cell.x === lastCell.x - 1 && cell.y === lastCell.y;
      const mr = cell.x === lastCell.x + 1 && cell.y === lastCell.y;
      const bl = cell.x === lastCell.x - 1 && cell.y === lastCell.y + 1;
      const bm = cell.x === lastCell.x && cell.y === lastCell.y + 1;
      const br = cell.x === lastCell.x + 1 && cell.y === lastCell.y + 1;
      console.log({ tr, tm, tl, ml, mr, bl, bm, br });
      if (tr || tm || tl || ml || mr || bl || bm || br) {
        console.log("here1");
        return [...prev, cell];
      } else {
        console.log("here2");
        return [cell];
      }
    });
  }, []);

  const value: WordSearchContextState = useMemo(
    () => ({
      board: boardState,
      selectCell,
      wordsFound,
    }),
    [selectCell, wordsFound, boardState]
  );

  return <WordSearchContext.Provider value={value}>{children}</WordSearchContext.Provider>;
};

export default WordSearchProvider;

export const useWordSearchContext = () => useContext(WordSearchContext);
