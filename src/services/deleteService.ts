import axiosInstance from "@/lib/axios";

export const getDocFees = async (docId: number) => {
  const response = await axiosInstance.get(`docFees?select.fields=docFeeId&docId=${docId}`);
  return response.data;
}

export const getDocStops = async (docId: number) => {
  const response = await axiosInstance.get(`docStops?select.fields=docStopId&docId=${docId}`);
  return response.data;
}

export const getDocStatus = async (docId: number) => {
  const response = await axiosInstance.get(`docsStatus?select.fields=docStatusId&docId=${docId}`);
  return response.data;
}

export const getDocAttachments = async (docId: number) => {
  const response = await axiosInstance.get(`attachments?select.fields=attachmentId&docId=${docId}`);
  return response.data;
}

export const deleteDocFee = async (docFeeId: number) => {
  const response = await axiosInstance.delete(`docFees/${docFeeId}`);
  return response.data;
}

export const deleteDocStops = async (docStopId: number) => {
  const response = await axiosInstance.delete(`docStops/${docStopId}`);
  return response.data;
}

export const deleteDocStatus = async (docStatusId: number) => {
  const response = await axiosInstance.delete(`docsStatus/${docStatusId}`);
  return response.data;
}

export const deleteDocAttachments = async (docAttachmentId: number) => {
  const response = await axiosInstance.delete(`attachments/${docAttachmentId}`);
  return response.data;
}

export const deleteDoc = async (docId: number) => {
  const response = await axiosInstance.delete(`docs/${docId}`);
  return response.data;
}

