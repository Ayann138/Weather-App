import axios from "axios";

/**
 * Same-origin Axios client. Browser calls go through Next.js API routes
 * to avoid CORS with third-party weather/geocoding APIs.
 */
export const weatherApi = axios.create({
  baseURL: "/api",
  timeout: 20_000,
  headers: {
    Accept: "application/json",
  },
});
