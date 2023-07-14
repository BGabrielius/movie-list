import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "./index.js";

export const store = configureStore({
  reducer,
});
