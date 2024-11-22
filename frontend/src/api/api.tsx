import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
  // headers: { Authorization: "Bearer your-token-here" },
});
