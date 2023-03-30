import styled from "styled-components";

const GradesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
`;

function GradesTemplate() {
  return <GradesWrapper>Grades</GradesWrapper>;
}

export default GradesTemplate;
