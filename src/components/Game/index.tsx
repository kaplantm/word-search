import { useState } from "react";
import WordSearchProvider from "../../contexts/WordSearchContext";
import newPuzzle from "../../lib/generateWordSearch";
import fillPuzzle from "../../lib/generateWordSearch";
import { CellData } from "../../lib/sharedTypes.ts/cellData.type";
import Board from "../Board";

const mockWordBoard: CellData[][] = [
  ["A", "B", "C", "D", "E", "F", "G"],
  ["A", "B", "C", "D", "E", "F", "G"],
  ["A", "A", "C", "D", "E", "F", "G"],
  ["A", "T", "C", "D", "E", "F", "G"],
  ["A", "M", "C", "D", "E", "F", "G"],
  ["A", "A", "C", "D", "E", "F", "G"],
  ["A", "N", "C", "D", "E", "F", "G"],
].map((row, x) =>
  row.map((character, y) => ({
    character,
    x,
    y,
    selected: false,
    active: false,
  }))
);

const words = ["batman", "robin", "catwoman", "joker"];
function Game() {
  const [board, setBoard] = useState(
    newPuzzle(words, { height: 10, width: 10 }).map((row, x) =>
      row.map((character, y) => ({
        character: character.toUpperCase(),
        x,
        y,
        selected: false,
        active: false,
      }))
    )
  );
  console.log({ board });
  // FUTURE: start/stop/reset/timer
  return (
    <WordSearchProvider words={words} board={board}>
      <Board board={board} />
    </WordSearchProvider>
  );
}

export default Game;
