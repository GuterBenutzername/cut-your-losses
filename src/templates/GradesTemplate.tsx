import styled from "styled-components";
import { useState } from "react";

import usePrimaryStore from "../state";
import AssignmentItem from "../organisms/AssignmentItem";
import getAverageOfAssignments from "../getAverageOfAssignments";
import { NameGradeInput } from "../atoms/StyledComponents";
import Assignment from "../Assignment";

const GradesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 88px;
  height: 100vh;
  width: 100%;
  margin-left: 4px;
  margin-right: 4px;
`;

const Average = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const AverageNumber = styled.span`
  font-weight: 800;
  font-size: 2rem;
`;

const AverageText = styled.span`
  font-weight: 500;
`;

const PlusIconWrapper = styled.td`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 38px;
  margin-right: 2px;
`;

function GradesTemplate() {
  const state = usePrimaryStore();
  // eslint-disable-next-line no-underscore-dangle, react/hook-use-state
  const [_grade, _setGrade] = useState("");
  // eslint-disable-next-line no-underscore-dangle, react/hook-use-state
  const [_weight, _setWeight] = useState("");
  const assignments = state.courses[state.currentCourse]?.assignments;
  const [autoFocus, setAutoFocus] = useState<
    "grade" | "name" | "weight" | undefined
  >();
  return (
    <GradesWrapper>
      <Average>
        <AverageText>
          Your average in <i>{state.courses[state.currentCourse].name}</i> is:
        </AverageText>
        <AverageNumber>
          {Boolean(assignments) &&
            getAverageOfAssignments(assignments).toLocaleString("en-US", {
              maximumFractionDigits: 2,
              minimumFractionDigits: 2,
            })}
        </AverageNumber>
      </Average>
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
            <PlusIconWrapper>
              <svg
                height="25"
                viewBox="0 0 448 512"
                width="25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M432 256C432 269.25 421.25 280 408 280H248V440C248 453.25 237.25 464 224 464S200 453.25 200 440V280H40C26.75 280 16 269.25 16 256S26.75 232 40 232H200V72C200 58.75 210.75 48 224 48S248 58.75 248 72V232H408C421.25 232 432 242.75 432 256Z" />
              </svg>
            </PlusIconWrapper>
            <td>
              <NameGradeInput
                onChange={(event) => {
                  state.pushAssignment(new Assignment(event.target.value));
                  setAutoFocus("name");
                }}
                type="text"
                value=""
              />
            </td>
            <td>
              <NameGradeInput
                min="0"
                onChange={(event) => {
                  state.pushAssignment(
                    new Assignment("", Number.parseFloat(event.target.value))
                  );
                  setAutoFocus("grade");
                  _setGrade("");
                }}
                step="1"
                type="number"
                value={_grade}
              />
            </td>
            <td>
              <NameGradeInput
                onChange={(event) => {
                  state.pushAssignment(
                    new Assignment("", 0, Number.parseFloat(event.target.value))
                  );
                  setAutoFocus("weight");
                  _setWeight("");
                }}
                value={_weight}
              />
            </td>
          </tr>
          {Boolean(assignments) &&
            assignments.length > 0 &&
            assignments.map((assignment, index) => (
              <AssignmentItem
                assignment={assignment}
                autoFocus={autoFocus}
                deleteAssignment={state.deleteAssignment}
                index={index}
                key={assignment.id}
                modifyAssignment={(assignmentParameter, indexParameter) => {
                  setAutoFocus(undefined);
                  state.modifyAssignment(assignmentParameter, indexParameter);
                }}
              />
            ))}
        </tbody>
      </table>
    </GradesWrapper>
  );
}

export default GradesTemplate;
