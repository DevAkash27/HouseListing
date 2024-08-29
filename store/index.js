import { configureStore } from "@reduxjs/toolkit";
import houseReducer from "../redux/apiSlice";

export const store = configureStore({
  reducer: {
    houses: houseReducer, // Add more reducers here as you create them
  },
});
