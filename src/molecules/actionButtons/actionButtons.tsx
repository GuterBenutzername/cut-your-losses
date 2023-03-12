import "./actionbuttons.css";

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
    <span className="action-buttons">
      <button
        type="button"
        className="undo-button"
        onClick={() => {
          onUndo();
        }}
      >
        <span className="material-symbols-outlined">undo</span>
      </button>
      <button
        type="button"
        className="redo-button"
        onClick={() => {
          onRedo();
        }}
      >
        <span className="material-symbols-outlined">redo</span>
      </button>
      <button
        type="button"
        className="delete-button"
        onClick={() => {
          onDeleteCourse();
        }}
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </span>
  );
}
