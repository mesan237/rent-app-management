import React, { useContext } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { logout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, IconButton, Typography } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { blue } from "@mui/material/colors";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { ColorModeContext } from "../ToggleColorMoed"; // Import the ColorModeContext
import { intendedDestination } from "../../slices/navigationSlices/NavigationSlices";

function Header() {
  const colorMode = useContext(ColorModeContext);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [logoutApiCall] = useLogoutMutation();

  const handleLogout = async () => {
    handleMenuClose();
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  const handleProfile = async () => {
    handleMenuClose();
    try {
      intendedDestination({ destination: "/profile" });
      handleMenuClose();
    } catch (error) {
      console.log(error);
    }
  };

  const { userInfo } = useSelector((state) => state.login);
  // console.log(userInfo.name);
  const menuId = "menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfile} component={RouterLink} to="/profile">
        Profile
      </MenuItem>
      {userInfo ? (
        <MenuItem onClick={handleLogout}>Se deconnecter</MenuItem>
      ) : null}
    </Menu>
  );

  return (
    <>
      <Typography
        variant="h1"
        noWrap
        component="div"
        sx={{
          fontFamily: "Monoton !important",
          fontSize: "1.5rem",
          textTransform: "uppercase",
          fontWeight: "bold",
          wordSpacing: "10px",
          letterSpacing: "1px",
          marginRight: "auto",
        }}
        color="primary.main"
      >
        cite Mockpa
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignSelf: "flex-end",
          marginInlineEnd: "20px",
          paddingBlockStart: "2px",
        }}
      >
        <Box sx={{ display: "flex", gap: 1 }}>
          <Typography sx={{ alignSelf: "center" }}>
            {colorMode.mode === "dark" ? " sombre" : "clair"}
          </Typography>
          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {colorMode.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon color="primary" />
            )}
          </IconButton>
          <Button
            id="demo-customized-button"
            // aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            // aria-expanded={open ? 'true' : undefined}
            variant="text"
            disableElevation
            startIcon={
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonRoundedIcon />
              </Avatar>
            }
            onClick={handleProfileMenuOpen}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ fontWeight: "bold" }}
          >
            {userInfo ? userInfo.name : ""}
          </Button>
        </Box>
        {renderMenu}
      </Box>
    </>
  );
}

export default Header;
