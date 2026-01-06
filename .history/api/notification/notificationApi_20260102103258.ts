// notificationApi.ts
import axios from "axios";
import { BASE_URL } from "../config";

export type AuthToken = string;

export const getNotificationsApi = async (
  token: AuthToken,
  page: number = 1,
  limit: number = 5
) => {
  try {
    const response = await axios.get(`${BASE_URL}/notifications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { page, limit },
    });

    return response.data;
  } catch (error: any) {
    console.error("Get Notifications API Error:", error.response || error.message);
    throw error;
  }
};
