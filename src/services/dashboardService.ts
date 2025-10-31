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
