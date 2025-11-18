import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { findChat, createChat } from "../../api/chat";

export const getOrCreateChat = createAsyncThunk(
  "chats/getOrCreateChat",
  async ({ userId, otherId }) => {
    let chat = await findChat(userId, otherId);
    if (!chat) {
      chat = await createChat([userId, otherId]);
    }
    return chat;
  }
);

const chatsSlice = createSlice({
  name: "chats",
  initialState: { current: null, list: [], status: "idle" },
  reducers: {
    setCurrent(state, action) {
      state.current = action.payload;
    },
    setList(state, action) {
      state.list = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getOrCreateChat.fulfilled, (state, action) => {
      state.current = action.payload;
    });
  },
});

export const { setCurrent, setList } = chatsSlice.actions;
export default chatsSlice.reducer;
