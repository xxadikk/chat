import { api } from "./axios";

export const getChats = async () => {
  const res = await api.get("/chats");
  return res.data;
};

export const findChat = async (user1, user2) => {
  const allChats = await getChats();

  const personalChat = allChats.find((chat) => {
    const members = chat.members;
    const isPersonalArray = Array.isArray(members);

    if (isPersonalArray) {
      const isTwoMembers = members.length === 2;
      const hasCorrectMembers =
        members.includes(user1) && members.includes(user2);

      return isTwoMembers && hasCorrectMembers;
    }

    return false;
  });

  return personalChat || null;
};

export const createChat = async (members) => {
  const res = await api.post("/chats", { members });
  return res.data;
};

export const updateChat = async (id, patch) => {
  const res = await api.patch(`/chats/${id}`, patch);
  return res.data;
};
