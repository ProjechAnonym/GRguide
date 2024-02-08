import axios from "axios";
import { config } from "../assets/config";
export async function postUser(username) {
  console.log(username);
  const axiosConfig = {
    headers: {
      domain: window.location.host,
      scheme: window.location.protocol,
    },
  };
  const formData = new FormData();
  formData.append("username", username);
  const res = await axios.postForm(
    `${config.API}/retrievepassword`,
    formData,
    axiosConfig
  );
  if (res.data.status) {
    return true;
  } else {
    return false;
  }
}

export async function resetPassword(password, id, token) {
  const formData = new FormData();
  formData.append("password", password);
  const res = await axios.postForm(
    `${config.API}/editpassword/${id}/${token}`,
    formData
  );
  if (res.data.status) {
    return true;
  } else {
    return false;
  }
}
