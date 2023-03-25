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
  const [state, setState] = useState<{ courses: Course[]; index: number }>({
    courses: [],
    index: 0,
  });
  const [coursePatches, setCoursePatches] = useState<
    { undo: Patch[]; redo: Patch[] }[]
  >([]);
  const [currentVersion, setCurrentVersion] = useState<number>(-1);
  useEffect(() => {
    if (
      localStorage.getItem("state") !== null &&
      typeof JSON.parse(localStorage.getItem("state")!) === "object" &&
      Object.keys(JSON.parse(localStorage.getItem("state")!) as object)[0] ===
        "courses" &&
      Object.keys(JSON.parse(localStorage.getItem("state")!) as object)[1] ===
        "index" &&
      isCourseArray(
        (
          JSON.parse(localStorage.getItem("state")!) as {
            courses: unknown;
            index: unknown;
          }
        ).courses
      ) &&
      typeof (
        JSON.parse(localStorage.getItem("state")!) as {
          courses: Course[];
          index: unknown;
        }
      ).index === "number"
    ) {
      setState(
        JSON.parse(localStorage.getItem("state")!) as {
          courses: Course[];
          index: number;
        }
      );
    } else {
      setState({ courses: [], index: 0 });
    }
  }, []);
  useEffect(() => {
    if (state.courses.length > 0) {
      localStorage.setItem("state", JSON.stringify(state));
    }
  }, [state]);
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
    setState(applyPatches(state, coursePatches[currentVersion].undo));
    setCurrentVersion(currentVersion - 1);
  }

  function onRedo() {
    setState(applyPatches(state, coursePatches[currentVersion + 1].redo));
    setCurrentVersion(currentVersion + 1);
  }

  function onCreateCourse(name: string) {
    const nextState = produce(
      state,
      (draft) => {
        draft.courses.unshift(new Course(name, []));
        draft.index = 0;
      },
      saveChanges
    );
    setState(nextState);
  }

  function onImportCourse(course: Course) {
    const nextState = produce(
      state,
      (draft) => {
        draft.courses.unshift(course);
        draft.index = 0;
      },
      saveChanges
    );
    setState(nextState);
  }

  function onSwapCourse(index: number) {
    const nextState = produce(
      state,
      (draft) => {
        draft.index = index;
      },
      saveChanges
    );
    setState(nextState);
  }

  function onDeleteCourse(index: number) {
    const nextState = produce(
      state,
      (draft) => {
        draft.courses.splice(index, 1);
        if (draft.index > draft.courses.length - 1) {
          draft.index = 0;
        }
      },
      saveChanges
    );
    setState(nextState);
  }

  const currentCourse =
    state.courses.length > 0 ? state.courses[state.index] : new Course("", []);
  function onModifyAssignment(
    event: { target: { value: string } },
    assignmentIndex: number,
    property: "future" | "grade" | "name" | "weight"
  ) {
    const nextCoursesState = produce(
      state,
      (draft) => {
        const toChange =
          draft.courses[draft.index]?.assignments[assignmentIndex];

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
    setState(nextCoursesState);
  }

  function onDeleteAssignment(assignmentIndex: number) {
    const nextCoursesState = produce(
      state,
      (draft) => {
        draft.courses[draft.index]?.assignments.splice(assignmentIndex, 1);
      },
      saveChanges
    );
    setState(nextCoursesState);
  }

  function onAddAssignment() {
    const nextCoursesState = produce(
      state,
      (draft) => {
        draft.courses[draft.index]?.assignments.unshift(
          new Assignment("", 0, 0)
        );
      },
      saveChanges
    );
    setState(nextCoursesState);
  }

  return (
    <>
      <Sidebar
        courses={state.courses}
        currentCourse={state.index}
        onCreateCourse={onCreateCourse}
        onImportCourse={onImportCourse}
        onSwapCourse={onSwapCourse}
      />
      <ActionButtons
        onDeleteCourse={() => {
          onDeleteCourse(state.index);
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
        {state.courses.length > 0 ? (
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
          padding-right: 4px;
          font-size: 0.7rem;
          color: #ddd;
          z-index: 2;
        `}
      >
        Version 0.3.1 | © 2023 Adam Y. Cole II, founder of The Adam Co.
      </span>
    </>
  );
}

export default App;
