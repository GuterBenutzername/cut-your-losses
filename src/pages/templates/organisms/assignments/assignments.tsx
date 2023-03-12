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
  return (
    <div className="assignments">
      {assignments.map((assignment, index) => (
        <AssignmentCard
          key={assignment.id}
          autoFocus={index === 0 && assignment.name === ""}
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
