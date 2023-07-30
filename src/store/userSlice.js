import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    userInfo: null
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    }
  }
});

export const userActions = userSlice.actions;
export default userSlice;
