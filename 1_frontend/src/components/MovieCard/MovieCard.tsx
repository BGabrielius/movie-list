"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion } from "framer-motion";

import {
  appendMovie,
  deleteOneMovie,
} from "../../redux/actions/userActions.js";

const API_IMG = "https://image.tmdb.org/t/p/w500/";

import styles from "./MovieCard.module.css";

interface Props {
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  actionType: "add" | "remove";
}

const MovieCard: React.FC<Props> = ({
  title,
  poster_path,
  overview,
  release_date,
  vote_average,
  actionType,
}) => {
  // -- State
  const [expand, setExpand] = useState<boolean>(false);
  const [filled, setFilled] = useState<boolean>(false);
  const [focus, setFocus] = useState<boolean>(false);

  // -- Selector/Dispatch
  const userState = useSelector((state: any) => state.user);
  const addFromDB = useSelector((state: any) => state.addmovie);
  const removeFromDB = useSelector((state: any) => state.delete);

  const dispatch = useDispatch<any>();

  // -- Refs
  const cardRef = useRef<HTMLDivElement>(null);

  // Side effects
  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setFocus(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // -- Functions
  const handleMovieEvents = (e: any) => {
    setFocus(true);
    e.stopPropagation();
    if (actionType === "add") {
      dispatch(
        appendMovie(userState.name, {
          title: title,
          poster_path: poster_path,
          overview: overview,
          release_date: release_date,
          vote_average: vote_average,
        })
      );
    } else if (actionType === "remove") {
      dispatch(deleteOneMovie(userState.name, title));
    }
  };
  return (
    <>
      <motion.div
        className={`${styles.container} ${
          expand ? styles.expand : styles.shrink
        }`}
        onClick={() => setExpand(expand === true ? false : true)}
        ref={cardRef}
      >
        <img src={poster_path ? API_IMG + poster_path : ""} />
        <div className={styles.summaryContainer}>
          <h3>{title}</h3>
          {expand && (
            <>
              <p>{overview}</p>
              {userState?.loggedIn && (
                <>
                  <motion.span
                    onClick={handleMovieEvents}
                    className={styles.heartIcon}
                    onHoverStart={() => setFilled(true)}
                    onHoverEnd={() => setFilled(false)}
                  >
                    {actionType === "add" ? (
                      !filled ? (
                        <AiOutlineHeart />
                      ) : (
                        <AiFillHeart />
                      )
                    ) : actionType === "remove" ? (
                      filled ? (
                        <AiOutlineHeart />
                      ) : (
                        <AiFillHeart />
                      )
                    ) : (
                      <AiOutlineHeart />
                    )}
                  </motion.span>
                </>
              )}
            </>
          )}
          <span className={styles.cardFooter}>
            <p className={styles.voteAverage}>{vote_average}</p>
            {(addFromDB || removeFromDB) && expand && focus && (
              <p
                style={{
                  color: "#987726",
                }}
              >
                {actionType === "add" && addFromDB
                  ? addFromDB.user || addFromDB.error || addFromDB.loading || ""
                  : actionType === "remove" && removeFromDB
                  ? removeFromDB.user ||
                    removeFromDB.error ||
                    removeFromDB.loading ||
                    ""
                  : ""}
              </p>
            )}
            <p>{release_date}</p>
          </span>
        </div>
      </motion.div>
    </>
  );
};

export default MovieCard;
