import axios from "axios";

const apiClient =  axios.create({
  baseURL: "https://dev.greatescape.co/",
  headers: {
    "Content-type": "application/json",
    "Authorization": "Bearer progtest"
  }
});
export default apiClient;