import * as React from "react";
import {
  ThemeProvider,
  createTheme,
  styled,
  useTheme,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { categories } from "../utils/constants";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import PropTypes from "prop-types";
import { Link as RouterLink, MemoryRouter } from "react-router-dom";
import Link from "@mui/material/Link";
import { useState } from "react";
import { blue, teal } from "@mui/material/colors";

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: "#00bfa5",
      // contrastText: "#E9DB5D",
    },
    secondary: {
      main: "#1de9b6",
      // contrastText: "#242105",
    },
  },
});

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Sidebar() {
  const open = true;
  const [selectedCategory, setSelectedCategory] = useState("Dashboard");

  function handleActiveButton(categoryName) {
    setSelectedCategory(categoryName);
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          // flexDirection: "column",
          justifyContent: "space-around",
        }}
      >
        {/*content */}
        {/* <CssBaseline /> */}
        <AppBar
          open={open}
          sx={{
            backgroundColor: "#fff",
            boxShadow: 0,
            color: teal[600],
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Header />
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
          PaperProps={{
            sx: {
              backgroundColor: "#fff",
              color: "#000",
              fontWeight: "bold",
              borderRight: "1px solid #fff",
              px: 2.5,
            },
          }}
        >
          <DrawerHeader>
            {/* <Typography
              variant="h1"
              noWrap
              component="div"
              sx={{
                fontFamily: "Monoton !important",
                fontSize: "1.5rem",
                textTransform: "uppercase",
                fontWeight: "500",
                wordSpacing: "10px",
                letterSpacing: "1px",
              }}
            >
              cite Mockpa
            </Typography> */}
            <Divider />
            {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton> */}
          </DrawerHeader>
          {/* <Divider /> */}
          <List>
            {categories.map((category) => (
              <ListItem
                className={` ${
                  selectedCategory === category.name && "selected-category"
                }`}
                key={category.name}
                disablePadding
                // {selectedCategory === category.name && sx={{...selectCategory}}}
                sx={{
                  display: "block",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  backgroundColor:
                    selectedCategory === category.name ? "primary.main" : null,
                  color: selectedCategory === category.name ? "white" : null,
                  transition: "transform 0.5s ease-in-out",
                }}
              >
                <ListItemButton
                  onClick={() => handleActiveButton(category.name)}
                  component={RouterLink}
                  to={category.link}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    py: 1.6,
                    // my: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                      color:
                        selectedCategory === category.name ? "#fff" : "#000",
                      // #009688
                    }}
                  >
                    {category.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={category.name}
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1 }}>
          <DrawerHeader />
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
