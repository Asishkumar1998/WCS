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

export const getOrderIdOfCart = async (payload: any) => {
  const response = await axiosInstance.get("orders/GetCartOrderId", {
    params: payload,
  });
  return response.data;
}

export const getOrderDetails = async (payload: any) => {
  const response = await axiosInstance.get("orders?explicit.fields=dockets,orderpayments&", {
    params: payload,
  });
  return response.data;
};

export const getFeeTypes = async () => {
  const response = await axiosInstance.get("feeTypes");
  return response.data;
}