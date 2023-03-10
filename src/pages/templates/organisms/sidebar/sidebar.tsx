import { type Course } from "../../../../backend";
import "./sidebar.css";
import { useReducer, useState } from "react";

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
  return (
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
        <span className="course-button">
          <label htmlFor="course-input">Course Name</label>
          <input id="course-input" className="course-input" />
        </span>
      ) : (
        <button
          className="course-button"
          type="button"
          onClick={() => {
            setCreating(true);
            setCourseNameText("");
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
  );
}
