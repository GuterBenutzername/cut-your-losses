import Popup from "react-animated-popup";
import { importFromCsv, Course } from "../backend";
import { useEffect, useState } from "react";
import { css } from "@emotion/css";

const courseButtonStyle = css`
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
  const [importCsvOpen, setImportCsvOpen] = useState(false);
  const [importCsv, setImportCsv] = useState("");
  const [importCsvName, setImportCsvName] = useState("");
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
  const onImportCsv = () => {
    if (importCsvName.trim() === "") {
      return;
    }

    const importedAssignments = importFromCsv(importCsv);
    if (importedAssignments !== undefined) {
      onImportCourse(new Course(importCsvName, importedAssignments));
      setImportCsvOpen(false);
    }
  };

  return (
    <>
      <Popup
        visible={importCsvOpen}
        className={css`
          text-align: center;
          width: 70vw;
          max-width: 600px !important;
        `}
        onClose={() => {
          setImportCsvOpen(false);
        }}
      >
        <p>
          Manually import from CSV (aka copy-paste from Excel) <br />
          The table <i>must</i> have a header row that contains `name`, `grade`,
          `weight`, and `theoretical`, where `grade` and `weight` are numbers
          and `theoretical` is &quot;true&quot; or &quot;false&quot;. The column
          order does not matter.
        </p>
        <br />
        <textarea
          className={css`
            width: 400px;
            height: 350px;
          `}
          value={importCsv}
          onChange={(event) => {
            setImportCsv(event.target.value);
          }}
        />
        <br />
        <p>
          Since encoding the name of the class would make the CSV harder to
          create, please input the name of the class here:
        </p>
        <span
          className={css`
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
          `}
        >
          <span
            className={css`
              position: relative;
            `}
          >
            <label
              htmlFor="name"
              className={css`
                position: absolute;
                top: -0.8ex;
                z-index: 1;
                left: 1rem;
                background-color: #fff;
                height: 10px;
                line-height: 10px;
                vertical-align: middle;
                font-size: smaller;
              `}
            >
              Name
            </label>
            <input
              id="name"
              value={importCsvName}
              onChange={(event) => {
                setImportCsvName(event.target.value);
              }}
            />
          </span>
          <button type="button" onClick={onImportCsv}>
            Import
          </button>
          <button
            type="button"
            onClick={() => {
              setImportCsvOpen(false);
            }}
          >
            Cancel
          </button>
        </span>
      </Popup>
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
          <button
            type="button"
            className={courseButtonStyle}
            onClick={() => {
              setImportCsvOpen(true);
            }}
          >
            Import from CSV
          </button>
          <button type="button" className={courseButtonStyle}>
            Options
          </button>
          <button type="button" className={courseButtonStyle}>
            Help
          </button>
        </div>
      )}
    </>
  );
}
