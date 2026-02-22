import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // send cookies (access/refresh tokens)
});

export default api;
