import axiosInstance from "@/lib/axios";

export const getCustomerNotification = async (orderId: number) => {
  const response = await axiosInstance.get(`notifications?order.desc.by=createdAt&orderId=${orderId}`);
  return response.data;
};

export const updateNotification = async (notificationId: number, payload: any) => {
    const response = await axiosInstance.put(`notifications/${notificationId}`, payload);
    return response.data;
}

export const addNotification = async (payload: any) => {
    const response = await axiosInstance.post("notifications", payload);
    return response.data;
}

export const addNotificationHistory = async (payload: any) => {
    const response = await axiosInstance.post("notificationHistory", payload);
    return response.data;
}

export const downloadAttachment = async (
  attachmentId: number
) => {
  const response = await axiosInstance.get(
    `documentattachments/${attachmentId}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

