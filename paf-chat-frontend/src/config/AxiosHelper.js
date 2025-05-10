import axios from "axios";
export const baseURL = "http://localhost:9090";
export const httpClient = axios.create({
  baseURL: baseURL,
});