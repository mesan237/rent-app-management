import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../slices/usersApiSlice";
import { logout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Typography } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import { blue, teal } from "@mui/material/colors";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function Header() {
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
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
      {userInfo ? <MenuItem onClick={handleLogout}>Logout</MenuItem> : null}
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
        }}
      >
        cite Mockpa
      </Typography>

      <Box
        sx={{
          alignSelf: "flex-end",
          marginInlineEnd: "20px",
          paddingBlockStart: "2px",
          flexDirection: "row",
          // gap: 2,
        }}
      >
        <Box sx={{ display: { xs: "none", md: "flex", gap: 3 } }}>
          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="primary"
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Button
            id="demo-customized-button"
            // aria-controls={open ? 'demo-customized-menu' : undefined}
            aria-haspopup="true"
            // aria-expanded={open ? 'true' : undefined}
            variant="text"
            disableElevation
            startIcon={
              <Avatar sx={{ bgcolor: teal[100], color: teal[600] }}>
                <PersonRoundedIcon />
              </Avatar>
            }
            onClick={handleProfileMenuOpen}
            endIcon={<KeyboardArrowDownIcon />}
            sx={{ fontWeight: "bold" }}
          >
            {userInfo ? userInfo.name : ""}
          </Button>
          {/* <ListItemButton
          onClick={handleProfileMenuOpen}
          sx={{ width: "100px", px: 0 }}
        >
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
              <PersonRoundedIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={userInfo ? userInfo.name : ""} />
        </ListItemButton> */}
        </Box>
        {renderMenu}
      </Box>
    </>
  );
}

export default Header;
