import React from "react";

import "./App.css";
import { Sidebar } from "./components";
import { Box } from "@mui/material";

function App() {
  return (
    <Box className="App">
      <Box className="app-container">
        <Sidebar />
      </Box>
    </Box>
  );
}

export default App;
