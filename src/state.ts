import { create } from "zustand";

const usePrimaryStore = create(() => ({
  helloWorld: "Hello, World!",
}));

export default usePrimaryStore;
