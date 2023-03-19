import { type Assignment } from "../backend";
import { css, cx } from "@emotion/css";

const assignmentInputStyle = css`
  width: 50%;
  border-top: 0;
  border-bottom: 0;
`;

function AssignmentCard({
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
}) {
  return (
    <div
      className={css`
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        width: 60vw;
        height: 2rem;
        padding: 0;
        border: solid 2px #000;
        border-radius: 2px;
        @media only screen and (max-width: 600px) {
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-around;
          align-items: center;
          width: 90vw;
          height: 2rem;
          padding: 0;
          border: solid 2px #000;
          border-radius: 2px;
        }
      `}
    >
      <button
        type="button"
        aria-label="delete"
        className={css`
          border-top: 0;
          border-bottom: 0;
        `}
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
        className={assignmentInputStyle}
        onChange={(event) => {
          onModifyAssignment(event, index, "name");
        }}
      />
      <input
        type="number"
        aria-label="grade"
        step="1"
        className={assignmentInputStyle}
        value={assignment.grade.toString()}
        onChange={(event) => {
          onModifyAssignment(event, index, "grade");
        }}
      />
      <input
        type="number"
        step="0.01"
        className={cx(
          assignmentInputStyle,
          css`
            border-right: 2px solid #000;
          `
        )}
        aria-label="weight"
        value={assignment.weight.toString()}
        onChange={(event) => {
          onModifyAssignment(event, index, "weight");
        }}
      />
      <span
        className={css`
          width: 50%;
          text-align: center;
        `}
      >
        <input
          type="checkbox"
          className={cx(
            assignmentInputStyle,
            css`
              accent-color: red;
              display: inline-block;
              width: 100%;
            `
          )}
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

export default AssignmentCard;
