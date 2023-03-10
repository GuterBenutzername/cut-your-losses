import { type Assignment } from "../../../../../backend";
import "./assignment.css";

export default function AssignmentCard({
  assignment,
  index,
  onModifyAssignment,
  onDeleteAssignment,
}: {
  assignment: Assignment;
  index: number;
  onModifyAssignment: (
    event: { target: { value: string } },
    index: number,
    property: "name" | "grade" | "weight" | "theoretical"
  ) => void;
  onDeleteAssignment: (index: number) => void;
}) {
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
      <input
        type="checkbox"
        aria-label="theoretical"
        checked={assignment.theoretical}
        onChange={(event) => {
          onModifyAssignment(event, index, "theoretical");
        }}
      />
    </div>
  );
}
