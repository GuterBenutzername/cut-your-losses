import { importFromCsv, importFromCisdCsv, Course } from "../backend";
import { useEffect, useState } from "react";
import { css } from "@emotion/css";
import { Popups } from "./popups";

export const courseButtonStyle = css`
  background-color: #2c2c2c;
  height: 32px;
  border-radius: 8px;
  width: 145px;
  color: #ddd;
  position: relative;
  border: 0;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover {
    background-color: #444;
  }
  &:focus {
    outline: #666 solid 3px;
  }
`;

const newCourseInputLabelStyle = css`
  position: absolute;
  top: -0.2ex;
  z-index: 1;
  left: 1rem;
  background-color: #333;
  height: 10px;
  line-height: 10px;
  vertical-align: middle;
  font-size: smaller;
`;
const newCourseInputStyle = css`
  width: 95%;
  margin: 0;
  background-color: #222;
  border-radius: 4px;
  border: 0;
  height: 22px;
  position: relative;
  color: #fff;
  &:focus {
    outline: #666 solid 4px;
  }
`;
export default function Sidebar({
  courses,
  currentCourse,
  onSwapCourse,
  onCreateCourse,
  onImportCourse,
}: {
  courses: Course[];
  currentCourse: number;
  onSwapCourse: (index: number) => void;
  onCreateCourse: (name: string) => void;
  onImportCourse: (course: Course) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [courseNameText, setCourseNameText] = useState("");
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", updateWidth, true);
    setWidth(window.innerWidth);
    return () => {
      window.removeEventListener("resize", updateWidth, true);
    };
  }, [width]);
  const onImportSchoolCsv = (
    district: string,
    importSchoolData: string,
    importSchoolName: string
  ) => {
    if (importSchoolName.trim() === "") {
      return;
    }

    switch (district) {
      case "CISD":
        onImportCourse(
          new Course(importSchoolName, importFromCisdCsv(importSchoolData))
        );
        break;
      default:
        throw new Error("This errror should not occur or exist");
    }
  };

  const onImportCsv = (importCsv: string, importCsvName: string) => {
    if (importCsvName.trim() === "") {
      return;
    }

    const importedAssignments = importFromCsv(importCsv);
    if (importedAssignments !== undefined) {
      onImportCourse(new Course(importCsvName, importedAssignments));
    }
  };

  return (
    // ESLint mistakenly thinks that this fragment is useless,
    // despite the fact that it's necessary when using one,
    // conditionally rendered element.
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {width > 600 && (
        <div
          className={css`
            position: fixed;
            height: 100vh;
            width: 150px;
            background-color: #333;
            left: 0;
            top: 0;
            display: flex;
            flex-flow: column nowrap;
            justify-content: flex-start;
            align-items: center;
            gap: 8px;
            padding-top: 16px;
            padding-bottom: 12px;
            min-width: 0;
          `}
        >
          {courses.map((course, index) => (
            <button
              key={course.id}
              className={courseButtonStyle}
              type="button"
              onClick={(event) => {
                event.currentTarget.blur();
                onSwapCourse(index);
              }}
            >
              {currentCourse === index && (
                <span
                  className={css`
                    color: #0f0;
                    margin-right: 2px;
                  `}
                >
                  &gt;
                </span>
              )}
              {course.name}
            </button>
          ))}
          {creating ? (
            <span
              className={css`
                background-color: #2c2c2c;
                height: 32px;
                border-radius: 8px;
                width: 145px;
                color: #ddd;
                position: relative;
                border: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow: visible;
                &:hover {
                  background-color: #444;
                }
                &:focus {
                  outline: #666 solid 3px;
                }
              `}
            >
              <label
                className={newCourseInputLabelStyle}
                htmlFor="course-input"
              >
                Course Name
              </label>
              <input
                autoFocus
                id="course-input"
                value={courseNameText}
                className={newCourseInputStyle}
                onChange={(event) => {
                  setCourseNameText(event.target.value);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    if (courseNameText.trim() === "") {
                      return;
                    }

                    onCreateCourse(courseNameText);
                    setCourseNameText("");
                    setCreating(false);
                  }
                }}
              />
            </span>
          ) : (
            <button
              className={courseButtonStyle}
              type="button"
              onClick={() => {
                setCreating(true);
              }}
            >
              New Course
            </button>
          )}
          <div
            className={css`
              height: 16px;
            `}
          />
          <Popups
            onImportCsv={onImportCsv}
            onImportSchoolCsv={onImportSchoolCsv}
          />
        </div>
      )}
    </>
  );
}
