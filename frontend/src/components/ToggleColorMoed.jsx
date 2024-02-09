// ToggleColorMode.js
import React, { useMemo, useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import App from "../App";
import { grey } from "@mui/material/colors";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

const ToggleColorMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                // palette values for light mode
                primary: {
                  main: "#2196f3",
                  light: "#757ce8",
                  // main: '#3f50b5',
                  dark: "#002884",
                  contrastText: "#fff",
                },
                secondary: {
                  main: "#f0f7ff",
                },
                text: {
                  primary: grey[900],
                  secondary: grey[800],
                },
              }
            : {
                // palette values for dark mode
                primary: {
                  main: "#2196f3",
                  dark: "#17171a",
                },
                secondary: {
                  main: "#19191d",
                },
                background: {
                  default: "#fff",
                  paper: "#17171a",
                },
                text: {
                  primary: grey[50],
                  secondary: grey[200],
                },
              }),
        },
        breakpoints: {
          values: {
            laptop: 1024,
            tablet: 640,
            mobile: 0,
            desktop: 1280,
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        {/* <DarkMode /> */}
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ToggleColorMode;
