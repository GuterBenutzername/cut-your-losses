import { css, cx } from "@emotion/css";

import type { Assignment } from "../backend";

const assignmentInputStyle = css`
  width: 100%;
  border-top: 0;
  border-bottom: 0;
`;

const assignmentWrapperStyle = css`
  position: relative;
  flex: 1 0 0px;
`;

const labelStyle = css`
  position: absolute;
  top: -0.8ex;
  z-index: 1;
  left: 0.6em;
  background-color: #fff;
  height: 10px;
  line-height: 10px;
  vertical-align: middle;
  font-size: smaller;
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
    property: "future" | "grade" | "name" | "weight"
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
        aria-label="delete"
        className={css`
          border-top: 0;
          border-bottom: 0;
        `}
        onClick={() => {
          onDeleteAssignment(index);
        }}
        type="button"
      >
        X
      </button>
      <span className={assignmentWrapperStyle}>
        <input
          aria-label="name"
          autoFocus={autoFocus}
          className={assignmentInputStyle}
          id={`assignment-name-${index}`}
          onChange={(event) => {
            onModifyAssignment(event, index, "name");
          }}
          value={assignment.name}
        />
        {index === 0 && (
          <label className={labelStyle} htmlFor="assignment-name-0">
            Name
          </label>
        )}
      </span>
      <span className={assignmentWrapperStyle}>
        <input
          aria-label="grade"
          className={assignmentInputStyle}
          id={`assignment-grade-${index}`}
          onChange={(event) => {
            onModifyAssignment(event, index, "grade");
          }}
          step="1"
          type="number"
          value={assignment.grade.toString()}
        />
        {index === 0 && (
          <label className={labelStyle} htmlFor="assignment-grade-0">
            Grade
          </label>
        )}
      </span>
      <span className={assignmentWrapperStyle}>
        <input
          aria-label="weight"
          className={cx(
            assignmentInputStyle,
            css`
              border-right: 2px solid #000;
            `
          )}
          id={`assignment-weight-${index}`}
          onChange={(event) => {
            onModifyAssignment(event, index, "weight");
          }}
          step="0.01"
          type="number"
          value={assignment.weight.toString()}
        />
        {index === 0 && (
          <label className={labelStyle} htmlFor="assignment-weight-0">
            Weight
          </label>
        )}
      </span>
      <span
        className={cx(
          assignmentWrapperStyle,
          css`
            width: 50%;
            text-align: center;
          `
        )}
      >
        <input
          aria-label="future"
          checked={assignment.future}
          className={cx(
            assignmentInputStyle,
            css`
              accent-color: red;
              display: inline-block;
              width: 100%;
            `
          )}
          id={`assignment-future-${index}`}
          onChange={(event) => {
            onModifyAssignment(event, index, "future");
          }}
          type="checkbox"
        />
        {index === 0 && (
          <label
            className={cx(
              labelStyle,
              css`
                top: -1.4ex;
              `
            )}
            htmlFor="assignment-future-0"
          >
            Future?
          </label>
        )}
      </span>
    </div>
  );
}

export default AssignmentCard;
