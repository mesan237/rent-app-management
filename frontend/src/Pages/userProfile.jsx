import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";

const UserProfile = () => {
  const [password, setPassword] = useState("");
  const [confirmPasswod, setConfirmPasswod] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.login);

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo.name, userInfo.email]);

  const submitHandler = (e) => {
    e.preventdefault();
    console.log("submitHandler");
  };

  return <div>Profile</div>;
};

export default UserProfile;
