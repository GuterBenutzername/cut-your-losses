import { create } from "zustand";

import Course from "./Course";
import type Assignment from "./Assignment";

interface PrimaryStore {
  courses: Course[];
  currentCourse: number;
  modifyAssignment: (assignment: Assignment, index: number) => void;
  deleteAssignment: (index: number) => void;
  pushAssignment: (assignment: Assignment) => void;
}

const usePrimaryStore = create<PrimaryStore>((set) => ({
  courses: [new Course("example", [])] as Course[],
  currentCourse: 0,

  modifyAssignment: (assignment: Assignment, index: number) => {
    set((state: { courses: Course[]; currentCourse: number }) => {
      const { courses, currentCourse } = state;
      courses[currentCourse].assignments[index] = assignment;
      return { courses };
    });
  },

  deleteAssignment: (index: number) => {
    set((state: { courses: Course[]; currentCourse: number }) => {
      const { courses, currentCourse } = state;
      courses[currentCourse].assignments.splice(index, 1)
      return { courses };
    });
  },

  pushAssignment: (assignment: Assignment) => {
    set((state: { courses: Course[]; currentCourse: number }) => {
      const { courses, currentCourse } = state;
      courses[currentCourse].assignments.unshift(assignment)
      return { courses };
    });
  }
}));

export default usePrimaryStore;
