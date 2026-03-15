import axios from "axios";

const baseURL =
  import.meta.env.MODE === "production"
    ? "/api"
    : "http://127.0.0.1:8000/api";

export const api = axios.create({ baseURL });

export const getDepartmentInfo = () => api.get("/department/");
