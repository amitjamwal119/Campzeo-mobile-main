import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../config";

export const getNotifications = async (page = 1, limit = 5) => {
  const token = await AsyncStorage.getItem("accessToken"); // 👈 adjust key if needed

  const response = await axios.get(
    `${BASE_URL}/notifications`,
    {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
