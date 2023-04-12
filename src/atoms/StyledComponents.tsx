import styled, { css } from "styled-components";
import { NumericFormat } from "react-number-format";

const inputStyle = css`
  border-radius: 3px;
  border: #000 solid 0.5px;
  width: 25vw;
  max-width: 250px;
  height: 38px;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 1px #000;
  }
`;
export const NameGradeInput = styled.input`
  ${inputStyle}
`;
export const WeightInput = styled(NumericFormat)`
  ${inputStyle}
`;
export const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2px;
  height: 36px;
  width: 36px;
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
