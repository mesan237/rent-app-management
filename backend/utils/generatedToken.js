import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  const token = jwt.sign({ user: userId }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
  // console.log("user id", userId);
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export default generateToken;
