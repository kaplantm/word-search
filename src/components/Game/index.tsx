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

function Game() {
  // FUTURE: start/stop/reset/timer
  return <Board board={mockWordBoard} />;
}

export default Game;
