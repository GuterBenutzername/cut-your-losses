import { create } from "zustand";

import type Course from "./Course";

const usePrimaryStore = create(() => ({
  courses: [] as Course[],
  currentCourse: 0,
}));

export default usePrimaryStore;
