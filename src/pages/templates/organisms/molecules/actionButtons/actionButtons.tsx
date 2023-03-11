import "./actionbuttons.css";

export default function ActionButtons({
  onDeleteCourse,
  onUndo,
}: {
  onDeleteCourse: () => void;
  onUndo: () => void;
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
