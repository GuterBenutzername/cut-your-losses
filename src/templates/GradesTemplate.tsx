import styled from "styled-components";
import { NumericFormat } from "react-number-format";
import { useState } from "react";

function blurTarget(event: React.PointerEvent<HTMLButtonElement>) {
  const target = event.target as HTMLButtonElement;
  target.disabled = true;
  target.disabled = false;
}

const GradesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
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

function GradesTemplate() {
  const [grade, setGrade] = useState(0);
  return (
    <GradesWrapper>
      <table>
        <thead>
          <tr>
            <th />
            <th>Name</th>
            <th>Grade</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <DeleteButton
                onMouseLeave={blurTarget}
                onPointerLeave={blurTarget}
                type="button"
              >
                {DeleteIcon}
              </DeleteButton>
            </td>
            <td>
              <input type="text" />
            </td>
            <td>
              <input
                min="0"
                onChange={(event) => {
                  if (Number.isNaN(Number.parseFloat(event.target.value))) {
                    setGrade(0);
                  } else {
                    if (Number.parseFloat(event.target.value) > 1000) {
                      return;
                    }

                    setGrade(Number.parseFloat(event.target.value));
                  }
                }}
                step="1"
                type="number"
                value={grade.toString()}
              />
            </td>
            <td>
              <NumericFormat
                allowNegative={false}
                max="100"
                min="0"
                step="1"
                suffix="%"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </GradesWrapper>
  );
}

export default GradesTemplate;
