import axiosInstance from "@/lib/axios";

export const getDocStops = async (payload: any) => {
  const response = await axiosInstance.get("docs/docStopDays", {
    params: payload,
  });
  return response.data;
};

export const getAllStops = async () => {
  const response = await axiosInstance.get("stops");
  return response.data;
};

export const getRegionNoteAddress = async (customerId: number, regionNote: string) => {
  const response = await axiosInstance.get("orders/regionAddress?customerId=" + customerId + "&regionNote=" + regionNote);
  return response.data;
}
