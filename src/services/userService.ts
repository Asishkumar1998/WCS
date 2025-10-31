import axios from "@/lib/axios";

export const getUserNotifications = async (payload: any) => {
  const response = await axios.get("notifications/0/getUserNotifications", {
    params: payload,
  });
  return response.data;
};
