import { memo } from "react";
import { CellData } from "../../lib/sharedTypes.ts/cellData.type";
import Cell from "../Cell";
import styles from "./styles.module.scss";

type BoardProps = {
  board: CellData[][];
  onCellActivate?: (x: number, y: number, active: boolean) => void; // TODO: now rename?
};

function Board({ board, onCellActivate }: BoardProps) {
  return (
    <div className={styles.board}>
      {board.map((row) => (
        <div className={styles.row}>
          {row.map((cell) => (
            <Cell onActivate={onCellActivate} {...cell} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default memo(Board);
