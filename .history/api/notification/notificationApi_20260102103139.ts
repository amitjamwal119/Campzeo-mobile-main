// notificationApi.ts
import axios from "axios";
import { BASE_URL } from "../config";

export const getNotifications = async (page = 1, limit = 5) => {
  return axios.get(`${BASE_URL}/notifications`, {
    params: { page, limit },
  });
};
