import http from "./https";


export const fetchPosts = async () => {
    try {
        const response = await http.get("/posts");
        return response.data;
    }
    catch (error) {
        console.log("Fetching Posts Error:", error);
    }
}