import {
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  USER_SIGNUP_FAIL,
  USER_GETALL_REQUEST,
  USER_GETALL_SUCCESS,
  USER_GETALL_FAIL,
  USER_GETONE_REQUEST,
  USER_GETONE_SUCCESS,
  USER_GETONE_FAIL,
  MOVIE_ADD_REQUEST,
  MOVIE_ADD_SUCCESS,
  MOVIE_ADD_FAIL,
  MOVIE_DELETE_REQUEST,
  MOVIE_DELETE_SUCCESS,
  MOVIE_DELETE_FAIL,
} from "../constants/userConstants";

import api from "../../shared/api";

export const createUser = (user) => async (dispatch) => {
  try {
    dispatch({ type: USER_SIGNUP_REQUEST });

    const data = await api.signup(user);

    dispatch({ type: USER_SIGNUP_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_SIGNUP_FAIL, payload: error.message });
  }
};

export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({ type: USER_GETALL_REQUEST });

    const data = await api.getUsers();

    dispatch({ type: USER_GETALL_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_GETALL_FAIL, payload: error.message });
  }
};
export const getOneUser = (name) => async (dispatch) => {
  try {
    dispatch({ type: USER_GETONE_REQUEST });

    const data = await api.getUser(name);

    dispatch({ type: USER_GETONE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: USER_GETONE_FAIL, payload: error.message });
  }
};

export const appendMovie = (name, movie) => async (dispatch) => {
  try {
    dispatch({ type: MOVIE_ADD_REQUEST });

    const data = await api.addMovie(name, movie);

    dispatch({ type: MOVIE_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: MOVIE_ADD_FAIL, payload: error.message });
  }
};

export const deleteOneMovie = (name, title) => async (dispatch) => {
  try {
    dispatch({ type: MOVIE_DELETE_REQUEST });

    const data = await api.deleteMovie(name, title);

    dispatch({ type: MOVIE_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: MOVIE_DELETE_FAIL, payload: error.message });
  }
};

// persisting login state

export const setUser = (user) => ({
  type: "SET_USER",
  payload: user,
});
