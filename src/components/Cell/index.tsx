import { memo } from "react";
import { useWordSearchContext } from "../../contexts/WordSearchContext";
import { CellData } from "../../lib/sharedTypes.ts/cellData.type";
import styles from "./styles.module.scss";

type CellProps = CellData & {
  onActivate?: (x: number, y: number, active: boolean) => void;
};
// TODO: now use context instead of props
function Cell({ x, y, character, selected, active, onActivate }: CellProps) {
  const data = useWordSearchContext();
  const onClick = () => {
    onActivate?.(x, y, !active);
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
}

export default memo(Cell);
