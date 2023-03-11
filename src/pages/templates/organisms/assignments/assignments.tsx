import { type Assignment } from "../../../../backend";
import AssignmentCard from "../molecules/assignmentCard/assignment";
import "./assignments.css";

export default function Assignments({
  assignments,
  onModifyAssignment,
  onDeleteAssignment,
}: {
  assignments: Assignment[];
  onModifyAssignment: (
    event: { target: { value: string } },
    index: number,
    property: "name" | "grade" | "weight" | "theoretical"
  ) => void;
  onDeleteAssignment: (index: number) => void;
}) {
  return (
    <div className="assignments">
      {assignments.map((assignment, index) => (
        <AssignmentCard
          key={assignment.id}
          assignment={assignment}
          index={index}
          onDeleteAssignment={onDeleteAssignment}
          onModifyAssignment={onModifyAssignment}
        />
      ))}
    </div>
  );
}
