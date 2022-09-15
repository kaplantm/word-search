import { memo, useMemo } from "react";
import { useWordSearchContext } from "../../contexts/WordSearchContext";
import { CellData } from "../../lib/sharedTypes.ts/cellData.type";
import styles from "./styles.module.scss";

type CellRenderProps = {
  cell: CellData;
  selectCell: (cell: CellData) => void;
};

const CellRender = memo(({ cell, selectCell }: CellRenderProps) => {
  const { character, selected, active } = cell;
  const onClick = () => {
    selectCell(cell);
  };
  return (
    <button
      className={styles.cell}
      data-active={active}
      data-selected={selected}
      aria-pressed={selected}
      onClick={onClick}
    >
      {character}
    </button>
  );
});

type CellProps = { x: number; y: number };

// TODO: now use context instead of props
function Cell({ x, y }: CellProps) {
  const { board, selectCell } = useWordSearchContext();
  const cell = board[x][y];

  return <CellRender cell={cell} selectCell={selectCell} />;
}

export default memo(Cell);
