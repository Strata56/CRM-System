import axios from "axios";

const api = axios.create({
  baseURL: "https://crm-system-2rjq.onrender.com/api",
});

export default api;