import { useState } from "react";
import { fakeCourse, Course } from "../backend";
import CourseTemplate from "./templates/course";
import Sidebar from "./templates/organisms/sidebar/sidebar";
import produce, { applyPatches, type Patch } from "immer";
function App() {
  const [courses, setCourses] = useState<Course[]>([fakeCourse(10)]);
  const [coursePatches, setCoursePatches] = useState<
    Array<{ undo: Patch[]; redo: Patch[] }>
  >([]);
  const [currentVersion, setCurrentVersion] = useState<number>(-1);
  const [courseIndex, setCourseIndex] = useState<number>(0);

  const saveChanges = (patches: Patch[], inversePatches: Patch[]) => {
    setCurrentVersion(currentVersion + 1);
    setCoursePatches(
      produce(coursePatches, (draft) => {
        draft.push({
          undo: inversePatches,
          redo: patches,
        });
        if (draft.length > 100) {
          draft.shift();
          setCurrentVersion(currentVersion - 1);
        }
      })
      
    );
  };

  const onModifyCourse = (nextCourseState: Course, index: number) => {
    setCourses(
      produce(
        courses,
        (draft) => {
          draft[index] = nextCourseState;
        },
        saveChanges
      )
    );
  };

  const onUndo = () => {
    setCourses(applyPatches(courses, coursePatches[currentVersion].undo));
    setCurrentVersion(currentVersion - 1);
  };

  const onCreateCourse = (name: string) => {
    const nextState = produce(
      courses,
      (draft) => {
        draft.unshift(new Course(name, []));
      },
      saveChanges
    );
    setCourses(nextState);
    setCourseIndex(0);
  };

  const onSwapCourse = (index: number) => {
    setCourseIndex(index);
  };

  const onDeleteCourse = (index: number) => {
    const nextState = produce(
      courses,
      (draft) => {
        draft.splice(index, 1);
      },
      saveChanges
    );
    setCourses(nextState);
  };

  const currentCourse =
    courses.length > 0 ? courses[courseIndex] : new Course("", []);

  return (
    <div className="App">
      <Sidebar
        currentCourse={courseIndex}
        courses={courses}
        onSwapCourse={onSwapCourse}
        onCreateCourse={onCreateCourse}
      />
      <CourseTemplate
        course={currentCourse}
        courseIndex={courseIndex}
        onDeleteCourse={onDeleteCourse}
        onModifyCourse={onModifyCourse}
        onUndo={onUndo}
      />
    </div>
  );
}

export default App;
