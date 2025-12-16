import http from "./https";


export const fetchLogs = async () => {
    try {
        const response = await http.get("/logs");
        return response.data;
    }
    catch (error) {
        console.log("Fetching Logs Error:", error);
    }
}