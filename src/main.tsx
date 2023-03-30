import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
]);
if (typeof document !== "undefined") {
  createRoot(document.querySelector("#root")!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
