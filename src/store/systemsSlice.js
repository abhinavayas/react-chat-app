import { createSlice } from "@reduxjs/toolkit";

const systemsSlice = createSlice({
  name: "systems",
  initialState: {
    width: 0,
    mobile: true
  },
  reducers: {
    setWidth(state, action) {
      state.width = action.payload;
      state.mobile = action.payload >= 1280 ? false : true;
    }
  }
});
export const systemsActions = systemsSlice.actions;
export default systemsSlice;
