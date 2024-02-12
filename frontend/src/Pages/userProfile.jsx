import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import PropTypes from "prop-types";
import { Box, styled } from "@mui/system";
import { Button } from "@mui/base/Button";
import { Input as BaseInput, inputClasses } from "@mui/base/Input";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { FormHelperText, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { StyledButton } from "../components/Buttons/StyledButton";

const Input = React.forwardRef(function CustomInput(props, ref) {
  const { slots, ...other } = props;
  return (
    <BaseInput
      slots={{
        root: InputRoot,
        input: InputElement,
        ...slots,
      }}
      {...other}
      ref={ref}
    />
  );
});

Input.propTypes = {
  /**
   * The components used for each slot inside the InputBase.
   * Either a string to use a HTML element or a component.
   * @default {}
   */
  slots: PropTypes.shape({
    input: PropTypes.elementType,
    root: PropTypes.elementType,
    textarea: PropTypes.elementType,
  }),
};

const UserProfile = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.login);
  const [updateProfile, { loading: loadingProfile }] =
    useUpdateProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo, userInfo.name, userInfo.email]);

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log("submitHandler", userInfo._id);
    if (password !== confirmPassword) {
      console.log("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
      } catch (error) {
        console.log("errreeuuur", error?.data?.message || error.error);
      }
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword({
      showPassword: !showPassword,
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <form
        sx={{
          position: "relative",
        }}
        onSubmit={submitHandler}
      >
        <Box
          sx={{
            display: "flex",
            // flexDirection: { xs: "row", sm: "column" },
            padding: "1rem",
            width: "25rem",

            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: "2rem", fontWeight: "bold" }}>
            Profil de l'utilisateur
          </Typography>
          <Box>
            <FormHelperText id="outlined-weight-helper-text">
              Name
            </FormHelperText>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="montant"
              type="text"
              name="name"
            />
          </Box>
          <Box>
            <FormHelperText id="outlined-weight-helper-text">
              Email
            </FormHelperText>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="montant"
              type="email"
              name="email"
            />
          </Box>
          <Box>
            <FormHelperText id="outlined-weight-helper-text">
              Mot de passe
            </FormHelperText>
            <Input
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment>
                  <IconButton
                    size="small"
                    aria-label="toggle password visibility"
                    // onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>
          <Box>
            <FormHelperText id="outlined-weight-helper-text">
              Confirmation du Mot de passe
            </FormHelperText>
            <Input
              id="outlined-adornment-confirm-password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              endAdornment={
                <InputAdornment>
                  <IconButton
                    size="small"
                    aria-label="toggle password visibility"
                    // onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? (
                      <VisibilityOff fontSize="small" />
                    ) : (
                      <Visibility fontSize="small" />
                    )}
                  </IconButton>
                </InputAdornment>
              }
            />
          </Box>

          <Box>
            <StyledButton type="submit" disabled={loadingProfile}>
              Modifier
            </StyledButton>
          </Box>
          {loadingProfile && <CircularProgress />}
        </Box>
      </form>
    </Box>
  );
};

const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0059B2",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const InputRoot = styled("div")(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-weight: 400;
  border-radius: 8px;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[500]};
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
  box-shadow: 0px 2px 4px ${
    theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"
  };
  display: flex;
  align-items: center;
  justify-content: center;


  &.${inputClasses.focused} {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${
      theme.palette.mode === "dark" ? blue[600] : blue[200]
    };
  }

  &:hover {
    border-color: ${blue[400]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`
);

const InputElement = styled("input")(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.5;
  flex-grow: 1;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  background: inherit;
  border: none;
  border-radius: inherit;
  padding: 8px 12px;
  outline: 0;
`
);

const IconButton = styled(Button)(
  ({ theme }) => `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: inherit;
  cursor: pointer;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[700]};
  `
);

const InputAdornment = styled("div")`
  margin: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export default UserProfile;
