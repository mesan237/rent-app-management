import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css";
import App from "./App";
import Dashboard from "./Pages/Dashboard";
import ErrorPage from "./ErrorPage";
import ListeChambres from "./components/ListeChambres";
import Depenses from "./Pages/Depenses";
import LoginForm from "./components/Forms/LoginForm";
import Historiques from "./Pages/HistoryLog";
import Versement from "./Pages/Versement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "locataires",
        element: <ListeChambres />,
      },
      {
        path: "depenses",
        element: <Depenses />,
      },
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "/historiques",
        element: <Historiques />,
      },
      {
        path: "/versement",
        element: <Versement />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);