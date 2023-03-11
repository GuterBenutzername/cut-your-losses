import { type Course } from "../../../../backend";
import "./sidebar.css";
import { useEffect, useState } from "react";

export default function Sidebar({
  courses,
  currentCourse,
  onSwapCourse,
  onCreateCourse,
}: {
  courses: Course[];
  currentCourse: number;
  onSwapCourse: (index: number) => void;
  onCreateCourse: (name: string) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [courseNameText, setCourseNameText] = useState("");
  const [width, setWidth] = useState(0);
  useEffect(() => {
    window.addEventListener(
      "resize",
      () => {
        setWidth(window.innerWidth);
      },
      true
    );
    setWidth(window.innerWidth);
    return () => {
      window.removeEventListener(
        "resize",
        () => {
          setWidth(window.innerWidth);
        },
        true
      );
    };
  }, [width]);
  return (
    // React ESLint thinks fragments are unneccessary, despite the fact that they are if the only child is conditionally rendered.
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
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
