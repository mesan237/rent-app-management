// DarkModeToggle.js
import React, { useContext, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "./ToggleColorMoed"; // Import the ColorModeContext
import { Typography } from "@mui/material";

const DarkMode = () => {
  const colorMode = useContext(ColorModeContext);

  useEffect(() => {
    // You can also apply any additional styles or theme changes here
  }, [colorMode.mode]);

  return (
    <>
      mode {colorMode.mode === "dark" ? " sombre" : "clair"}
      <IconButton onClick={colorMode.toggleColorMode} color="inherit">
        {colorMode.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </>
  );
};

export default DarkMode;
