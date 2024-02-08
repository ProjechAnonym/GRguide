import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { config } from "../assets/config";
export const LoginRequest = createAsyncThunk(
  "identity/LoginRequest",
  async ([username, password]) => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    let response = await axios.postForm(`${config.API}/login`, formData);
    return response.data;
  }
);
export const KeepLogin = createAsyncThunk("identity/KeepLogin", async () => {
  if (
    localStorage.getItem("id") !== null &&
    localStorage.getItem("token") !== null
  ) {
    const id = localStorage.getItem("id");
    const token = localStorage.getItem("token");
    if (id === 0 && token === "") {
      localStorage.removeItem("id");
      localStorage.removeItem("token");
      throw { valid: false, id: 0, token: "" };
    } else {
      const validState = await axios.get(
        `${config.API}/user/valid/${id}/${token}`,
        { headers: { Authorization: token } }
      );
      if (validState.status === 200) {
        return {
          valid: true,
          id: localStorage.getItem("id"),
          token: localStorage.getItem("token"),
        };
      } else {
        localStorage.removeItem("id");
        localStorage.removeItem("token");
        throw { valid: false, id: 0, token: "" };
      }
    }
  } else {
    throw { valid: false, id: 0, token: "" };
  }
});
