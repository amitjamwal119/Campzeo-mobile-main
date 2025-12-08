import http from "./http";


export const fetchInvoices = async () => {
    try {
        const response = await http.get("/invoices");
        return response.data;
    }
    catch (error) {
        console.log("Fetching Logs Error:", error);
    }
}