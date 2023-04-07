import styled from "styled-components";

import usePrimaryStore from "../state";
import AssignmentItem from "../organisms/AssignmentItem";

const GradesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

function GradesTemplate() {
  const state = usePrimaryStore();
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
          {state.courses[state.currentCourse].assignments.length > 0 &&
            state.courses[state.currentCourse].assignments.map(
              (assignment, index) => (
                <AssignmentItem
                  assignment={assignment}
                  index={index}
                  key={assignment.id}
                  modifyAssignment={state.modifyAssignment}
                />
              )
            )}
        </tbody>
      </table>
    </GradesWrapper>
  );
}

export default GradesTemplate;
