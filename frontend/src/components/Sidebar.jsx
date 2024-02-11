import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { categories } from "../utils/constants";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";
import { Link as RouterLink } from "react-router-dom";
import { useState } from "react";
import { IconButton, Toolbar } from "@mui/material";
import { useTheme } from "@emotion/react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import MenuIcon from "@mui/icons-material/Menu";

const drawerWidth = 240;

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
  // borderRight:
  //   theme.palette.mode === "dark" ? "12px solid #121212" : "10px solid #fff",
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
  backgroundImage: "none",
  backgroundColor: theme.palette.mode === "dark" ? "#19191d" : "#fff",
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
  backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#fff",
  borderRight:
    theme.palette.mode === "dark" ? "1px solid #121212" : "1px solid #fff",
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

export default function Sidebar({ setIntendedDestination }) {
  const open = true;
  const [selectedCategory, setSelectedCategory] = useState(
    localStorage.getItem("selectedCategory") || "Dashboard"
  );

  React.useEffect(() => {
    // Save the active link to localStorage whenever it changes
    localStorage.setItem("selectedCategory", selectedCategory);
  }, [selectedCategory]);

  function handleActiveButton(categoryName) {
    setSelectedCategory(categoryName);
  }

  const theme = useTheme();
  const [openD, setOpenD] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpenD(true);
  };

  const handleDrawerClose = () => {
    setOpenD(false);
  };

  return (
    // <ThemeProvider theme={theme}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      <AppBar
        open={openD}
        sx={{
          // backgroundColor: "#fff",
          boxShadow: 0,
        }}
        color="secondary"
      >
        <Toolbar
          sx={{
            flexDirection: "row",
            alignItems: "center",
            padding: "0 1rem",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(openD && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Header />
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={openD}
        PaperProps={{
          sx: {
            fontWeight: "bold",
            px: openD ? 1.5 : 1,
          },
        }}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
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
                color:
                  selectedCategory === category.name ? "primary" : "secondary",
                transition: "transform 0.5s ease-in-out",
              }}
            >
              <ListItemButton
                onClick={() => {
                  handleActiveButton(category.name);
                  setIntendedDestination(category.link);
                }}
                component={RouterLink}
                to={category.link}
                sx={{
                  minHeight: 48,
                  justifyContent: openD ? "initial" : "center",
                  px: 2.5,
                  py: 1.6,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: openD ? 4 : "auto",
                    justifyContent: "center",
                    color:
                      selectedCategory === category.name
                        ? "primary"
                        : "secondary",
                  }}
                >
                  {category.icon}
                </ListItemIcon>
                <ListItemText
                  primary={category.name}
                  sx={{ opacity: openD ? 1 : 0 }}
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
    // </ThemeProvider>
  );
}
