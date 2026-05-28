import axiosInstance from "@/lib/axios";
import axios from "@/lib/axios";

export const getNews = async (payload: any) => {
  const response = await axios.get("news/getBlobNews", {
    params: payload,
  });
  return response.data;
};

export const getUpdates = async (payload: any) => {
  const response = await axios.get("wcsupdates", {
    params: payload,
  });
  return response.data;
};

export const getFAQ = async () => {
  const response = await axiosInstance.get("faqs");
  return response.data;
}

export const getProfile = async (userId: number) => {
  const response = await axiosInstance.get(`customers/getUserProfileData?userId=${userId}`);
  return response.data;
};

export const updateProfile = async (userId: number, payload: any) => {
  const response = await axiosInstance.put(`customers/${userId}`, payload);
  return response.data;
};

export const getCustomer = async (customerId: number) => {
  const response = await axiosInstance.get(`customers/${customerId}`);
  return response.data;
}

export const updateDefaultAddress = async (
  customerId: number,
  payload: { shippingAddressId?: number; billingAddressId?: number }
) => {
  const response = await axiosInstance.put(`/customers?customerId=${customerId}`, payload);
  return response.data;
};

export const getAccesibleCustomers = async()=>{
  const response = await axiosInstance.get("customers/accessibleCustomers");
  return response.data;
}
export const getAccessibleCustomersUsers = async(customerIds: number[])=>{
  const response = await axiosInstance.get(`users?companyName.in=${customerIds.join(",")}`);
  return response.data;
}

export const addAddress = async (payload: any) => {
  const response = await axiosInstance.post("addresses", payload);
  return response.data;
}

export const updateAddress = async (addressId: any, payload: any) => {
  const response = await axiosInstance.put(`addresses?addressId=${addressId}`, payload);
  return response.data;
}

export const getGraphData = async (userId: number) => {
  const response = await axiosInstance.get(`orders/GetGraphData?userId=${userId}`);
  return response.data;
}

export const getWelcomeMessage = async (userId: number) => {
  const response = await axiosInstance.get(`loginWelcomeMessages?userId=${userId}`);
  return response.data[0];
}

export const fetchAttachment = async (referenceId: number) => {
  try {

    const response = await axiosInstance.get(
      `documentattachments/GetWCSAttchment?documentId=${referenceId}`
    );
    return response;

  } catch (error) {

    console.log("Attachment API Error:", error);

    return null;
  }
};