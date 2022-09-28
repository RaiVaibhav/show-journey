import axios from "axios";

const apiClient =  axios.create({
  baseURL: "https://dev.greatescape.co/",
  headers: {
    "Content-type": "application/json",
    "Authorization": `Bearer ${process.env.REACT_APP_API_TOKEN}`
  }
});
export default apiClient;