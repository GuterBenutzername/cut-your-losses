import { useState, useEffect } from "react";
import produce, { applyPatches, type Patch } from "immer";
import { css } from "@emotion/css";

import { Course, isCourseArray, Assignment } from "../backend";
import CourseTemplate from "../organisms/course";
import Sidebar from "../organisms/sidebar";
import ActionButtons from "../atoms/actionButtons";

function arrayEquals(a: unknown, b: unknown) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((value, index) => value === b[index])
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
    { undo: Patch[]; redo: Patch[] }[]
  >([]);
  const [currentVersion, setCurrentVersion] = useState<number>(-1);
  const [courseIndex, setCourseIndex] = useState<number>(0);
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);
  const saveChanges = (redo: Patch[], undo: Patch[]) => {
    setCurrentVersion(currentVersion + 1);
    setCoursePatches(
      produce(coursePatches, (draft) => {
        draft[currentVersion + 1] = {
          undo,
          redo,
        };
        if (draft.length > 100) {
          draft.shift();
          setCurrentVersion(currentVersion - 1);
        }

        if (currentVersion < coursePatches.length - 1) {
          draft.splice(currentVersion + 2);
        }
      })
    );
  };

  const saveChangesOnModifyAssignment = (patches: Patch[], undo: Patch[]) => {
    setCoursePatches(
      produce(coursePatches, (draft) => {
        if (
          patches[0] !== undefined &&
          coursePatches.at(-1)?.redo[0] !== undefined &&
          arrayEquals(coursePatches.at(-1)?.redo[0].path, patches[0].path)
        ) {
          draft[currentVersion] = {
            undo: draft[currentVersion].undo,
            redo: patches,
          };
        } else {
          draft[currentVersion + 1] = {
            undo,
            redo: patches,
          };
          setCurrentVersion(currentVersion + 1);
          if (draft.length > 100) {
            draft.shift();
            setCurrentVersion(currentVersion - 1);
          }
        }

        if (currentVersion < coursePatches.length - 1) {
          draft.splice(currentVersion + 2);
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

  const onImportCourse = (course: Course) => {
    const nextState = produce(
      courses,
      (draft) => {
        draft.unshift(course);
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
    if (courseIndex > courses.length - 2) {
      setCourseIndex(0);
    }
  };

  const currentCourse =
    courses.length > 0 ? courses[courseIndex] : new Course("", []);
  const onModifyAssignment = (
    event: { target: { value: string } },
    assignmentIndex: number,
    property: "future" | "grade" | "name" | "weight"
  ) => {
    const nextCoursesState = produce(
      courses,
      (draft) => {
        const toChange = draft[courseIndex]?.assignments[assignmentIndex];
        const newValue = toChange.future; // Ensure no race conditions occur if this property is changed
        switch (property) {
          case "name":
            toChange.name = event.target.value;
            break;

          case "weight":
            if (Number(event.target.value) <= 1 &&
            Number(event.target.value) >= 0) {
              toChange.weight = Number(event.target.value);
            }

            break;

          case "grade":
            if (Number(event.target.value) >= 0) {
              toChange.grade = Number(event.target.value);
            }

            break;

          case "future":
            toChange.future = !newValue;
            break;

          default:
            break;
        }
      },
      saveChangesOnModifyAssignment
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
        courses={courses}
        currentCourse={courseIndex}
        onCreateCourse={onCreateCourse}
        onImportCourse={onImportCourse}
        onSwapCourse={onSwapCourse}
      />
      <ActionButtons
        onDeleteCourse={() => {
          onDeleteCourse(courseIndex);
        }}
        onRedo={onRedo}
        onUndo={onUndo}
      />
      <div
        className={css`
          display: flex;
          justify-content: center;
        `}
      >
        {courses.length > 0 && (
          <CourseTemplate
            course={currentCourse}
            onAddAssignment={onAddAssignment}
            onDeleteAssignment={onDeleteAssignment}
            onModifyAssignment={onModifyAssignment}
          />
        )}
      </div>
      <span
        className={css`
          position: fixed;
          bottom: 0;
          width: 100vw;
          text-align: right;
          font-size: 0.7rem;
          color: #ddd;
          z-index: 2;
        `}
      >
        Version 0.2.0 | © 2023 Adam Y. Cole II, founder of The Adam Co.
      </span>
    </>
  );
}

export default App;

