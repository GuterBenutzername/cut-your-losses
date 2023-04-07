import styled, { css } from "styled-components";
import { NumericFormat } from "react-number-format";

import type Assignment from "../Assignment";

function blurTarget(event: React.SyntheticEvent<HTMLButtonElement>) {
  const target = event.target as HTMLButtonElement;
  target.disabled = true;
  target.disabled = false;
}

const inputStyle = css`
  border-radius: 3px;
  border: #000 solid 0.5px;
  width: 25vw;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 1px #000;
  }
`;

const NameGradeInput = styled.input`
  ${inputStyle}
`;

const WeightInput = styled(NumericFormat)`
  ${inputStyle}
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2px;
  height: 34px;
  width: 34px;
  border: none;
  border-radius: 100%;

  &:hover,
  &:focus {
    background-color: #f44336;
    color: white;
    cursor: pointer;
  }

  &:active {
    background-color: #d32f2f;
  }
`;

const DeleteIcon = (
  <svg height="20" viewBox="0 0 448 512" width="20">
    <path d="m170.5 40-19 40h145l-19-40H177.1Zm147-40 36.7 80H424c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8v304c-1 83-1 83-88 83H100c-68 0-68 0-68-83V128h-8c-13.3 0-24-10.7-24-24s10.7-24 24-24h69.8L132 0h142ZM80 128v304c0 17.7 14.3 32 32 32h224c17.7 0 32-14.3 32-32V128H80Zm80 64v208h-32V192h32Zm80 0v208h-32V192Zm80 0v208h-32V192Z" />
  </svg>
);

function AssignmentItem({
  assignment,
  index,
  modifyAssignment,
}: {
  assignment: Assignment;
  index: number;
  modifyAssignment: (assignment: Assignment, index: number) => void;
}) {
  return (
    <tr>
      <td>
        <DeleteButton
          onDragExit={blurTarget}
          onMouseLeave={blurTarget}
          onPointerLeave={blurTarget}
          type="button"
        >
          {DeleteIcon}
        </DeleteButton>
      </td>
      <td>
        <NameGradeInput
          onChange={(event) => {
            modifyAssignment(
              {
                ...assignment,
                name: event.target.value,
              },
              index
            );
          }}
          type="text"
          value={assignment.name}
        />
      </td>
      <td>
        <NameGradeInput
          min="0"
          onChange={(event) => {
            if (Number.isNaN(Number.parseFloat(event.target.value))) {
              modifyAssignment(
                {
                  ...assignment,
                  grade: 0,
                },
                index
              );
            } else {
              if (Number.parseFloat(event.target.value) > 1000) {
                return;
              }

              modifyAssignment(
                {
                  ...assignment,
                  grade: Number.parseFloat(event.target.value),
                },
                0
              );
            }
          }}
          step="1"
          type="number"
          value={assignment.grade.toString()}
        />
      </td>
      <td>
        <WeightInput
          allowNegative={false}
          isAllowed={({ floatValue }) =>
            floatValue === undefined
              ? true
              : floatValue >= 0 && floatValue <= 100
          }
          onChange={(event) => {
            const weight =
              event.target.value === ""
                ? 0
                : Number.parseFloat(event.target.value);
            modifyAssignment({ ...assignment, weight }, index);
          }}
          suffix="%"
          value={assignment.weight}
        />
      </td>
    </tr>
  );
}
export default AssignmentItem;
