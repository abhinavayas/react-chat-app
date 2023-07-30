import { configureStore } from "@reduxjs/toolkit";
import systemsSlice from "./systemsSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    systems: systemsSlice.reducer
  }
});

export default store;
