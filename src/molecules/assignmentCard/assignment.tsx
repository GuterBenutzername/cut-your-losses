import { type Ref, forwardRef, useImperativeHandle, useRef } from "react";
import { type Assignment } from "../../backend";
import "./assignment.css";

function AssignmentCard(
  {
    assignment,
    index,
    onModifyAssignment,
    onDeleteAssignment,
    autoFocus,
  }: {
    assignment: Assignment;
    index: number;
    onModifyAssignment: (
      event: { target: { value: string } },
      index: number,
      property: "name" | "grade" | "weight" | "theoretical"
    ) => void;
    onDeleteAssignment: (index: number) => void;
    autoFocus: boolean;
  },
  ref: Ref<{ focusFirst: () => void }> | undefined
) {
  const nameInputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focusFirst() {
      nameInputRef.current?.focus();
    },
  }));
  return (
    <div className="assignment">
      <button
        type="button"
        aria-label="delete"
        onClick={() => {
          onDeleteAssignment(index);
        }}
      >
        X
      </button>
      <input
        autoFocus={autoFocus}
        aria-label="name"
        value={assignment.name}
        onChange={(event) => {
          onModifyAssignment(event, index, "name");
        }}
      />
      <input
        type="number"
        aria-label="grade"
        step="1"
        value={assignment.grade.toString()}
        onChange={(event) => {
          onModifyAssignment(event, index, "grade");
        }}
      />
      <input
        type="number"
        step="0.01"
        aria-label="weight"
        value={assignment.weight.toString()}
        onChange={(event) => {
          onModifyAssignment(event, index, "weight");
        }}
      />
      <span className="theoretical-wrapper">
        <input
          type="checkbox"
          aria-label="theoretical"
          checked={assignment.theoretical}
          onChange={(event) => {
            onModifyAssignment(event, index, "theoretical");
          }}
        />
      </span>
    </div>
  );
}

export default forwardRef(AssignmentCard);
