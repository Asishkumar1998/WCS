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

export const getCustomerId = async (userId: string) => {
  try {
    const response = await axios.get(`users/${userId}`);
    return response.data[0].companyName;
  } catch (err) {
    console.error("Error fetching customerId", err);
    throw err;
  }
};

export const updatePassword = async (userId: number, payload: any) => {
  try {
    const response = await axios.put(`users/${userId}/changepassword`, payload);
    return response.data;
  } catch (err) {
    console.log("Error in updating password", err);
    throw err;
  }
}

export const forgotPassword = async (email: string) => {
  const response = await axios.put("users/forgotPassword", { "email": email });
  return response.data;
};

export const getCountries = async () => {
  const response = await axios.get("countries");
  return response.data;
};

export const getIndustryTypes=async ()=>{
  const response=await axios.get("lookups?lookupType.EQ=IndustryType")
  return response.data;
}

export const getFindUsTypes=async ()=>{
  const response=await axios.get("lookups?lookupType.EQ=FindUS")
  return response.data;
}

export const getCustomerTypes=async ()=>{
  const response=await axios.get("lookups?lookupType.EQ=CustomerType")
  return response.data;
}

export const signupCustomer=async (payload:any)=>{
  const response=await axios.post("users/signup",payload)
  return response.data;
}
