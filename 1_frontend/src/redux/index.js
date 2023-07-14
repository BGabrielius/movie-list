import { combineReducers } from "redux";

import {
  userSignupReducer,
  getUsersReducer,
  getUserReducer,
  addMovieReducer,
  deleteMovieReducer,
  setUserReducer,
} from "./reducers/userReducers.js";

export const reducer = combineReducers({
  signup: userSignupReducer,
  getall: getUsersReducer,
  getone: getUserReducer,
  addmovie: addMovieReducer,
  delete: deleteMovieReducer,
  user: setUserReducer,
});
