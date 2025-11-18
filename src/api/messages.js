import { api } from "./axios";

export const getMessages = async (chatId) => {
  const res = await api.get(`/messages?chatId=${chatId}`);
  return res.data;
};

export const sendMessage = async (msg) => {
  const res = await api.post("/messages", msg);
  return res.data;
};
