import axios from "@/lib/axios";

export const getUserNotifications = async (payload: any) => {
  const response = await axios.get("notifications/0/getUserNotifications", {
    params: payload,
  });
  return response.data;
};

export const getCustomer = async (customerId: string) => {
  const response = await axios.get(`customers/${customerId}`);
  return response.data;
}

export const getUser = async (userId: string) => {
  const response = await axios.get(`users/${userId}`);
  return response.data;
}
