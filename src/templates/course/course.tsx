import { type Course } from "../../backend";
import "./course.css";
import Assignments from "../../organisms/assignments/assignments";
import ActionButtons from "../../molecules/actionButtons/actionButtons";
import Averages from "../../organisms/averages/averages";

export default function CourseTemplate({
  course,
  courseIndex,
  onModifyAssignment,
  onDeleteAssignment,
  onAddAssignment,
  onDeleteCourse,
  onUndo,
  onRedo,
}: {
  course: Course;
  courseIndex: number;
  onModifyAssignment: (
    event: { target: { value: string } },
    index: number,
    property: "name" | "grade" | "weight" | "theoretical"
  ) => void;
  onDeleteAssignment: (index: number) => void;
  onAddAssignment: () => void;
  onDeleteCourse: (index: number) => void;
  onUndo: () => void;
  onRedo: () => void;
}) {
  return (
    <div>
      <ActionButtons
        onUndo={onUndo}
        onRedo={onRedo}
        onDeleteCourse={() => {
          onDeleteCourse(courseIndex);
        }}
      />
      <div className="assignments-wrapper">
        <Averages assignments={course.assignments} />
        <Assignments
          assignments={course.assignments}
          onModifyAssignment={onModifyAssignment}
          onDeleteAssignment={onDeleteAssignment}
          onAddAssignment={onAddAssignment}
        />
      </div>
    </div>
  );
}
