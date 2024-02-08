import { createSlice } from "@reduxjs/toolkit";
import { LoginRequest, KeepLogin } from "../utils/login";

export const identitySlice = createSlice({
  name: "identity",
  initialState: {
    token: "",
    id: 0,
    error: "",
    loading: false,
    status: false,
    init: false,
  },
  reducers: {
    setJWT: (state, action) => {
      state.token = action.payload;
    },
    setID: (state, action) => {
      state.id = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setInit: (state, action) => {
      state.init = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginRequest.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(LoginRequest.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.token = action.payload.token;
        localStorage.setItem("id", action.payload.id);
        localStorage.setItem("token", action.payload.token);
        state.error = null;
        state.loading = false;
        if (action.payload.id === 0 && action.payload.token === "") {
          state.status = false;
        } else {
          state.status = true;
        }
      })
      .addCase(LoginRequest.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(KeepLogin.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(KeepLogin.fulfilled, (state, action) => {
        state.id = action.payload.id;
        state.token = action.payload.token;
        state.error = null;
        state.loading = false;
        if (action.payload.id === 0 && action.payload.token === "") {
          state.status = false;
        } else {
          state.status = true;
        }
      })
      .addCase(KeepLogin.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});
export const { setID, setJWT, setStatus, setInit } = identitySlice.actions;
export default identitySlice.reducer;
