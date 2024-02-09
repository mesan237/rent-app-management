import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store";
import "./index.css";
import App from "./App";
import Dashboard from "./Pages/Dashboard";
import ErrorPage from "./ErrorPage";
import ListeChambres from "./components/ListeChambres";
import Depenses from "./Pages/Depenses";
import LoginForm from "./components/Forms/LoginForm";
import Historiques from "./Pages/historiques";
import Versement from "./Pages/Versement";
import ToggleColorMode from "./components/ToggleColorMoed";
import UserProfile from "./Pages/userProfile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ToggleColorMode />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
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
        path: "/historiques",
        element: <Historiques />,
      },
      {
        path: "/versement",
        element: <Versement />,
      },
      {
        path: "/profile",
        element: <UserProfile />,
      },
    ],
  },
  {
    path: "login",
    element: <LoginForm />,
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
