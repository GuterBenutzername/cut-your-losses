import { type Assignment } from "../backend";
import { css, cx } from "@emotion/css";

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
    property: "name" | "grade" | "weight" | "future"
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
      <span className={assignmentWrapperStyle}>
        <input
          autoFocus={autoFocus}
          id={`assignment-name-${index}`}
          aria-label="name"
          value={assignment.name}
          className={assignmentInputStyle}
          onChange={(event) => {
            onModifyAssignment(event, index, "name");
          }}
        />
        {index === 0 && (
          <label htmlFor="assignment-name-0" className={labelStyle}>
            Name
          </label>
        )}
      </span>
      <span className={assignmentWrapperStyle}>
        <input
          type="number"
          aria-label="grade"
          step="1"
          id={`assignment-grade-${index}`}
          className={assignmentInputStyle}
          value={assignment.grade.toString()}
          onChange={(event) => {
            onModifyAssignment(event, index, "grade");
          }}
        />
        {index === 0 && (
          <label htmlFor="assignment-grade-0" className={labelStyle}>
            Grade
          </label>
        )}
      </span>
      <span className={assignmentWrapperStyle}>
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
          id={`assignment-weight-${index}`}
          value={assignment.weight.toString()}
          onChange={(event) => {
            onModifyAssignment(event, index, "weight");
          }}
        />
        {index === 0 && (
          <label htmlFor="assignment-weight-0" className={labelStyle}>
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
          type="checkbox"
          className={cx(
            assignmentInputStyle,
            css`
              accent-color: red;
              display: inline-block;
              width: 100%;
            `
          )}
          aria-label="future"
          id={`assignment-future-${index}`}
          checked={assignment.future}
          onChange={(event) => {
            onModifyAssignment(event, index, "future");
          }}
        />
        {index === 0 && (
          <label
            htmlFor="assignment-future-0"
            className={cx(
              labelStyle,
              css`
                top: -1.4ex;
              `
            )}
          >
            Future?
          </label>
        )}
      </span>
    </div>
  );
}

export default AssignmentCard;
