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

export const userSignupReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_SIGNUP_REQUEST:
      return { loading: true };
    case USER_SIGNUP_SUCCESS:
      return { loading: false, user: action.payload };
    case USER_SIGNUP_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const getUsersReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_GETALL_REQUEST:
      return { loading: true };
    case USER_GETALL_SUCCESS:
      return { loading: false, user: action.payload };
    case USER_GETALL_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const getUserReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_GETONE_REQUEST:
      return { loading: true };
    case USER_GETONE_SUCCESS:
      return { loading: false, user: action.payload };
    case USER_GETONE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const addMovieReducer = (state = {}, action) => {
  switch (action.type) {
    case MOVIE_ADD_REQUEST:
      return { loading: true };
    case MOVIE_ADD_SUCCESS:
      return { loading: false, user: action.payload };
    case MOVIE_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const deleteMovieReducer = (state = {}, action) => {
  switch (action.type) {
    case MOVIE_DELETE_REQUEST:
      return { loading: true };
    case MOVIE_DELETE_SUCCESS:
      return { loading: false, user: action.payload };
    case MOVIE_DELETE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
export const setUserReducer = (state = null, action) => {
  if (action.type === "SET_USER") {
    return action.payload;
  }
  return state;
};
