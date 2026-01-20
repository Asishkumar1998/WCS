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

export const shippingLabelUpload = async (payload: any) => {
  const response = await axiosInstance.post("shippingLabel", payload);
  return response.data;
}

export const shippingDetailsUpload = async (payload: any) => {
  const response = await axiosInstance.post("shippingDetails", payload);
  return response.data;
}

export const SplitOrder = async (orderId: string) => {
  const response = await axiosInstance.get(`orders/splitOrder?orderId=${orderId}`);
  return response.data;
}

export const getOrder = async (orderId: number) => {
  const response = await axiosInstance.get(`orders/${orderId}`);
  return response.data;
}

export const getBarcode = async (docId: number) => {
  const response = await axiosInstance.get(`docsBarcode/fromDocId?docId=${docId}`);
  return response.data;
}

export const getRegionAddress = async (regionAddressId: number) => {
  const response = await axiosInstance.get(`regionAddresses/${regionAddressId}`);
  return response.data;
}

export const getRegion = async () => {
  const response = await axiosInstance.get("regions/{id}");
  return response.data;
}