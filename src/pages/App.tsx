import { useState } from "react";
import { fakeCourse, Course } from "../backend";
import CourseTemplate from "./templates/course";
import Sidebar from "./templates/organisms/sidebar/sidebar";
import produce from "immer";
function App() {
  const [courses, setCourses] = useState<Course[]>([fakeCourse(10)]);
  const [currentCourse, setCurrentCourse] = useState<number>(0);
  const onModifyCourse = (nextCourseState: Course, index: number) => {
    const newCourses = [...courses];
    newCourses[index] = nextCourseState;
    setCourses(newCourses);
  };

  const onCreateCourse = (name: string) => {
    const nextState = produce(courses, (draft) => {
      draft.unshift(new Course(name, []));
    });
    setCourses(nextState);
    setCurrentCourse(0);
  };

  const onSwapCourse = (index: number) => {
    setCurrentCourse(index);
  };

  return (
    <div className="App">
      <Sidebar
        currentCourse={currentCourse}
        courses={courses}
        onSwapCourse={onSwapCourse}
        onCreateCourse={onCreateCourse}
      />
      <CourseTemplate
        course={courses[currentCourse]}
        index={currentCourse}
        onModifyCourse={onModifyCourse}
      />
    </div>
  );
}

export default App;
