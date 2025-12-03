import axiosInstance from "@/lib/axios";

export const getRegionAddresses = async (payload: any) => {
  const response = await axiosInstance.get("regionAddresses", {
    params: payload,
  });
  return response.data;
};

export const updateRegionAddress = async (id: number, payload: any) => {
  const response = await axiosInstance.put(`regionAddresses/${id}`, payload);
  return response.data;
};

export const addRegionAddress = async (payload: any) => {
    const response = await axiosInstance.post("regionAddresses", payload);
    return response.data;
};

export const updateShippingDetails = async (id: number, payload: any) => {
  const response = await axiosInstance.put(`orders/${id}`, payload);
  return response.data;
};
