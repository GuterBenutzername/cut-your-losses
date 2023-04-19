import { create } from "zustand";

import Course from "./Course";
import type Assignment from "./Assignment";

interface PrimaryStore {
  courses: Course[];
  currentCourse: number;
  modifyAssignment: (assignment: Assignment, index: number) => void;
  deleteAssignment: (index: number) => void;
  pushAssignment: (assignment: Assignment) => void;
  setCurrentCourse: (index: number) => void;
  modifyCourse: (course: Course, index: number) => void;
  pushCourse: (course: Course) => void;
  deleteCourse: (index: number) => void;
}

const usePrimaryStore = create<PrimaryStore>((set) => ({
  courses: [new Course("Test"), new Course("Test")] as Course[],

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
      courses[currentCourse].assignments.splice(index, 1);
      return { courses };
    });
  },

  pushAssignment: (assignment: Assignment) => {
    set((state: { courses: Course[]; currentCourse: number }) => {
      const { courses, currentCourse } = state;
      courses[currentCourse].assignments.unshift(assignment);
      return { courses };
    });
  },

  setCurrentCourse: (currentCourse: number) => {
    set(() => ({ currentCourse }));
  },

  modifyCourse: (course: Course, index: number) => {
    set(({ courses }) => {
      courses[index] = course;
      return { courses };
    });
  },

  pushCourse: (course: Course) => {
    set(({ courses }) => {
      courses.push(course);
      return { courses };
    });
  },

  deleteCourse: (index: number) => {
    set(({ courses, currentCourse }) => {
      courses.splice(index, 1);
      if (currentCourse > courses.length - 1) {
        currentCourse -= 1;
      }
      return { courses, currentCourse };
    });
  },
}));

export default usePrimaryStore;
