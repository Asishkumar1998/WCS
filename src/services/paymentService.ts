import axiosInstance from "@/lib/axios";
import { emitCartUpdated } from "@/lib/cartBadgeEvents";

export const createPaymentInitiated = async (payload: any) => {
  const response = await axiosInstance.post("payments", payload);
  return response.data;
};

export const processTransaction = async (payload: any) => {
  const response = await axiosInstance.post("docs/0/pay", payload);
  return response.data;
};

export const processPayLater = async (payload: any) => {
  const response = await axiosInstance.post("docs/0/postMail", payload);
  return response.data;
};

export const updatePayment = async (payload: any) => {
  const response = await axiosInstance.put("payments", payload);
  return response.data;
};

export const updateOrder = async (orderId: number, payload: any) => {
  const response = await axiosInstance.put(`orders/${orderId}`, payload);
  emitCartUpdated();
  return response.data;
};

export const applyPromoCode = async (payload: any) => {
  const response = await axiosInstance.put("promocodes/0/apply", payload);
  return response.data;
};

export const createOrderPayment = async (payload: any) => {
  const response = await axiosInstance.post("orderPayments", payload);
  return response.data;
};

export const updatePaymentRequest = async (requestId: number, payload: any) => {
  const response = await axiosInstance.put(`paymentRequests/${requestId}`, payload);
  return response.data;
};

export const sendPaymentConfirmationNotification = async (orderId: number, transId: string, amount: number) => {
  const response = await axiosInstance.get(
    `payments/confirmationNotification?orderId=${orderId}&transactionId=${transId}&paymentAmount=${amount}`
  );
  return response.data;
};


