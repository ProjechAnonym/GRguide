import axios from "axios";
import { config } from "../assets/config";
export function checkPassword(password, confirm) {
  if (password === confirm) {
    return true;
  } else {
    return false;
  }
}
export async function postUserMessage(username, password, email) {
  const formdata = new FormData();
  formdata.append("username", username);
  formdata.append("password", password);
  formdata.append("email", email);

  const response = await axios.postForm(`${config.API}/register`, formdata);
  if (response.data.status) {
    return true;
  } else {
    return false;
  }
}
