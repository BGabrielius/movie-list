"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";

import { getOneUser, setUser } from "../../redux/actions/userActions.js";

import styles from "./page.module.css";

import MovieCard from "@/components/MovieCard/MovieCard";
import Dropdown from "@/components/Dropdown/Dropdown";
import Login from "@/components/Login/Login";
import Info from "@/components/Info/Info";

type User = {
  name: string;
  loggedIn: boolean;
};

const API_URL = `https://api.themoviedb.org/3/trending/movie/week?api_key=5efc563e5cf61ad194ec08ade79f2a63&page=1`;
const API_SEARCH =
  "https://api.themoviedb.org/3/search/movie?api_key=5efc563e5cf61ad194ec08ade79f2a63&query=";

const fetchMovies = async (host: string) => {
  const data = await axios.get(host);

  return data;
};

export default function Home() {
  // -- State
  const [movies, setMovies] = useState<any>([]);
  const [host, setHost] = useState<string>(API_URL);
  const [message, setMessage] = useState<string>("");
  const [showLogin, setShowLogin] = useState<boolean>(false);

  const [cardActionType, setCardActionType] = useState<"add" | "remove">("add");
  const [type, setType] = useState<"api" | "db">("api");

  // --- input states
  const [searchValue, setSearchValue] = useState<string>("");

  // -- Selector/Dispatch
  const dataFromDb = useSelector((state: any) => state.getone);
  const userState = useSelector((state: any) => state.user);
  const dispatch = useDispatch<any>();

  // -- Query
  const { data, isLoading } = useQuery(
    ["movies", host],
    () => fetchMovies(host),
    {
      staleTime: 300,
      onError: () => {
        if (searchValue) {
          setMessage("Sorry, there are no movies that would match your search");
        } else {
          setMessage("Sorry, an error has accured while fetching");
        }
      },
      retry: 0,
    }
  );

  // -- Side effects
  useEffect(() => {
    if (dataFromDb.user && type === "db") {
      setMessage("");
      setMovies(dataFromDb.user);
    }
    if (data && type === "api") {
      setMessage("");
      setMovies(data.data.results);
      if (!data.data.results[0]) {
        if (searchValue === "") {
          setMessage("First you gotta type in something, just sayin");
        } else if (searchValue !== "") {
          setMessage("Sorry, there are no movies that would match your search");
        }
      }
    } else if (isLoading) setMessage("Loading...");
    const items: string | null = localStorage.getItem("user");
    if (items) {
      const parsedItems: User = JSON.parse(items);
      dispatch(setUser(parsedItems));
    }
    if (userState?.loggedIn) setShowLogin(false);
  }, [data, movies, isLoading, dataFromDb, type, userState?.loggedIn]);

  // -- Functions
  const movieSearch = (e: any) => {
    e.preventDefault();

    setType("api");
    setCardActionType("add");
    setHost(API_SEARCH + searchValue);
  };

  const handleOnChange = (e: any) => {
    if (e.target.value) {
      setSearchValue(e.target.value);
    } else if (!e.target.value) {
      setSearchValue(e.target.value);
      setHost(API_URL);
    }
  };
  const filterByFavoritedLists = (name: string) => {
    if (name === "Make a list") {
      setShowLogin(true);
    } else if (name === userState?.name) {
      setType("db");
      setCardActionType("remove");
      dispatch(getOneUser(name));
      setShowLogin(false);
    } else {
      setType("db");
      setCardActionType("add");
      dispatch(getOneUser(name));
      setShowLogin(false);
    }
  };
  const showTrending = () => {
    setType("api");
    setCardActionType("add");
    setHost(API_URL);
  };

  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <h2>Awesome Headline</h2>
          <div className={styles.filterContainer}>
            <form onSubmit={(e: any) => movieSearch(e)}>
              <input
                type="search"
                placeholder="Search for a movie..."
                onChange={(e: any) => handleOnChange(e)}
              />
              <input type="submit" value="Search" />
            </form>
            <Dropdown handleFilter={filterByFavoritedLists} type={type} />
            <p className={styles.trending} onClick={() => showTrending()}>
              Trending
            </p>
          </div>
          {showLogin && <Login />}
          {message && <p>{message}</p>}
        </div>
        {((dataFromDb?.user?.length === 0 && movies.length === 0) ||
          dataFromDb?.user === null) &&
        type === "db" ? (
          <Info />
        ) : (
          <div className={styles.moviesWrapper}>
            {movies.map((movie: any, index: number) => (
              <MovieCard key={index} {...movie} actionType={cardActionType} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
