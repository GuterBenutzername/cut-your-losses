import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { enablePatches } from "immer";

import App from "./pages/App";

import "./index.css";

enablePatches();
if (typeof document !== "undefined") {
  createRoot(document.querySelector("#root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
