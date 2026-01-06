// notificationApi.ts
import axios from "axios";
import { BASE_URL } from "../config";

export const getNotifications = async (page = 1, limit = 5) => {
  const response = await axios.get(
    `${BASE_URL}/notifications`,
    {
      params: { page, limit },
    }
  );

  return response.data;
};
