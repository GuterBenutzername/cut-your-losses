import Popup from "react-animated-popup";
import { importFromCsv, Course } from "../../backend";
import "./sidebar.css";
import { useEffect, useState } from "react";

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
  return (
    <>
      <Popup
        visible={importCsvOpen}
        style={{
          textAlign: "center",
          width: "70vw",
          maxWidth: "600px !important",
        }}
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
          style={{ width: "400px", height: "350px" }}
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
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <input
            placeholder="Name"
            value={importCsvName}
            onChange={(event) => {
              setImportCsvName(event.target.value);
            }}
          />
          <button
            type="button"
            onClick={() => {
              if (importCsvName.trim() === "") {
                return;
              }

              const importedAssignments = importFromCsv(importCsv);
              if (importedAssignments !== undefined) {
                onImportCourse(new Course(importCsvName, importedAssignments));
                setImportCsvOpen(false);
              }
            }}
          >
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
        <div className="sidebar">
          {courses.map((course, index) => (
            <button
              key={course.id}
              className="course-button"
              type="button"
              onClick={(event) => {
                event.currentTarget.blur();
                onSwapCourse(index);
              }}
            >
              {currentCourse === index && (
                <span className="selected-course">&gt;</span>
              )}
              {course.name}
            </button>
          ))}
          {creating ? (
            <span className="new-course-button">
              <label htmlFor="course-input">Course Name</label>
              <input
                autoFocus
                id="course-input"
                value={courseNameText}
                className="course-input"
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
              className="new-course-button"
              type="button"
              onClick={() => {
                setCreating(true);
              }}
            >
              New Course
            </button>
          )}
          <div className="spacer" />
          <button
            type="button"
            className="course-button"
            onClick={() => {
              setImportCsvOpen(true);
            }}
          >
            Import from CSV
          </button>
          <button type="button" className="course-button">
            Options
          </button>
          <button type="button" className="course-button">
            Help
          </button>
        </div>
      )}
    </>
  );
}
