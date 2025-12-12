import axios from "axios";

const http = axios.create({
    baseURL : "http://10.0.2.2:5000"
    // process.env.API_BASE_URL 
});

export default http;

