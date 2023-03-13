import React from "react";
import ReactDOM from "react-dom/client";
import App from "./pages/app/App";
import "./index.css";
import { enablePatches } from "immer";

enablePatches();
ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
