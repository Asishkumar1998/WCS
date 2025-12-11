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

export const exportDataToExcel = async (payload: any) => {
  const response = await axiosInstance.post("orders/exportSearchOrders", payload, {
    responseType: "arraybuffer",
  });
  return response.data;
};

export const getLookup = async (payload: any) => {
  const response = await axiosInstance.get("lookups", {
    params: payload,
  });
  return response.data;
};

export const getAttachments = async (payload: any) => {
  const response = await axiosInstance.get("docs/attachments", {
    params: payload,
  });
  return response.data;
};

export const getShippingDetails = async (payload: any) => {
  const response = await axiosInstance.get("docs/getShippingDetails", {
    params: payload,
  });
  return response.data;
};
export const getConversationAttachments = async (payload: any) => {
  const response = await axiosInstance.get("docs/getConversationAttachments", {
    params: payload,
  });
  return response.data;
};

export const getBill = async (payload: any) => {
  const response = await axiosInstance.get("bills/getBill", {
    params: payload,
  });
  return response.data;
};

export const postTranslationOrder = async (payload: any) => {
  const response = await axiosInstance.post("orders/", payload);
  return response.data;
}

export const uploadFile = async (payload: any) => {
  const response = await axiosInstance.post("documents/UploadFile", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};