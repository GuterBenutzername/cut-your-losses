import { useState, useEffect } from "react";
import { fakeCourse, Course, isCourseArray, Assignment } from "../backend";
import CourseTemplate from "./templates/course";
import Sidebar from "./templates/organisms/sidebar/sidebar";
import "./app.css";
import produce, { applyPatches, type Patch } from "immer";

function arrayEquals(a: unknown, b: unknown) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

function App() {
  const [courses, setCourses] = useState<Course[]>(
    localStorage.getItem("courses") === null ||
      !isCourseArray(JSON.parse(localStorage.getItem("courses")!))
      ? []
      : (JSON.parse(localStorage.getItem("courses")!) as Course[])
  );
  const [coursePatches, setCoursePatches] = useState<
    Array<{ undo: Patch[]; redo: Patch[] }>
  >([]);
  const [currentVersion, setCurrentVersion] = useState<number>(-1);
  const [courseIndex, setCourseIndex] = useState<number>(0);
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);
  const saveChanges = (patches: Patch[], inversePatches: Patch[]) => {
    setCurrentVersion(currentVersion + 1);
    setCoursePatches(
      produce(coursePatches, (draft) => {
        draft[currentVersion + 1] = {
          undo: inversePatches,
          redo: patches,
        };
        if (draft.length > 100) {
          draft.shift();
          setCurrentVersion(currentVersion - 1);
        }

        if (currentVersion < coursePatches.length - 1) {
          draft.splice(currentVersion + 2)
        }
      })
    );
  };

  const onUndo = () => {
    setCourses(applyPatches(courses, coursePatches[currentVersion].undo));
    setCurrentVersion(currentVersion - 1);
  };

  const onRedo = () => {
    setCourses(applyPatches(courses, coursePatches[currentVersion + 1].redo));
    setCurrentVersion(currentVersion + 1);
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
  const onModifyAssignment = (
    event: { target: { value: string } },
    assignmentIndex: number,
    property: "name" | "grade" | "weight" | "theoretical"
  ) => {
    const nextCoursesState = produce(
      courses,
      (draft) => {
        const toChange = draft[courseIndex]?.assignments[assignmentIndex];
        const newValue = toChange.theoretical; // Ensure no race conditions occur if this property is changed
        switch (property) {
          case "name":
            toChange.name = event.target.value;
            break;
          case "weight":
            if (
              Number(event.target.value) <= 1 &&
              Number(event.target.value) > 0
            ) {
              toChange.weight = Number(event.target.value);
            }

            break;
          case "grade":
            if (Number(event.target.value) >= 0) {
              toChange.grade = Number(event.target.value);
            }

            break;
          case "theoretical":
            toChange.theoretical = !newValue;
            break;
          default:
            break;
        }
      },
      (patches: Patch[], inversePatches: Patch[]) => {
        setCoursePatches(
          produce(coursePatches, (draft) => {
            if (
              arrayEquals(
                coursePatches[coursePatches.length - 1]?.redo[0].path,
                patches[0].path
              )
            ) {
              draft[currentVersion] = {
                undo: draft[currentVersion].undo,
                redo: patches,
              };
            } else {
              draft[currentVersion + 1] = {
                undo: inversePatches,
                redo: patches,
              };
              setCurrentVersion(currentVersion + 1);
              if (draft.length > 100) {
                draft.shift();
                setCurrentVersion(currentVersion - 1);
              }
            }

            if (currentVersion < coursePatches.length - 1) {
              draft.splice(currentVersion + 2)
            }
          })
        );
      }
    );
    setCourses(nextCoursesState);
  };

  const onDeleteAssignment = (assignmentIndex: number) => {
    const nextCoursesState = produce(
      courses,
      (draft) => {
        draft[courseIndex]?.assignments.splice(assignmentIndex, 1);
      },
      saveChanges
    );
    setCourses(nextCoursesState);
  };

  const onAddAssignment = () => {
    const nextCoursesState = produce(
      courses,
      (draft) => {
        draft[courseIndex]?.assignments.unshift(new Assignment("", 0, 0));
      },
      saveChanges
    );
    setCourses(nextCoursesState);
  };

  return (
    <>
      <Sidebar
        currentCourse={courseIndex}
        courses={courses}
        onSwapCourse={onSwapCourse}
        onCreateCourse={onCreateCourse}
      />
      <div className="app">
        <CourseTemplate
          course={currentCourse}
          courseIndex={courseIndex}
          onDeleteCourse={onDeleteCourse}
          onModifyAssignment={onModifyAssignment}
          onDeleteAssignment={onDeleteAssignment}
          onAddAssignment={onAddAssignment}
          onUndo={onUndo}
          onRedo={onRedo}
        />
      </div>
    </>
  );
}

export default App;
