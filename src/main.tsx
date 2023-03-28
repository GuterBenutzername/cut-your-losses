import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { enablePatches } from "immer";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "./pages/App";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

enablePatches();
if (typeof document !== "undefined") {
  createRoot(document.querySelector("#root")!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
