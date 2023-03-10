import { useState } from "react";
import { type Course, fakeCourse } from '../backend';
import CourseTemplate from "./templates/course";
import Sidebar from "./templates/organisms/sidebar/sidebar";
function App() {
  const [courses, setCourses] = useState<Course[]>([
    fakeCourse(10),
    fakeCourse(10),
    fakeCourse(10),
    fakeCourse(10),
    fakeCourse(10),
    fakeCourse(10),
  ]);
  const [currentCourse, setCurrentCourse] = useState<number>(0);
  const onModifyCourse = (nextCourseState: Course, index: number) => {
    const newCourses = [...courses];
    newCourses[index] = nextCourseState;
    setCourses(newCourses);
  };

  const onSwapCourse = (index: number) => {
    setCurrentCourse(index);
  };

  return (
    <div className="App">
      <Sidebar currentCourse={currentCourse} courses={courses} onSwapCourse={onSwapCourse} />
      <CourseTemplate
        course={courses[currentCourse]}
        index={currentCourse}
        onModifyCourse={onModifyCourse}
      />
    </div>
  );
}

export default App;
