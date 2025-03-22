import axios from "axios";

export const api = axios.create({
  baseURL: "http://168.119.1.250:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    // Authorization: "Bearer" + localStorage.getItem("token"),
  },
});
