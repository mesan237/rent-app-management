import React, { useEffect, useState } from "react";

import "./App.css";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.login);
  const destination = useSelector((state) => state.navigation.destination);

  console.log(destination);

  useEffect(() => {
    if (userInfo) {
      navigate(destination || "/dashboard");
    } else {
      navigate("/login");
    }
  }, [userInfo, destination, navigate]);

  return (
    <Box className="App" sx={{ backgroundColor: "secondary.main" }}>
      <Box className="app-container" sx={{ backgroundColor: "secondary.main" }}>
        <Sidebar />
      </Box>
    </Box>
  );
}

export default App;
