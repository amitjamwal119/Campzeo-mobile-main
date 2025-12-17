import { getAuthToken } from "@/lib/authToken";
import axios from "axios";

const https = axios.create({
    baseURL : "https://campzeo-v1-oym2.vercel.app/api"
    https://campzeo-v1-oym2.vercel.app/api
    // "http://10.0.2.2:5000"
    // process.env.API_BASE_URL 
});

https.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);





export default https;

