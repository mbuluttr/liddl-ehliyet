import { configureStore } from "@reduxjs/toolkit";
import examReducer from "../slice/examSlice";

export default configureStore({
  reducer: {
    exam: examReducer,
  },
});
