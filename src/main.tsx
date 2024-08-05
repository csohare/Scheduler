import { createHashRouter, RouterProvider } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import HomePage from "./pages/homePage";
import ErrorPage from "./pages/errorPage";
import Dashboard from "./pages/dashboard";
import ErrorBoundary from "./pages/errorBoundary";
import Root from "./components/root";
import "./index.css";

const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "error",
        element: <ErrorPage />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
    errorElement: <ErrorBoundary />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
