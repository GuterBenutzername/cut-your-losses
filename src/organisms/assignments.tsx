import { type Assignment } from "../backend";
import AssignmentCard from "../molecules/assignment";
import { css } from "@emotion/css";

const addAssignmentButtonStyle = css`
  border: 0 !important;
  background-color: #ddd;
  width: 60vw;
  &:hover {
    background-color: #ccc;
  }
  &:active {
    background-color: #bbb;
  }
  @media only screen and (max-width: 600px) {
    border: 0 !important;
    background-color: #ddd;
    width: 90vw;
    &:hover {
      background-color: #ccc;
    }
  }
`;

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
    <div
      className={css`
        display: flex;
        flex-flow: column nowrap;
        justify-content: center;
        align-items: center;
        gap: 6px;
        width: 100%;
      `}
    >
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
        className={addAssignmentButtonStyle}
        onClick={() => {
          onAddAssignment();
        }}
      >
        +
      </button>
    </div>
  );
}
