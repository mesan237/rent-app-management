import React, { useEffect, useState } from "react";

import "./App.css";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.login);

  const [intendedDestination, setIntendedDestination] = useState(null);
  // console.log("redirect");

  useEffect(() => {
    if (userInfo) {
      navigate(intendedDestination || "/dashboard");
    } else {
      navigate("/login");
    }
  }, [userInfo, intendedDestination, navigate]);

  return (
    <Box className="App" sx={{ backgroundColor: "secondary.main" }}>
      <Box className="app-container" sx={{ backgroundColor: "secondary.main" }}>
        <Sidebar setIntendedDestination={setIntendedDestination} />
      </Box>
    </Box>
  );
}

export default App;
