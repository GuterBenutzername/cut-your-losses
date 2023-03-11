import { useRef, useEffect } from 'react';
import { type Assignment } from "../../../../backend";
import AssignmentCard from "../molecules/assignmentCard/assignment";
import "./assignments.css";

export default function Assignments({
  assignments,
  onModifyAssignment,
  onDeleteAssignment,
  onAddAssignment,
}: {
  assignments: Assignment[];
  onModifyAssignment: (
    event: { target: { value: string } },
    index: number,
    property: "name" | "grade" | "weight" | "theoretical"
  ) => void;
  onDeleteAssignment: (index: number) => void;
  onAddAssignment: () => void;
}) {
  const firstRef = useRef<{focusFirst: () => void}>(null);
  useEffect(() => {
    if (assignments.length > 0 && assignments[0].name === "") {
      firstRef.current?.focusFirst()
    }
  }, [assignments])
  return (
    <div className="assignments">
      {assignments.map((assignment, index) => (
        <AssignmentCard
          key={assignment.id}
          ref={index === 0 ? firstRef : undefined}
          assignment={assignment}
          index={index}
          onDeleteAssignment={onDeleteAssignment}
          onModifyAssignment={onModifyAssignment}
        />
      ))}
      <button
        type="button"
        className="add-assignment"
        onClick={() => {
          onAddAssignment();
        }}
      >
        +
      </button>
    </div>
  );
}
