import { api } from "./axios";

export const findUserByPhone = async (phone) => {
  const res = await api.get(`/users?phone=${encodeURIComponent(phone)}`);
  return res.data[0] || null;
};

export const createUser = async (data) => {
  const res = await api.post("/users", data);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};
