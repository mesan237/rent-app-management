import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generatedToken.js";

// @desc Auth user & get token
// @route POST api/users/auth
// Aaccess public
const authUser = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.passwordChecking(password))) {
    generateToken(res, user._id);

    // console.log(res.get("Set-Cookie"));
    res.json({
      _id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("Invalid password or email");
  }
});
// @desc register user
// @route POST api/users/
// Aaccess public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(401);
    throw new Error(" this email already exist ");
  } else {
    const user = await User.create({
      name,
      email,
      password,
    });
    if (user) {
      generateToken(res, user._id);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    }
  }
});
// @desc Logout user / clear cookies
// @route POST api/users/logout
// Aaccess Private
const logoutUser = asyncHandler(async (req, res) => {
  // console.log(req.cookies.jwt);
  res.cookie("jwt", "", {
    httpOnly: true,
    expiresIn: Date.now(0),
  });

  res.status(200).json("user logged out successfully !!!");
});
// @desc get user profile
// @route GET api/users/profile
// Aaccess Public
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new error("user not found");
  }
});
// @desc update user profile
// @route PUT api/users/profile
// Aaccess Public
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password || user.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(400);
    throw new error("user not found");
  }
});
// @desc update user profile
// @route PUT api/users/profile
// Aaccess Public
const deleteUser = asyncHandler(async (req, res) => {
  res.json(" user profile deleted");
});
// @desc update user profile
// @route PUT api/users/profile
// Aaccess Public
const getUsers = asyncHandler(async (req, res) => {
  res.json("delete user profile");
});
// @desc update user profile
// @route PUT api/users/profile
// Aaccess Public
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  // console.log(req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(400);
    throw new Error("Utilisateur pas trouvé");
  }
});
// @desc update user profile
// @route PUT api/users/profile
// Aaccess Public
const updateUser = asyncHandler(async (req, res) => {
  res.json(" user profile updated sucessfully");
});

export {
  authUser,
  registerUser,
  updateUser,
  getUserProfile,
  getUsers,
  updateUserProfile,
  deleteUser,
  logoutUser,
  getUserById,
};
