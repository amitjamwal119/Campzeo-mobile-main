// invoicesApi.ts
import { InvoicesResponse } from "@/types/types";
import https from "./https";

export const fetchInvoices = async (
  userId: string
): Promise<InvoicesResponse> => {
  try {
    const response = await https.get<InvoicesResponse>(
      `/invoices?userId=${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "YEKa-f39c7b12e84d56a1c92f0b4c77e9d3",
        },
      }
    );
    // console.log(response.data);
    return response.data;

  } catch (error) {
    console.log("Fetching Invoices Error:", error);
    return { invoices: [] };
  }
};
