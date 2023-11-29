import React from "react";

import "./App.css";
import { Box } from "@mui/material";
import LoginForm from "./components/Forms/LoginForm";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Box className="App">
      <Box className="app-container">
        {/* <LoginForm /> */}
        <Sidebar />
      </Box>
    </Box>
  );
}

export default App;
