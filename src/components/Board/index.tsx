import { memo } from "react";
import { CellData } from "../../lib/sharedTypes.ts/cellData.type";
import Cell from "../Cell";
import styles from "./styles.module.scss";

type BoardProps = {
  board: CellData[][];
  onCellActivate?: (x: number, y: number, active: boolean) => void; // TODO: now rename?
};

function Board({ board }: BoardProps) {
  return (
    <div className={styles.board}>
      {board.map((row, i) => (
        <div key={i}>
          {row.map((cell, j) => (
            <Cell key={j} x={cell.x} y={cell.y} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default memo(Board);
