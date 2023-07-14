"use client";

import React from "react";
import { useSelector } from "react-redux";
import styles from "./Header.module.css";

const Header: React.FC = () => {
  const userState = useSelector((state: any) => state.user);
  return (
    <header className={styles.header}>
      <h1 onClick={() => window.location.reload()}>movie-list</h1>
      {userState ? (
        <span>
          <p>Signed in as:</p>
          <b> {userState.name}</b>
        </span>
      ) : (
        ""
      )}
    </header>
  );
};

export default Header;
