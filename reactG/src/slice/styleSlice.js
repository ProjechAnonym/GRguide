import { createSlice } from "@reduxjs/toolkit";
export const styleSlice = createSlice({
  name: "style",
  initialState: {
    dark: false,
  },
  reducers: {
    setDark: (state) => {
      if (state.dark) {
        state.dark = false;
      } else {
        state.dark = true;
      }
    },
    resetDark: (state) => {
      if (state.dark) {
        state.dark = false;
      }
    },
  },
});
export const { setDark, resetDark } = styleSlice.actions;
export default styleSlice.reducer;
