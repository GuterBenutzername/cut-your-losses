import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import Dashboard from "./pages/Dashboard";
import Grades from "./pages/Grades";
import Calculators from "./pages/Calculators";
import RootTemplate from "./templates/RootTemplate";

const router = createBrowserRouter([
  {
    path: "/",

    element: <RootTemplate />,

    children: [
      { path: "/dashboard", element: <Dashboard /> },
      {
        path: "/grades",
        element: <Grades />,
      },
      {
        path: "/calculators",
        element: <Calculators />,
      },
    ],
  },
]);
if (typeof document !== "undefined") {
  createRoot(document.querySelector("#root")!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
