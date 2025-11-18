import { api } from "./axios";

export const findChat = async (user1, user2) => {
  const res = await api.get(
    `/chats?members_like=${user1}&members_like=${user2}`
  );
  return res.data[0] || null;
};

export const createChat = async (members) => {
  const res = await api.post("/chats", { members });
  return res.data;
};

export const getChats = async () => {
  const res = await api.get("/chats");
  return res.data;
};
