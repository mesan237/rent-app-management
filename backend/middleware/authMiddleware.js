import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from "./asyncHandler.js";

// function to protect routes
const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      req.user = await User.findById(decoded.user).select("-password");
      // console.log("try", decoded.userId);
      next();
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error("unauthorized token");
    }
  } else {
    res.status(401);
    throw new Error("Failed to fetch token");
  }
});

// function to protect routes
const admin = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("unauthorized as admin");
  }
};

export { admin, protect };
