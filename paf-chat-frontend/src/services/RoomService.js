import { httpClient } from "../config/AxiosHelper";

export const createRoomApi = async (roomId) => {
  const response = await httpClient.post(`/api/v1/rooms`, roomId, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
  return response.data;
};

export const joinChatApi = async (roomId) => {
  try {
    const response = await httpClient.get(`/api/v1/rooms/${roomId}`);
    return response.data;
  } catch (error) {
    console.error("Error joining chat:", error);
    throw error;
  }
};

export const getMessagess = async (roomId, size = 50, page = 0) => {
  const response = await httpClient.get(
    `/api/v1/rooms/${roomId}/messages?size=${size}&page=${page}`
  );
  return response.data;
};