import { css, cx } from "@emotion/css";

const buttonStyle = css`
  border-radius: 4px;
  padding: 2px;
  height: min-content;
  width: min-content;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function ActionButtons({
  onDeleteCourse,
  onUndo,
  onRedo,
}: {
  onDeleteCourse: () => void;
  onUndo: () => void;
  onRedo: () => void;
}) {
  return (
    <span
      className={css`
        position: absolute;
        top: 4px;
        right: 4px;
        gap: 4px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        z-index: -1;
      `}
    >
      <button
        className={buttonStyle}
        onClick={() => {
          onUndo();
        }}
        type="button"
      >
        <span className="material-symbols-outlined">undo</span>
      </button>
      <button
        className={buttonStyle}
        onClick={() => {
          onRedo();
        }}
        type="button"
      >
        <span className="material-symbols-outlined">redo</span>
      </button>
      <button
        className={cx(
          buttonStyle,
          css`
            color: #f00;
          `
        )}
        onClick={() => {
          onDeleteCourse();
        }}
        type="button"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </span>
  );
}
