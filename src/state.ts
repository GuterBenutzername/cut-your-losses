import { create } from "zustand";

import Course from "./Course";
import Assignment from "./Assignment";

interface PrimaryStore {
  courses: Course[];
  currentCourse: number;
  modifyAssignment: (assignment: Assignment, index: number) => void;
}

const usePrimaryStore = create<PrimaryStore>((set) => ({
  courses: [new Course("example", [new Assignment()])] as Course[],
  currentCourse: 0,

  modifyAssignment: (assignment: Assignment, index: number) => {
    set((state: { courses: Course[]; currentCourse: number }) => {
      const { courses, currentCourse } = state;
      courses[currentCourse].assignments[index] = assignment;
      return { courses };
    });
  },
}));

export default usePrimaryStore;
