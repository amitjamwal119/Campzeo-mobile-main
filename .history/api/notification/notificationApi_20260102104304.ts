import { useAuth } from "@clerk/clerk-expo";

const { getToken } = useAuth();

const fetchNotifications = async () => {
  try {
    setLoading(true);

    // Get Clerk token
    const token = await getToken();

    // Pass token as first argument
    const res = await getNotificationsApi(token, 1, 5);

    const formatted = res.notifications.map(formatNotification);
    setNotifications(formatted);
  } catch (error) {
    console.log("Notification API error:", error);
  } finally {
    setLoading(false);
  }
};
