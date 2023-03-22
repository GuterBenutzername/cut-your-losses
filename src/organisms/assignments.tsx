import { css } from "@emotion/css";

import type { Assignment } from "../backend";
import AssignmentCard from "../molecules/assignment";

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
    property: "future" | "grade" | "name" | "weight"
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
          assignment={assignment}
          autoFocus={index === 0 && assignment.name === ""}
          index={index}
          key={assignment.id}
          onDeleteAssignment={onDeleteAssignment}
          onModifyAssignment={onModifyAssignment}
        />
      ))}
      <button
        className={addAssignmentButtonStyle}
        onClick={() => {
          onAddAssignment();
        }}
        type="button"
      >
        +
      </button>
    </div>
  );
}
