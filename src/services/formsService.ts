import axiosInstance from "@/lib/axios";

export const getCountries = async (payload: any) => {
  const response = await axiosInstance.get("countries", {
    params: payload,
  });
  return response.data;
};

export const getDocumentTypes = async (payload: any) => {
  const response = await axiosInstance.get("docTypes", {
    params: payload,
  });
  return response.data;
};

export const getDisplayData = async (payload: any) => {
  const response = await axiosInstance.post("orders/getDisplayData", payload);
  return response.data;
};
