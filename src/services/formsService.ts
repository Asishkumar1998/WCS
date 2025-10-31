import axiosInstance from "@/lib/axios";

export const getCountries = async (payload: any) => {
  const response = await axiosInstance.get("countries", {
    params: payload,
  });
  return response.data;
};
