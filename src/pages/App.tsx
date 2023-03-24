import { useState, useEffect } from "react";
import { applyPatches, produce, type Patch } from "immer";
import { css } from "@emotion/css";

import { Course, isCourseArray } from "../Course";
import { Assignment } from "../Assignment";
import CourseTemplate from "../organisms/course";
import Sidebar from "../organisms/sidebar";
import ActionButtons from "../atoms/actionButtons";

function arrayEquals(array1: unknown, array2: unknown) {
  return (
    Array.isArray(array1) &&
    Array.isArray(array2) &&
    array1.length === array2.length &&
    array1.every((value, index) => value === array2[index])
  );
}

function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursePatches, setCoursePatches] = useState<
    { undo: Patch[]; redo: Patch[] }[]
  >([]);
  const [currentVersion, setCurrentVersion] = useState<number>(-1);
  const [courseIndex, setCourseIndex] = useState<number>(0);
  useEffect(() => {
    setCourses(
      localStorage.getItem("courses") !== null &&
        isCourseArray(JSON.parse(localStorage.getItem("courses")!))
        ? (JSON.parse(localStorage.getItem("courses")!) as Course[])
        : []
    );
  }, []);
  useEffect(() => {
    localStorage.setItem("courses", JSON.stringify(courses));
  }, [courses]);
  function saveChanges(redo: Patch[], undo: Patch[]) {
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
  }

  function saveChangesOnModifyAssignment(patches: Patch[], undo: Patch[]) {
    setCoursePatches(
      produce(coursePatches, (draft) => {
        if (
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
  }

  function onUndo() {
    setCourses(applyPatches(courses, coursePatches[currentVersion].undo));
    setCurrentVersion(currentVersion - 1);
  }

  function onRedo() {
    setCourses(applyPatches(courses, coursePatches[currentVersion + 1].redo));
    setCurrentVersion(currentVersion + 1);
  }

  function onCreateCourse(name: string) {
    const nextState = produce(
      courses,
      (draft) => {
        draft.unshift(new Course(name, []));
      },
      saveChanges
    );
    setCourses(nextState);
    setCourseIndex(0);
  }

  function onImportCourse(course: Course) {
    const nextState = produce(
      courses,
      (draft) => {
        draft.unshift(course);
      },
      saveChanges
    );
    setCourses(nextState);
    setCourseIndex(0);
  }

  function onSwapCourse(index: number) {
    setCourseIndex(index);
  }

  function onDeleteCourse(index: number) {
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
  }

  const currentCourse =
    courses.length > 0 ? courses[courseIndex] : new Course("", []);
  function onModifyAssignment(
    event: { target: { value: string } },
    assignmentIndex: number,
    property: "future" | "grade" | "name" | "weight"
  ) {
    const nextCoursesState = produce(
      courses,
      (draft) => {
        const toChange = draft[courseIndex]?.assignments[assignmentIndex];

        // Ensure no race conditions occur if this property is changed
        const isFuture = toChange.future;
        switch (property) {
          case "name": {
            toChange.name = event.target.value;
            break;
          }

          case "weight": {
            if (
              Number(event.target.value) <= 1 &&
              Number(event.target.value) >= 0
            ) {
              toChange.weight = Number(event.target.value);
            }

            break;
          }

          case "grade": {
            if (Number(event.target.value) >= 0) {
              toChange.grade = Number(event.target.value);
            }

            break;
          }

          case "future": {
            toChange.future = !isFuture;
            break;
          }

          default: {
            break;
          }
        }
      },
      saveChangesOnModifyAssignment
    );
    setCourses(nextCoursesState);
  }

  function onDeleteAssignment(assignmentIndex: number) {
    const nextCoursesState = produce(
      courses,
      (draft) => {
        draft[courseIndex]?.assignments.splice(assignmentIndex, 1);
      },
      saveChanges
    );
    setCourses(nextCoursesState);
  }

  function onAddAssignment() {
    const nextCoursesState = produce(
      courses,
      (draft) => {
        draft[courseIndex]?.assignments.unshift(new Assignment("", 0, 0));
      },
      saveChanges
    );
    setCourses(nextCoursesState);
  }

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
        {courses.length > 0 ? (
          <CourseTemplate
            course={currentCourse}
            onAddAssignment={onAddAssignment}
            onDeleteAssignment={onDeleteAssignment}
            onModifyAssignment={onModifyAssignment}
          />
        ) : (
          <div
            className={css`
              height: 80vh;
              width: calc(100vw - 150px);
              position: fixed;
              left: 150px;
              display: flex;
              flex-flow: column nowrap;
              justify-content: space-evenly;
              align-items: center;
              text-align: center;
              font-weight: 600;
              z-index: -1;
            `}
          >
            <span>You don&apos;t have any courses!</span>

            <p
              className={css`
                width: 75%;
              `}
            >
              Click on the &quot;New Course&quot; button to create one, or click
              on the &quot;Import Gradebook&quot; button to import directly from
              your school&apos;s grading system (if supported).
            </p>
          </div>
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
        Version 0.3.0 | © 2023 Adam Y. Cole II, founder of The Adam Co.
      </span>
    </>
  );
}

export default App;
