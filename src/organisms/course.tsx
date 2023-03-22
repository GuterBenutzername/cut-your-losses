import { css } from "@emotion/css";

import type { Course } from "../backend";
import Averages from "../molecules/averages";

import Assignments from "./assignments";

const primaryViewStyle = css`
  width: calc(100vw - 150px);
  height: calc(100vh - 38px);
  position: absolute;
  left: 150px;
  padding: 4px;
  padding-top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: calc(100vh - 38px);
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 4px;
    padding-top: 0;
    display: flex;
  }
`;

export default function CourseTemplate({
  course,
  onModifyAssignment,
  onDeleteAssignment,
  onAddAssignment,
}: {
  course: Course;
  onModifyAssignment: (
    event: { target: { value: string } },
    index: number,
    property: "future" | "grade" | "name" | "weight"
  ) => void;
  onDeleteAssignment: (index: number) => void;
  onAddAssignment: () => void;
}) {
  return (
    <div>
      <div className={primaryViewStyle}>
        <Averages assignments={course.assignments} />
        <Assignments
          assignments={course.assignments}
          onAddAssignment={onAddAssignment}
          onDeleteAssignment={onDeleteAssignment}
          onModifyAssignment={onModifyAssignment}
        />
      </div>
    </div>
  );
}
