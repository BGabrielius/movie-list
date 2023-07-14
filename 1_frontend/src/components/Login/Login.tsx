"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { createUser } from "../../redux/actions/userActions.js";

import ReactSwitch from "react-switch";
import { BiSolidUserCircle } from "react-icons/bi";
import { RiLockPasswordLine } from "react-icons/ri";

import styled from "./Login.module.css";

type User = {
  name: string;
  password: string;
  type: "login" | "register";
};

const Login: React.FC = () => {
  // -- State
  const [user, setUser] = useState<User>({
    name: "",
    password: "",
    type: "login",
  });
  const [validationMessage, setValidationMessage] = useState<string>("");

  // -- Selector/Dispatch
  const {
    loading,
    user: message,
    error,
  } = useSelector((state: any) => state.signup);

  const dispatch = useDispatch<any>();

  // -- Side effects
  useEffect(() => {
    if (message === "Logged in") {
      localStorage.setItem(
        "user",
        JSON.stringify({ name: user.name, loggedIn: true })
      );
      window.location.reload();
    }
  }, [message]);

  // -- Functions
  const onSubmit = (e: any) => {
    setValidationMessage("");
    e.preventDefault();
    if (user.name.length < 3 || user.password.length < 3) {
      setValidationMessage(
        "Username/Password must consist of atleast 3 characters"
      );
    } else {
      dispatch(createUser(user));
    }
  };
  const selectLoginType = () => {
    setUser((prev) => ({
      ...prev,
      type: prev.type === "login" ? "register" : "login",
    }));
  };

  return (
    <div className={styled.wrapper}>
      <h4>Login</h4>
      <p className={styled.subText}>
        Note: username/password is <b>case sensitive.</b>
      </p>
      <form className={styled.container} onSubmit={(e: any) => onSubmit(e)}>
        <span
          style={
            validationMessage
              ? { border: "1px solid #f8c7c7" }
              : { border: "1px solid #485563" }
          }
          className={styled.inputContainer}
        >
          <BiSolidUserCircle style={{ scale: "1.4" }} />
          <input
            type="text"
            placeholder="Username"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </span>
        <span
          style={
            validationMessage
              ? { border: "1px solid #f8c7c7" }
              : { border: "1px solid #485563" }
          }
          className={styled.inputContainer}
        >
          <RiLockPasswordLine style={{ scale: "1.4" }} />
          <input
            type="password"
            placeholder="Password"
            autoComplete="off"
            onChange={(e) =>
              setUser((prev) => ({ ...prev, password: e.target.value }))
            }
          />
        </span>
        <span>
          <p>Register</p>
          <ReactSwitch
            checked={user.type === "login"}
            onChange={() => selectLoginType()}
            checkedIcon={false}
            uncheckedIcon={false}
            onColor="#888"
          />
          <p>Login</p>
        </span>
        <input
          type="submit"
          value="Log in"
          style={{ border: "1px solid #485563" }}
        />
      </form>

      {validationMessage ? (
        <p>{validationMessage}</p>
      ) : loading ? (
        <p>Loading...</p>
      ) : message ? (
        <p>{message}</p>
      ) : (
        error && <p>{error}</p>
      )}
    </div>
  );
};

export default Login;
