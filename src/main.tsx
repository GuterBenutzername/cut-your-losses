import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import { enablePatches } from "immer";

import App from "./pages/App";

import "./index.css";

enablePatches();
createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
