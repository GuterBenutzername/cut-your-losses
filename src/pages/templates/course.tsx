import { type Course } from "../../backend";
import produce from "immer";
import Assignments from "./organisms/assignments/assignments";
export default function CourseTemplate({
  course,
  index: courseIndex,
  onModifyCourse,
}: {
  course: Course;
  index: number;
  onModifyCourse: (nextCourseState: Course, index: number) => void;
}) {
  const onModifyAssignment = (
    event: { target: { value: string } },
    assignmentIndex: number,
    property: "name" | "grade" | "weight" | "theoretical"
  ) => {
    const nextCourseState = produce(course, (draft) => {
      const newValue = draft.assignments[assignmentIndex].theoretical; // Ensure no race conditions occur if this property is changed
      switch (property) {
        case "name":
          draft.assignments[assignmentIndex].name = event.target.value;
          break;
        case "weight":
          if (
            Number(event.target.value) <= 1 &&
            Number(event.target.value) > 0
          ) {
            draft.assignments[assignmentIndex].weight = Number(
              event.target.value
            );
          }

          break;
        case "grade":
          if (Number(event.target.value) >= 0) {
            draft.assignments[assignmentIndex].grade = Number(
              event.target.value
            );
          }

          break;
        case "theoretical":
          draft.assignments[assignmentIndex].theoretical = !newValue;
          break;
        default:
          break;
      }
    });
    onModifyCourse(nextCourseState, courseIndex);
  };

  const onDeleteAssignment = (assignmentIndex: number) => {
    const nextCourseState = produce(course, (draft) => {
      draft.assignments.splice(assignmentIndex, 1);
    });
    onModifyCourse(nextCourseState, courseIndex);
  };

  return (
    <div>
      <Assignments
        assignments={course.assignments}
        onModifyAssignment={onModifyAssignment}
        onDeleteAssignment={onDeleteAssignment}
      />
    </div>
  );
}
